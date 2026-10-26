"""Unit tests for the portfolio agent — no network calls.

Run from the repo root:  python3 -m pytest tests/ -q
"""

import json
import sys
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient
from groq import RateLimitError
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

def test_knowledge_base_has_18_chunks():
    chunks = load_chunks()
    assert len(chunks) == 18
    assert {c["topic"] for c in chunks} == {
        "bio", "skills", "experience", "projects", "contact",
    }
    sources = [c["source"] for c in chunks]
    assert len(sources) == len(set(sources)), "source ids must be unique"


def test_every_chunk_has_body_text():
    for chunk in load_chunks():
        assert len(chunk["text"]) > 40, chunk["source"]


# ── tools ───────────────────────────────────────────────────────────────────

def test_list_projects_filters_by_stack_keyword():
    only_stripe = json.loads(list_projects.invoke({"stack": "stripe"}))
    assert [p["title"] for p in only_stripe] == ["NOVA E-Commerce Platform"]

    npm = json.loads(list_projects.invoke({"stack": "npm"}))
    assert [p["title"] for p in npm] == ["Liquid Reveal"]


def test_list_projects_respects_limit():
    items = json.loads(list_projects.invoke({"limit": 2}))
    assert len(items) == 2
    assert all({"title", "emoji", "stack", "live", "repo", "summary"} <= set(p) for p in items)


def test_list_projects_returns_all_by_default():
    items = json.loads(list_projects.invoke({}))
    assert len(items) == len(FEATURED_PROJECTS)


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
