"""Unit tests for the portfolio agent — no network calls.

Run from the repo root:  python3 -m pytest tests/ -q
"""

import json
import sys
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient
from groq import BadRequestError, RateLimitError
from langchain_core.messages import ToolMessage

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import agent.graph as graph  # noqa: E402
import app as app_module  # noqa: E402
from agent.data import FEATURED_PROJECTS  # noqa: E402
from agent.knowledge import load_chunks  # noqa: E402
from agent.schemas import (  # noqa: E402
    AgentResponse,
    TextBlock,
    make_fallback_response,
)
from agent.tools import get_availability, get_contact, list_projects  # noqa: E402


# ── knowledge base ──────────────────────────────────────────────────────────

def test_knowledge_base_has_57_chunks():
    chunks = load_chunks()
    assert len(chunks) == 57  # 18 hand-written + 39 generated project chunks
    assert {c["topic"] for c in chunks} == {
        "bio", "skills", "experience", "projects", "contact", "catalog",
    }
    sources = [c["source"] for c in chunks]
    assert len(sources) == len(set(sources)), "source ids must be unique"


def test_every_chunk_has_body_text():
    for chunk in load_chunks():
        assert len(chunk["text"]) > 40, chunk["source"]


def test_catalog_covers_every_site_project():
    from agent.catalog import ALL_PROJECTS

    assert len(ALL_PROJECTS) == 39
    catalog_chunks = [c for c in load_chunks() if c["topic"] == "catalog"]
    assert len(catalog_chunks) == len(ALL_PROJECTS)


# ── tools ───────────────────────────────────────────────────────────────────

def test_list_projects_filters_by_stack_keyword():
    stripe = json.loads(list_projects.invoke({"stack": "stripe"}))
    assert stripe[0]["title"] == "NOVA E-Commerce Platform"
    assert all(
        "stripe" in p["title"].lower() or any("stripe" in t.lower() for t in p["stack"])
        for p in stripe
    )

    npm = json.loads(list_projects.invoke({"stack": "npm"}))
    assert [p["title"] for p in npm] == ["Liquid Reveal"]


def test_list_projects_respects_limit():
    items = json.loads(list_projects.invoke({"limit": 2}))
    assert len(items) == 2
    assert all({"title", "emoji", "stack", "live", "repo", "summary"} <= set(p) for p in items)


def test_list_projects_returns_all_by_default():
    items = json.loads(list_projects.invoke({}))
    assert len(items) == 5  # default cap; featured projects come first
    assert len(json.loads(list_projects.invoke({"limit": 50}))) == 8  # hard cap


def test_get_contact_and_availability():
    contact = json.loads(get_contact.invoke({}))
    assert contact["email"] == "qazithekingston@gmail.com"
    assert "wa.me" in contact["whatsapp"]
    assert "available" in get_availability.invoke({}).lower()


# ── schemas & fallback ──────────────────────────────────────────────────────

def test_fallback_response_shape():
    resp = make_fallback_response()
    assert resp.intent == "fallback"
    assert [b.type for b in resp.blocks] == ["text", "contact_card"]
    assert 2 <= len(resp.suggestions) <= 3


def test_blocks_are_a_discriminated_union():
    with pytest.raises(Exception):
        AgentResponse.model_validate(
            {"intent": "bio", "blocks": [{"type": "unknown-type"}]}
        )


# ── agent loop with a fake model ────────────────────────────────────────────
class FakeAgent:
    def __init__(self, response=None, error=None, messages=None):
        self._response = response
        self._error = error
        self._messages = messages or []

    def invoke(self, _payload):
        if self._error:
            raise self._error
        return {"messages": self._messages, "structured_response": self._response}


def _grounded(trace=(), sources=()):
    return AgentResponse(
        intent="bio",
        blocks=[TextBlock(type="text", content="Qazi is a full-stack engineer.")],
        trace=list(trace),
        sources=list(sources),
        suggestions=["a", "b", "c", "d", "e"],
    )


def _evidence(name="search_knowledge"):
    return ToolMessage(content='{"result": "..."}', name=name, tool_call_id="call_1")


def _rate_limit_error():
    request = httpx.Request("POST", "https://api.groq.com/openai/v1/chat/completions")
    return RateLimitError(
        "429 rate limit", response=httpx.Response(429, request=request), body=None
    )


def test_run_agent_normalizes_lists(monkeypatch):
    monkeypatch.setattr(
        graph,
        "get_agent",
        lambda: FakeAgent(
            _grounded(trace=["t", "t", "u"], sources=["bio", "bio"]),
            messages=[_evidence()],
        ),
    )
    resp = graph.run_agent("who is he?")
    assert resp.trace == ["t", "u"]
    assert resp.sources == ["knowledge base"]
    assert len(resp.suggestions) == 3


