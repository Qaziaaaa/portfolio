"""Knowledge base loader.

Each markdown file holds one topic; each ``## source-id`` section is one
knowledge chunk. Five hand-written topics (migrated 1:1 from the original
TypeScript knowledge files) plus ``catalog.md`` — the generated per-project
catalogue of all 39 site projects.
"""

import re
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).parent
TOPICS = ("bio", "skills", "experience", "projects", "contact", "catalog")

_SECTION_RE = re.compile(r"^##\s+(\S+)\s*$\n?", re.MULTILINE)


def load_chunks() -> list[dict]:
    """Return every chunk as {'text', 'topic', 'source'} in stable order."""
    chunks: list[dict] = []
    for topic in TOPICS:
        raw = (KNOWLEDGE_DIR / f"{topic}.md").read_text(encoding="utf-8")
        matches = list(_SECTION_RE.finditer(raw))
        for i, m in enumerate(matches):
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
            text = raw[start:end].strip()
            if text:
                chunks.append(
                    {"text": text, "topic": topic, "source": m.group(1)}
                )
    return chunks
