import { ALL_CHUNKS } from './knowledge/index';
import { embedTexts } from './jinaClient';
import { populateStore, isPopulated } from './vectorStore';
import type { VectorEntry } from './types';

/** Thrown when required environment variables are missing or empty. */
export class MisconfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MisconfiguredError';
  }
}

/**
 * Initialize the RAG pipeline by batch-embedding all knowledge base chunks
 * and populating the in-memory vector store.
 *
 * This function is:
 * - **Idempotent**: safe to call multiple times; returns immediately if the store
 *   is already populated.
 * - **Deferred**: should only be called when the chat panel is first opened,
 *   not on application startup.
 *
 * @throws {MisconfiguredError} if VITE_JINA_API_KEY or VITE_GROQ_API_KEY is missing.
 * @throws {EmbeddingError} if the Jina AI API call fails.
 */
export async function initialize(): Promise<void> {
  // 1. Validate environment variables
  const jinaKey = import.meta.env.VITE_JINA_API_KEY as string | undefined;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!jinaKey || jinaKey.trim() === '') {
    throw new MisconfiguredError(
      'VITE_JINA_API_KEY is not set. Please add it to your .env file.'
    );
  }
  if (!groqKey || groqKey.trim() === '') {
    throw new MisconfiguredError(
      'VITE_GROQ_API_KEY is not set. Please add it to your .env file.'
    );
  }

  // 2. Idempotency guard — skip if already populated
  if (isPopulated()) {
    return;
  }

  // 3. Extract all chunk texts for a single batched embedding request
  const texts = ALL_CHUNKS.map((chunk) => chunk.text);

  // 4. Call Jina AI in a single batched request
  const embeddings = await embedTexts(texts);

  // 5. Zip embeddings with chunks and populate the store
  const entries: VectorEntry[] = ALL_CHUNKS.map((chunk, i) => ({
    chunk: chunk.text,
    metadata: chunk.metadata,
    embedding: embeddings[i],
  }));

  populateStore(entries);
}
