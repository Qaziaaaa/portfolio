/**
 * Shared TypeScript types for the RAG portfolio chatbot.
 */

/** A discrete, semantically meaningful segment of text from the knowledge base. */
export interface KnowledgeChunk {
  text: string;
  metadata: {
    /** Topic area: "bio" | "skills" | "experience" | "projects" | "contact" */
    topic: string;
    /** Unique source identifier, e.g. "experience-senior-mern" */
    source: string;
  };
}

/** An entry in the in-memory vector store: chunk text + metadata + embedding vector. */
export interface VectorEntry {
  chunk: string;
  metadata: Record<string, string>;
  /** 1024-dimensional float array produced by jina-embeddings-v3 */
  embedding: number[];
}

/**
 * Lifecycle status of the chatbot initializer.
 * - idle: not yet started
 * - loading: embedding in progress
 * - ready: vector store populated, chatbot operational
 * - error: Jina AI API call failed
 * - misconfigured: one or more required env vars are missing
 */
export type InitStatus = 'idle' | 'loading' | 'ready' | 'error' | 'misconfigured';

/** A single message in the conversation history. */
export interface ChatMessage {
  /** Unique identifier — generated via crypto.randomUUID() */
  id: string;
  role: 'user' | 'assistant';
  /** Full message text; grows incrementally during streaming for assistant messages. */
  content: string;
  /** Unix timestamp in milliseconds (Date.now()) */
  timestamp: number;
}
