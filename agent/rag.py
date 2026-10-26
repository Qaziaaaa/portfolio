"""Server-side RAG: Jina embeddings + LangChain InMemoryVectorStore.

The store is built lazily on first use and reused across warm invocations
(18 chunks — one batched embedding call per cold start).
"""

import os
import threading

import httpx

from agent.knowledge import load_chunks

JINA_URL = "https://api.jina.ai/v1/embeddings"
JINA_MODEL = "jina-embeddings-v3"
DEFAULT_TOP_K = 3
DEFAULT_THRESHOLD = 0.3


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


def get_store():
    """Build (once) and return the in-memory vector store."""
    global _store
    if _store is not None:
        return _store
    with _store_lock:
        if _store is None:
            from langchain_core.vectorstores import InMemoryVectorStore

            chunks = load_chunks()
            store = InMemoryVectorStore(JinaEmbeddings())
            store.add_texts(
                texts=[c["text"] for c in chunks],
                metadatas=[
                    {"topic": c["topic"], "source": c["source"]} for c in chunks
                ],
            )
            _store = store
    return _store


def search(
    query: str,
    k: int = DEFAULT_TOP_K,
    threshold: float = DEFAULT_THRESHOLD,
) -> list[dict]:
    """Top-K chunks for the query, filtered by cosine-similarity threshold."""
    results = get_store().similarity_search_with_score(query, k=k)
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