def test_guardrail_falls_back_without_tool_evidence(monkeypatch):
    monkeypatch.setattr(
        graph,
        "get_agent",
        lambda: FakeAgent(_grounded(trace=[], sources=[])),  # grounded intent, no tools
    )
    resp = graph.run_agent("what projects has he built?")
    assert resp.intent == "fallback"
    assert any(b.type == "contact_card" for b in resp.blocks)


def test_guardrail_ignores_self_reported_trace(monkeypatch):
    monkeypatch.setattr(
        graph,
        "get_agent",
        lambda: FakeAgent(_grounded(trace=["listed projects"], sources=["projects"])),
    )
    assert graph.run_agent("what projects has he built?").intent == "fallback"


def test_sources_derived_from_tool_evidence(monkeypatch):
    monkeypatch.setattr(
        graph,
        "get_agent",
        lambda: FakeAgent(
            _grounded(trace=[], sources=["ignored"]),
            messages=[_evidence("list_projects"), _evidence("get_contact")],
        ),
    )
    resp = graph.run_agent("what projects has he built?")
    assert resp.sources == ["projects", "contact"]


def test_smalltalk_needs_no_tools(monkeypatch):
    resp = AgentResponse(
        intent="smalltalk",
        blocks=[TextBlock(type="text", content="Hi!")],
    )
    monkeypatch.setattr(graph, "get_agent", lambda: FakeAgent(resp))
    out = graph.run_agent("hi")
    assert out.intent == "smalltalk"
    assert [b.type for b in out.blocks] == ["text"]


def test_run_agent_validates_dict_response(monkeypatch):
    raw = _grounded(trace=["searched knowledge base"], sources=["bio"]).model_dump()
    monkeypatch.setattr(graph, "get_agent", lambda: FakeAgent(raw, messages=[_evidence()]))
    out = graph.run_agent("who is he?")
    assert isinstance(out, AgentResponse)
    assert out.intent == "bio"


def test_run_agent_raises_upstream_error(monkeypatch):
    monkeypatch.setattr(
        graph, "get_agent", lambda: FakeAgent(error=RuntimeError("groq down"))
    )
    with pytest.raises(graph.AgentUpstreamError):
        graph.run_agent("hello?")


def test_run_agent_raises_rate_limit_error(monkeypatch):
    monkeypatch.setattr(
        graph, "get_agent", lambda: FakeAgent(error=_rate_limit_error())
    )
    with pytest.raises(graph.AgentRateLimitError):
        graph.run_agent("hello?")


def test_run_agent_rejects_missing_structured_response(monkeypatch):
    monkeypatch.setattr(graph, "get_agent", lambda: FakeAgent(response=None))
    with pytest.raises(graph.AgentUpstreamError):
        graph.run_agent("hello?")


# ── structured-output resilience (salvage / corrective / transient) ─────────

class SequenceAgent:
    """Fake whose invoke() walks a script of steps (last step repeats)."""

    def __init__(self, *steps):
        self.steps = list(steps)
        self.calls = 0

    def invoke(self, _payload):
        step = self.steps[min(self.calls, len(self.steps) - 1)]
        self.calls += 1
        if isinstance(step, Exception):
            raise step
        return step


def _result(response=None, messages=None):
    return {"messages": messages or [], "structured_response": response}


def _tool_use_failed(failed_generation: object):
    error = {"code": "tool_use_failed", "failed_generation": failed_generation}
    request = httpx.Request("POST", "https://api.groq.com/openai/v1/chat/completions")
    return BadRequestError(
        "Error code: 400",
        response=httpx.Response(400, request=request, json={"error": error}),
        body={"error": error},
    )


class _Fake500(Exception):
    status_code = 500


def test_salvage_uses_valid_failed_generation(monkeypatch):
    payload = _grounded(trace=["searched knowledge base"]).model_dump()
    agent = SequenceAgent(_tool_use_failed(json.dumps(payload)))
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("who is Qazi?")
    assert resp.intent == "bio"
    assert resp.blocks[0].type == "text"
    assert resp.sources == ["knowledge base"]
    assert agent.calls == 1  # salvaged without a second invoke


def test_salvage_unwraps_arguments_and_content_key(monkeypatch):
    payload = {
        "name": "agent_response",
        "arguments": {
            "intent": "bio",
            "content": [{"type": "text", "content": "Qazi is an engineer."}],
            "trace": ["searched knowledge base"],
            "suggestions": ["a", "b"],
        },
    }
    agent = SequenceAgent(_tool_use_failed(json.dumps(payload)))
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("who is Qazi?")
    assert resp.intent == "bio"
    assert resp.blocks[0].content == "Qazi is an engineer."
    assert resp.sources == ["knowledge base"]


def test_unsalvageable_400_triggers_corrective_reinvoke(monkeypatch):
    agent = SequenceAgent(
        _tool_use_failed("definitely not json"),
        _result(
            _grounded(trace=["listed projects"]),
            messages=[_evidence("list_projects")],
        ),
    )
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("what has he built?")
    assert resp.intent == "bio"
    assert resp.sources == ["projects"]
    assert agent.calls == 2


