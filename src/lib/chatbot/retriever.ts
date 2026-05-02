import { embedTexts } from './jinaClient';
import { searchStore } from './vectorStore';

/**
 * Retrieve the most relevant knowledge base chunks for a given query.
 *
 * Steps:
 * 1. Embed the query text via Jina AI.
 * 2. Run cosine similarity search against the vector store.
 * 3. If the top score is below the threshold, return an empty context array.
 * 4. Otherwise return the top-K chunk texts.
 *
 * @param query - The user's natural language question.
 * @param topK - Number of top chunks to return (default: 3).
 * @param threshold - Minimum cosine similarity score to consider relevant (default: 0.3).
 */
export async function retrieve(
  query: string,
  topK = 3,
  threshold = 0.3
): Promise<{ chunks: string[]; belowThreshold: boolean }> {
  // 1. Embed the query
  const [queryEmbedding] = await embedTexts([query]);

  // 2. Search the vector store
  const results = searchStore(queryEmbedding, topK);

  // 3. Check threshold
  if (results.length === 0 || results[0].score < threshold) {
    return { chunks: [], belowThreshold: true };
  }

  // 4. Return top-K chunk texts
  const chunks = results.map((r) => r.entry.chunk);
  return { chunks, belowThreshold: false };
}
