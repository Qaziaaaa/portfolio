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

const CACHE_KEY = 'qazi.chatbot.embeddings.v1';
const CACHE_MODEL = 'jina-embeddings-v3';

/**
 * Deterministic content hash of all chunk texts. Used to invalidate the
 * embedding cache whenever the knowledge base changes.
 */
function hashTexts(texts: string[]): string {
  const s = texts.join('\u0001');
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

interface EmbeddingCache {
  model: string;
  hash: string;
  embeddings: number[][];
}

function loadCachedEmbeddings(texts: string[]): number[][] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as EmbeddingCache;
    if (!data || data.model !== CACHE_MODEL || data.hash !== hashTexts(texts)) return null;
    if (!Array.isArray(data.embeddings) || data.embeddings.length !== texts.length) return null;
    return data.embeddings;
  } catch {
    return null;
  }
}

function saveCachedEmbeddings(texts: string[], embeddings: number[][]): void {
  try {
    const payload: EmbeddingCache = {
      model: CACHE_MODEL,
      hash: hashTexts(texts),
      embeddings,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable (e.g. private mode) — cache is best-effort.
  }
}

/**
 * Initialize the RAG pipeline by batch-embedding all knowledge base chunks
 * and populating the in-memory vector store.
 *
 * This function is:
 * - **Idempotent**: safe to call multiple times; returns immediately if the store
 *   is already populated.
 * - **Deferred**: should be pre-warmed in the background (idle/hover) rather than
 *   blocking the chat panel the moment the user opens it.
 * - **Cached**: embeddings are persisted to localStorage (keyed by content hash),
 *   so repeat visits skip the network call entirely.
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

  // 4. Reuse cached embeddings when the knowledge base hasn't changed
  const cached = loadCachedEmbeddings(texts);
  const embeddings = cached ?? (await embedTexts(texts));
  if (!cached) saveCachedEmbeddings(texts, embeddings);

  // 5. Zip embeddings with chunks and populate the store
  const entries: VectorEntry[] = ALL_CHUNKS.map((chunk, i) => ({
    chunk: chunk.text,
    metadata: chunk.metadata,
    embedding: embeddings[i],
  }));

  populateStore(entries);
}
