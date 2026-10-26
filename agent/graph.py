"""LangChain agent graph: tool loop + structured (ToolStrategy) responses.

Resilience notes: gpt-oss models sometimes emit the final structured answer
as plain content instead of calling the required `agent_response` tool.
Groq rejects that with a 400 (`tool_use_failed`) carrying the model's
rejected JSON in `failed_generation` — we salvage it when valid, otherwise
re-invoke once with an explicit corrective nudge. Transient upstream
errors get one backoff retry; rate limits map to AgentRateLimitError.
"""

import json
import os
import time
import traceback
from typing import Any

import httpx
from groq import BadRequestError as GroqBadRequestError
from groq import RateLimitError as GroqRateLimitError
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_groq import ChatGroq
from pydantic import ValidationError

from agent.schemas import GROUNDED_INTENTS, AgentResponse, make_fallback_response
from agent.tools import TOOLS

DEFAULT_MODEL = "openai/gpt-oss-120b"

# Seconds before a transient (5xx / network) retry. Tests zero this.
TRANSIENT_BACKOFF = 1.0

# LangSmith: only enable when the user actually provided a key.
if os.environ.get("LANGSMITH_API_KEY"):
    os.environ.setdefault("LANGSMITH_TRACING", "true")
    os.environ.setdefault("LANGSMITH_PROJECT", "portfolio-agent")

SYSTEM_PROMPT = """\
You are the portfolio assistant for Qazi Farhan Ahmad — a Team Lead &
Full-Stack Engineer at Saylani Tech Labs in Peshawar, Pakistan, specializing in
MERN/TypeScript development with 25+ shipped applications and a catalogue of
39 projects on his site.

Answer every question as this assistant speaking *about* Qazi in the third
person. Ground every factual claim in tool output — never invent projects,
dates, numbers, or contact details.

How to answer (think through this order, every turn):
1. Resolve references first. Words like "these technologies", "that project",
   "it", "his stack" refer to earlier conversation turns — use the history
   above before deciding what to look up.
2. Plan the tools you need, then call them BEFORE writing the answer. Call
   several in one turn when the question links ideas: search_knowledge for
   facts (bio, skills, experience, education, certifications), list_projects
   for projects (pass `stack` to filter by a technology), get_contact /
   get_availability when relevant. Example: "what projects did he build with
   these technologies?" → list_projects(stack=<each mentioned tech>) plus
   search_knowledge(skills) to confirm those are his technologies.
3. Answer paraphrases confidently: a reworded question must get the same
   grounded answer, not a refusal. If one retrieval misses, reformulate the
   query and call the tool again before concluding anything is unavailable.
4. "Tell me everything about X" → synthesize every relevant fact you
   retrieved, most important first — do not summarize away the detail.
5. Finish every turn by calling the agent_response tool with your complete
   answer. Never write the answer as plain message text or raw JSON.
6. Blocks: prefer 1-3 blocks. Plain prose for paragraphs (no markdown, no
   bullet characters inside text blocks), a bullets block for lists
   (tech stacks, strengths), one project_card per featured project, a
   contact_card when sharing contact details.
7. intent must match the question: bio / skills / projects / experience /
   availability / contact for grounded topics, smalltalk for greetings, and
   fallback ONLY when the tools genuinely have nothing — never as a first
   resort.
8. Keep the tone warm, direct, and professional. Never use emoji except the
   emoji field of a project card.
9. suggestions: 2-3 natural follow-up questions the visitor might ask next.
   trace: one short label per tool you called, in order (e.g. "searched
   knowledge base", "listed projects"). sources: the runtime derives these
   from the tools you actually called — you may leave them empty.
"""

_TOOL_CALL_NUDGE = (
    "Your reply must be delivered by calling the agent_response tool — do NOT "
    "answer as plain message text or raw JSON. The tool arguments must match "
    "the schema exactly: intent (one of bio/skills/projects/experience/"
    "availability/contact/smalltalk/fallback), blocks (list of typed blocks: "
    '{"type":"text","content":...} / {"type":"bullets","items":[...]} / '
    '{"type":"project_card",...} / {"type":"contact_card",...}), plus sources, '
    "trace and suggestions. Put your full answer in the tool arguments."
)

_GUARDRAIL_NUDGE = (
    "Your answer did not include any tool calls. Grounded questions about "
    "Qazi must be backed by evidence: call search_knowledge (and "
    "list_projects / get_contact / get_availability when they fit) now, then "
    "answer from what the tools returned."
)

_agent = None

_SOURCE_LABELS = {
    "search_knowledge": "knowledge base",
    "list_projects": "projects",
    "get_contact": "contact",
    "get_availability": "availability",
}

_TRACE_HINTS = (
    ("knowledge", "search_knowledge"),
    ("search", "search_knowledge"),
    ("project", "list_projects"),
    ("list", "list_projects"),
    ("contact", "get_contact"),
    ("availab", "get_availability"),
)


