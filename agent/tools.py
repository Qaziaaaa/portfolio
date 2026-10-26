"""Agent tools — the actions the model can take each turn."""

import json

from langchain_core.tools import tool

from agent import rag
from agent.data import AVAILABILITY, CONTACT, FEATURED_PROJECTS


@tool
def search_knowledge(query: str) -> str:
    """Semantic search over Qazi's portfolio knowledge base (bio, skills, experience, projects, contact). Use this for any question about who he is, what he knows, what he's done, or what he's built."""
    hits = rag.search(query)
    if not hits:
        return "No relevant context found in the knowledge base."
    return "\n\n---\n\n".join(
        f"[{hit['topic']}/{hit['source']}] {hit['text']}" for hit in hits
    )


@tool
def list_projects(stack: str = "", limit: int = 5) -> str:
    """List Qazi's featured projects as JSON. Optional `stack` filters by a tech keyword (e.g. 'react', 'node', 'ai', 'typescript'). Returns title, emoji, stack, live URL and repo URL for each match."""
    items = FEATURED_PROJECTS
    if stack:
        needle = stack.lower()
        items = [
            p
            for p in items
            if needle in p["title"].lower()
            or any(needle in t.lower() for t in p["stack"])
        ]
    return json.dumps(items[: max(limit, 1)], ensure_ascii=False)


@tool
def get_contact() -> str:
    """Get Qazi's direct contact details: email, phone/WhatsApp, GitHub, LinkedIn, portfolio URL and location."""
    return json.dumps(CONTACT, ensure_ascii=False, indent=2)


@tool
def get_availability() -> str:
    """Get Qazi's current availability for roles and freelance work."""
    return AVAILABILITY


TOOLS = [search_knowledge, list_projects, get_contact, get_availability]