def test_persistent_tool_use_failed_raises_upstream(monkeypatch):
    agent = SequenceAgent(_tool_use_failed("nope"), _tool_use_failed("nope"))
    monkeypatch.setattr(graph, "get_agent", lambda: agent)
    with pytest.raises(graph.AgentUpstreamError):
        graph.run_agent("who is Qazi?")


def test_transient_5xx_retried_once(monkeypatch):
    monkeypatch.setattr(graph, "TRANSIENT_BACKOFF", 0)
    agent = SequenceAgent(
        _Fake500("upstream hiccup"),
        _result(_grounded(trace=["searched knowledge base"]), messages=[_evidence()]),
    )
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("who is Qazi?")
    assert resp.sources == ["knowledge base"]
    assert agent.calls == 2


def test_guardrail_corrective_turn_grounded_answer(monkeypatch):
    agent = SequenceAgent(
        _result(_grounded(trace=[], sources=[])),  # grounded intent, no tools
        _result(
            _grounded(trace=["searched knowledge base"]),
            messages=[_evidence()],
        ),
    )
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("what's his background?")
    assert resp.intent == "bio"
    assert resp.sources == ["knowledge base"]
    assert agent.calls == 2


def test_guardrail_turn_failure_falls_back(monkeypatch):
    agent = SequenceAgent(
        _result(_grounded(trace=[], sources=[])),
        RuntimeError("model exploded mid-guardrail"),
    )
    monkeypatch.setattr(graph, "get_agent", lambda: agent)

    resp = graph.run_agent("what's his background?")
    assert resp.intent == "fallback"
    assert any(b.type == "contact_card" for b in resp.blocks)

# ── HTTP API ────────────────────────────────────────────────────────────────

def test_health_endpoints():
    client = TestClient(app_module.app)
    assert client.get("/health").json() == {"ok": True}
    assert client.get("/api/agent/health").json() == {"ok": True}


def test_agent_endpoint_returns_structured_response(monkeypatch):
    fallback = make_fallback_response()
    monkeypatch.setattr(app_module, "run_agent", lambda message, history: fallback)

    client = TestClient(app_module.app)
    res = client.post(
        "/api/agent",
        json={"message": "what projects?", "history": [{"role": "user", "content": "hi"}]},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["intent"] == "fallback"
    assert body["blocks"][1]["type"] == "contact_card"
    assert body["suggestions"]


def test_agent_endpoint_validates_input():
    client = TestClient(app_module.app)
    assert client.post("/api/agent", json={"message": ""}).status_code == 422
    assert client.post("/api/agent", json={}).status_code == 422


def test_agent_endpoint_maps_rate_limit_to_429(monkeypatch):
    def _raise(_message, _history):
        raise graph.AgentRateLimitError("groq rate limit")

    monkeypatch.setattr(app_module, "run_agent", _raise)
    client = TestClient(app_module.app)
    res = client.post("/api/agent", json={"message": "hi"})
    assert res.status_code == 429


def test_agent_endpoint_maps_upstream_error_to_502(monkeypatch):
    def _raise(_message, _history):
        raise graph.AgentUpstreamError("model exploded")

    monkeypatch.setattr(app_module, "run_agent", _raise)
    client = TestClient(app_module.app)
    res = client.post("/api/agent", json={"message": "hi"})
    assert res.status_code == 502


# ── RAG resilience (a Jina outage must not crash the agent loop) ───────────

def test_keyword_fallback_when_embeddings_down(monkeypatch):
    import agent.rag as rag

    def _boom(_texts):
        raise httpx.HTTPStatusError(
            "jina down",
            request=httpx.Request("POST", "https://api.jina.ai/v1/embeddings"),
            response=httpx.Response(401),
        )

    monkeypatch.setattr(rag, "_store", None)
    monkeypatch.setattr(rag, "_embed", _boom)
    hits = rag.search("what is his university degree")
    assert hits, "keyword fallback should still retrieve education content"
    assert all(h["text"] and h["source"] for h in hits)


def test_keyword_fallback_relevant_for_stack_query(monkeypatch):
    import agent.rag as rag

    def _boom(_texts):
        raise RuntimeError("network down")

    monkeypatch.setattr(rag, "_store", None)
    monkeypatch.setattr(rag, "_embed", _boom)
    hits = rag.search("react typescript mongodb projects")
    assert hits
    assert any("react" in h["text"].lower() for h in hits)


def test_search_knowledge_tool_never_raises(monkeypatch):
    import agent.rag as rag
    from agent.tools import search_knowledge

    def _down(_query, **_kwargs):
        raise RuntimeError("rag down")

    monkeypatch.setattr(rag, "search", _down)
    out = search_knowledge.invoke({"query": "who is he"})
    assert isinstance(out, str)
    assert "temporarily unavailable" in out