class AgentRateLimitError(RuntimeError):
    """Groq rate limit (HTTP 429) — the caller should retry shortly."""


class AgentUpstreamError(RuntimeError):
    """Upstream model failure — an infrastructure error, not a content answer."""


def _structured_schema() -> dict[str, Any]:
    """AgentResponse JSON schema registered under the lowercase tool name.

    gpt-oss models normalize tool names to snake_case before calling them, so
    the structured-output tool must already be named `agent_response` — Groq
    rejects tool calls whose name is not in the request.
    """
    schema = AgentResponse.model_json_schema()
    schema["title"] = "agent_response"
    schema["description"] = (
        "Final structured answer for this turn: intent, content blocks, "
        "follow-up suggestions, sources, and grounding trace."
    )
    return schema


def _groq_key() -> str:
    key = os.environ.get("GROQ_API_KEY") or os.environ.get("VITE_GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return key


def _build_agent(model_name: str):
    model_kwargs: dict[str, Any] = {}
    if model_name.startswith("openai/gpt-oss"):
        # low = ~2-6s/turn on Groq free tier (8K TPM / 200K TPD).
        # medium measured 10-92s/turn — exceeds Vercel's maxDuration and
        # burns the daily quota in a handful of requests. Opt in only with a
        # Groq paid tier: GROQ_REASONING_EFFORT=medium.
        effort = os.environ.get("GROQ_REASONING_EFFORT", "low")
        model_kwargs = {"reasoning_effort": effort, "reasoning_format": "hidden"}
    model = ChatGroq(model=model_name, api_key=_groq_key(), temperature=0, **model_kwargs)
    return create_agent(
        model=model,
        tools=TOOLS,
        system_prompt=SYSTEM_PROMPT,
        response_format=ToolStrategy(_structured_schema()),
    )


def get_agent():
    """Lazily construct the agent (model/effort overridable via env)."""
    global _agent
    if _agent is None:
        _agent = _build_agent(os.environ.get("GROQ_MODEL", DEFAULT_MODEL))
    return _agent


def _to_messages(history: list[dict], message: str) -> list[Any]:
    messages: list[Any] = []
    for turn in history[-8:]:
        role = turn.get("role")
        content = (turn.get("content") or "").strip()
        if not content or role not in ("user", "assistant"):
            continue
        cls = HumanMessage if role == "user" else AIMessage
        messages.append(cls(content=content))
    messages.append(HumanMessage(content=message))
    return messages


def _normalize(response: AgentResponse) -> AgentResponse:
    """Dedupe/cap free-form list fields."""
    response.blocks = response.blocks[:3]

    def unique(values: list[str], cap: int) -> list[str]:
        seen: list[str] = []
        for value in values:
            value = value.strip()
            if value and value not in seen:
                seen.append(value)
        return seen[:cap]

    response.trace = unique(response.trace, 6)
    response.sources = unique(response.sources, 6)
    response.suggestions = unique(response.suggestions, 3)
    return response


def _tools_used(result: dict[str, Any]) -> list[str]:
    """Names of our knowledge tools the loop actually executed, in call order."""
    used: list[str] = []
    for message in result.get("messages", []):
        name = message.name if isinstance(message, ToolMessage) else None
        if name in _SOURCE_LABELS and name not in used:
            used.append(name)
    return used


def _tools_from_trace(labels: list[str]) -> list[str]:
    """Reverse-map free-form trace labels (salvage path) to tool names."""
    used: list[str] = []
    for label in labels:
        low = label.lower()
        for hint, tool in _TRACE_HINTS:
            if hint in low and tool not in used:
                used.append(tool)
    return used


def _failed_generation_payload(exc: GroqBadRequestError) -> dict[str, Any] | None:
    """Extract the model's rejected JSON from a tool_use_failed 400, if any."""
    body = getattr(exc, "body", None)
    err: Any = body
    if isinstance(body, dict) and isinstance(body.get("error"), dict):
        err = body["error"]
    if not isinstance(err, dict):
        return None
    raw = err.get("failed_generation")
    if not isinstance(raw, str) or not raw.strip():
        return None
    try:
        data = json.loads(raw)
    except ValueError:
        return None
    if not isinstance(data, dict):
        return None
    if isinstance(data.get("arguments"), dict):  # wrapped {"name","arguments"}
        data = data["arguments"]
    if "blocks" not in data and isinstance(data.get("content"), list):
        data = {**data, "blocks": data.pop("content")}  # common misspelling
    return data


def _salvage(exc: GroqBadRequestError) -> tuple[AgentResponse, list[str]] | None:
    """Turn a rejected-but-valid generation into a response (+ tool names)."""
    data = _failed_generation_payload(exc)
    if data is None:
        return None
    try:
        response = AgentResponse.model_validate(data)
    except ValidationError as exc_v:
        errors = exc_v.errors()
        print(f"[agent] salvage invalid: {errors[0].get('msg')} for {errors[0].get('loc')}", flush=True)
        return None
    if not response.blocks:
        return None
    return response, _tools_from_trace(response.trace)


def _extract(result: dict[str, Any]) -> tuple[AgentResponse, list[str]] | None:
    """Parse a normal invoke result into (response, tools used) — or None."""
    raw = result.get("structured_response")
    if isinstance(raw, AgentResponse):
        response = raw
    elif isinstance(raw, dict):
        try:
            response = AgentResponse.model_validate(raw)
        except ValidationError as exc:
            print(f"[agent] invalid structured response: {exc.errors()[0].get('msg')}", flush=True)
            return None
    else:
        print(f"[agent] no structured_response in result (got {type(raw).__name__})", flush=True)
        return None
    if not response.blocks:
        print("[agent] structured response had no blocks", flush=True)
        return None
    return response, _tools_used(result)


def _is_transient(exc: Exception) -> bool:
    if isinstance(exc, (httpx.TransportError, httpx.TimeoutException)):
        return True
    if isinstance(exc, (ConnectionError, TimeoutError)):
        return True
    status = getattr(exc, "status_code", None)
    if isinstance(status, int) and status >= 500:
        return True
    return type(exc).__name__ in {"APIConnectionError", "APITimeoutError", "InternalServerError"}


def _structured_turn(messages: list[Any], label: str) -> tuple[AgentResponse, list[str]]:
    """One resilient agent turn → (response, tool names used).

    Handles: tool_use_failed salvage → corrective re-invoke → transient
    retry, in that order. Raises the typed agent errors when exhausted.
    """
    last_error: Exception | None = None
    nudged = False
    for attempt in range(2):
        try:
            result = get_agent().invoke({"messages": messages})
        except GroqRateLimitError as exc:
            print(f"[agent] rate limited: {exc}", flush=True)
            raise AgentRateLimitError("groq rate limit") from exc
        except GroqBadRequestError as exc:
            salvaged = _salvage(exc)
            if salvaged is not None:
                print(f"[agent] {label}: salvaged failed_generation", flush=True)
                return salvaged
            last_error = exc
            if nudged:
                break
            nudged = True
            messages = [*messages, HumanMessage(content=_TOOL_CALL_NUDGE)]
            print(f"[agent] {label}: tool_use_failed → corrective re-invoke", flush=True)
            continue
        except Exception as exc:
            if _is_transient(exc) and attempt == 0:
                print(f"[agent] {label}: transient {type(exc).__name__} → retry", flush=True)
                time.sleep(TRANSIENT_BACKOFF)
                continue
            print(f"[agent] {label} turn failed: {type(exc).__name__}: {exc}", flush=True)
            traceback.print_exc()
            raise AgentUpstreamError(str(exc)) from exc

        parsed = _extract(result)
        if parsed is not None:
            return parsed
        last_error = RuntimeError("model returned no usable structured response")
        if nudged:
            break
        nudged = True
        messages = [*messages, HumanMessage(content=_TOOL_CALL_NUDGE)]
        print(f"[agent] {label}: unusable structured response → corrective re-invoke", flush=True)

    raise AgentUpstreamError(str(last_error))


def run_agent(message: str, history: list[dict] | None = None) -> AgentResponse:
    """One agent turn → a grounded, structured AgentResponse.

    Infrastructure failures raise AgentRateLimitError / AgentUpstreamError so
    callers can tell them apart from genuine content answers.
    """
    messages = _to_messages(history or [], message)
    response, used = _structured_turn(messages, label="primary")

    if response.intent in GROUNDED_INTENTS and not used:
        print(f"[agent] guardrail: intent '{response.intent}' without tool evidence → corrective turn", flush=True)
        try:
            response, used = _structured_turn(
                [*messages, HumanMessage(content=_GUARDRAIL_NUDGE)],
                label="guardrail",
            )
        except (AgentRateLimitError, AgentUpstreamError) as exc:
            print(f"[agent] guardrail turn failed ({type(exc).__name__}) → fallback", flush=True)
            return make_fallback_response()
        if response.intent in GROUNDED_INTENTS and not used:
            print("[agent] guardrail still ungrounded → fallback", flush=True)
            return make_fallback_response()

    response = _normalize(response)

    if response.intent in GROUNDED_INTENTS:
        response.sources = [_SOURCE_LABELS[name] for name in used]

    if not response.blocks:
        print("[agent] empty blocks — falling back", flush=True)
        return make_fallback_response()

    print(
        f"[agent] turn ok: intent={response.intent} blocks={len(response.blocks)} "
        f"sources={response.sources}",
        flush=True,
    )
    return response
