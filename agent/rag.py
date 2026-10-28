"""Server-side RAG: Jina embeddings + LangChain InMemoryVectorStore.

The store is built lazily on first use and reused across warm invocations
(57 chunks — one batched embedding call per cold start). If Jina is
unreachable or the key is rejected, search falls back to local keyword
scoring over the same chunks so grounded answers keep working.
"""

import math
import os
import re
import threading
from collections import Counter

import httpx

from agent.knowledge import load_chunks

JINA_URL = "https://api.jina.ai/v1/embeddings"
JINA_MODEL = "jina-embeddings-v3"
DEFAULT_TOP_K = 3
DEFAULT_THRESHOLD = 0.3
KEYWORD_THRESHOLD = 0.1

_STOPWORDS = frozenset(
    "the a an and or of to in for with on is are was were be been what which "
    "who whom whose when where why how do does did can could should would "
    "tell about his her she he they them this that these those there here "
    "qazi farhan ahmad you your i we our me my".split()
)


def _jina_key() -> str:
    key = os.environ.get("JINA_API_KEY") or os.environ.get("VITE_JINA_API_KEY")
    if not key:
        raise RuntimeError("JINA_API_KEY is not configured")
    return key


def _embed(texts: list[str]) -> list[list[float]]:
    response = httpx.post(
        JINA_URL,
        json={"model": JINA_MODEL, "input": texts},
        headers={"Authorization": f"Bearer {_jina_key()}"},
        timeout=60.0,
    )
    response.raise_for_status()
    data = sorted(response.json()["data"], key=lambda item: item["index"])
    return [item["embedding"] for item in data]


class JinaEmbeddings:
    """Duck-typed LangChain ``Embeddings`` implementation backed by Jina AI."""

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return _embed(texts)

    def embed_query(self, text: str) -> list[float]:
        return _embed([text])[0]


_store = None
_store_lock = threading.Lock()
_chunks_cache: list[dict] | None = None


def _chunks() -> list[dict]:
    global _chunks_cache
    if _chunks_cache is None:
        _chunks_cache = load_chunks()
    return _chunks_cache


def get_store():
    """Build (once) and return the in-memory vector store."""
    global _store
    if _store is not None:
        return _store
    with _store_lock:
        if _store is None:
            from langchain_core.vectorstores import InMemoryVectorStore

            chunks = _chunks()
            store = InMemoryVectorStore(JinaEmbeddings())
            store.add_texts(
                texts=[c["text"] for c in chunks],
                metadatas=[
                    {"topic": c["topic"], "source": c["source"]} for c in chunks
                ],
            )
            _store = store
    return _store


def _tokens(text: str) -> list[str]:
    return [
        token
        for token in re.findall(r"[a-z0-9+#.]+", text.lower())
        if len(token) > 2 and token not in _STOPWORDS
    ]


def _keyword_search(
    query: str,
    k: int,
    threshold: float,
) -> list[dict]:
    """Cosine-over-token-counts fallback used when embeddings are unavailable."""
    query_counts = Counter(_tokens(query))
    if not query_counts:
        return []

    scored: list[tuple[float, dict]] = []
    for chunk in _chunks():
        counts = Counter(_tokens(chunk["text"]))
        if not counts:
            continue
        overlap = sum((query_counts & counts).values())
        if not overlap:
            continue
        score = overlap / math.sqrt(
            sum(query_counts.values()) * sum(counts.values())
        )
        if score < threshold:
            continue
        scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [
        {
            "text": chunk["text"],
            "topic": chunk["topic"],
            "source": chunk["source"],
            "score": round(score, 3),
        }
        for score, chunk in scored[:k]
    ]


def search(
    query: str,
    k: int = DEFAULT_TOP_K,
    threshold: float = DEFAULT_THRESHOLD,
) -> list[dict]:
    """Top-K chunks for the query, filtered by cosine-similarity threshold.

    Falls back to local keyword scoring (no network) whenever the embedding
    service errors, so a Jina outage or bad key never breaks the agent.
    """
    try:
        results = get_store().similarity_search_with_score(query, k=k)
    except Exception as exc:
        print(
            f"[rag] embeddings unavailable ({type(exc).__name__}) → keyword fallback",
            flush=True,
        )
        return _keyword_search(query, k, KEYWORD_THRESHOLD)
    hits = []
    for doc, score in results:
        score = float(score)
        if score < threshold:
            continue
        hits.append(
            {
                "text": doc.page_content,
                "topic": doc.metadata.get("topic", ""),
                "source": doc.metadata.get("source", ""),
                "score": round(score, 3),
            }
        )
    return hits
