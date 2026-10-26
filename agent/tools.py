"""Agent tools — the actions the model can take each turn."""

import json

from langchain_core.tools import tool

from agent import rag
from agent.catalog import ALL_PROJECTS
from agent.data import AVAILABILITY, CONTACT, FEATURED_PROJECTS

_FEATURED_TITLES = {p["title"] for p in FEATURED_PROJECTS}
_PROJECT_ITEMS: list[dict] | None = None


def _project_items() -> list[dict]:
    """Featured projects first, then the rest of the site catalogue.

    Deduplicated by title (the site data intentionally repeats a few titles
    across categories — first occurrence wins).
    """
    global _PROJECT_ITEMS
    if _PROJECT_ITEMS is None:
        seen = set(_FEATURED_TITLES)
        rest = []
        for p in ALL_PROJECTS:
            if p["title"] in seen:
                continue
            seen.add(p["title"])
            rest.append(
                {
                    "title": p["title"],
                    "emoji": p["emoji"],
                    "stack": p["tech"],
                    "live": p["live"],
                    "repo": p["github"],
                    "summary": p["description"],
                }
            )
        _PROJECT_ITEMS = FEATURED_PROJECTS + rest
    return _PROJECT_ITEMS


@tool
def search_knowledge(query: str) -> str:
    """Semantic search over Qazi's portfolio knowledge base (bio, skills, experience, all 39 projects, contact). Use this for any question about who he is, what he knows, what he's done, or what he's built."""
    hits = rag.search(query)
    if not hits:
        return "No relevant context found in the knowledge base."
    return "\n\n---\n\n".join(
        f"[{hit['topic']}/{hit['source']}] {hit['text']}" for hit in hits
    )


@tool
def list_projects(stack: str = "", limit: int = 5) -> str:
    """List Qazi's projects as JSON — featured projects first, drawn from the full catalogue of 39 site projects. Optional `stack` filters by a tech keyword (e.g. 'react', 'node', 'ai', 'stripe'). Returns title, emoji, stack, live URL, repo URL and a one-line summary for each match."""
    items = _project_items()
    if stack:
        needle = stack.lower()
        items = [
            p
            for p in items
            if needle in p["title"].lower()
            or any(needle in t.lower() for t in p["stack"])
        ]
    cap = max(1, min(limit, 8))
    return json.dumps(items[:cap], ensure_ascii=False)


@tool
def get_contact() -> str:
    """Get Qazi's direct contact details: email, phone/WhatsApp, GitHub, LinkedIn, portfolio URL and location."""
    return json.dumps(CONTACT, ensure_ascii=False, indent=2)


@tool
def get_availability() -> str:
    """Get Qazi's current availability for roles and freelance work."""
    return AVAILABILITY


TOOLS = [search_knowledge, list_projects, get_contact, get_availability]
