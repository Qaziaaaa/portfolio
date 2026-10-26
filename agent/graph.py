"""LangChain agent graph: tool loop + structured (ToolStrategy) responses."""

import os
from typing import Any

from groq import RateLimitError as GroqRateLimitError
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_groq import ChatGroq
from pydantic import ValidationError

from agent.schemas import GROUNDED_INTENTS, AgentResponse, make_fallback_response
from agent.tools import TOOLS

DEFAULT_MODEL = "openai/gpt-oss-120b"

# LangSmith: only enable when the user actually provided a key.
if os.environ.get("LANGSMITH_API_KEY"):
    os.environ.setdefault("LANGSMITH_TRACING", "true")
    os.environ.setdefault("LANGSMITH_PROJECT", "portfolio-agent")

SYSTEM_PROMPT = """\
You are the portfolio assistant for Qazi Farhan Ahmad — a Team Lead &
Full-Stack Engineer at Saylani Tech Labs in Peshawar, Pakistan, specializing in
MERN/TypeScript development with 25+ shipped applications.

Answer every question as this assistant speaking *about* Qazi in the third
person. Ground every factual claim in tool output — never invent projects,
dates, numbers, or contact details.

Rules:
1. Call tools before answering grounded questions. For questions about who he
   is, his skills, experience, projects, availability, or contact info, use
   search_knowledge (and list_projects / get_contact / get_availability when
   they fit better). Smalltalk and greetings need no tools.
2. Prefer 1-2 content blocks. Keep prose short and plain — no markdown, no
   bullet characters inside text blocks. For lists (tech stacks, skills,
   experience highlights) use a bullets block instead of one long paragraph.
   The frontend renders blocks as native components (use a project_card per
   featured project, a contact_card when sharing contact details).
3. If nothing in the tools answers the question, set intent to "fallback" and
   give a brief honest answer pointing to direct contact — do not guess.
4. Keep the tone warm, direct, and professional. Never use emoji except the
   emoji field of a project card.
5. Suggestions: 2-3 natural follow-up questions the visitor might ask next.
6. trace: one short label per tool you called, in order (e.g. "searched
   knowledge base", "listed projects"). sources: the runtime derives these
   from the tools you actually called — you may leave them empty.
"""

_agent = None

_SOURCE_LABELS = {
    "search_knowledge": "knowledge base",
    "list_projects": "projects",
    "get_contact": "contact",
    "get_availability": "availability",
}


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
        model_kwargs = {"reasoning_effort": "low", "reasoning_format": "hidden"}
    model = ChatGroq(model=model_name, api_key=_groq_key(), temperature=0, **model_kwargs)
    return create_agent(
        model=model,
        tools=TOOLS,
        system_prompt=SYSTEM_PROMPT,
        response_format=ToolStrategy(_structured_schema()),
    )


def get_agent():
    """Lazily construct the agent (model name overridable via GROQ_MODEL)."""
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


def run_agent(message: str, history: list[dict] | None = None) -> AgentResponse:
    """One agent turn → a grounded, structured AgentResponse.

    Infrastructure failures raise AgentRateLimitError / AgentUpstreamError so
    callers can tell them apart from genuine content answers.
    """
    try:
        result = get_agent().invoke({"messages": _to_messages(history or [], message)})
    except GroqRateLimitError as exc:
        print(f"[agent] rate limited: {exc}", flush=True)
        raise AgentRateLimitError("groq rate limit") from exc
    except Exception as exc:
        import traceback

        print(f"[agent] turn failed: {type(exc).__name__}: {exc}", flush=True)
        traceback.print_exc()
        raise AgentUpstreamError(str(exc)) from exc

    raw = result.get("structured_response")
    if isinstance(raw, AgentResponse):
        response = raw
    elif isinstance(raw, dict):
        try:
            response = AgentResponse.model_validate(raw)
        except ValidationError as exc:
            print(f"[agent] invalid structured response: {exc}", flush=True)
            raise AgentUpstreamError("model returned invalid structured response") from exc
    else:
        print(f"[agent] no structured_response in result (got {type(raw).__name__})", flush=True)
        raise AgentUpstreamError("model returned no structured response")

    response = _normalize(response)

    used = _tools_used(result)

    if response.intent in GROUNDED_INTENTS:
        if not used:
            print(f"[agent] guardrail: intent '{response.intent}' without tool evidence", flush=True)
            return make_fallback_response()
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
