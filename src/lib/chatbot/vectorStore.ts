import type { VectorEntry } from './types';

/**
 * Module-level singleton vector store.
 * Persists for the duration of the browser session.
 * Never written to localStorage — embeddings are re-generated on page reload.
 */
let store: VectorEntry[] = [];

/**
 * Compute the cosine similarity between two vectors.
 * Returns a value in [-1, 1]. Returns 0 for zero-magnitude vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;
  return dot / magnitude;
}

/**
 * Populate the vector store with the given entries.
 * Replaces any existing entries.
 */
export function populateStore(entries: VectorEntry[]): void {
  store = [...entries];
}

/**
 * Search the vector store for the top-K most similar entries to the query embedding.
 * Returns results sorted by descending cosine similarity score.
 */
export function searchStore(
  queryEmbedding: number[],
  topK: number
): Array<{ entry: VectorEntry; score: number }> {
  const scored = store.map((entry) => ({
    entry,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/** Remove all entries from the vector store. */
export function clearStore(): void {
  store = [];
}

/** Returns true if the store has been populated with at least one entry. */
export function isPopulated(): boolean {
  return store.length > 0;
}
