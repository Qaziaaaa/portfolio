/**
 * Shared TypeScript types for the portfolio chatbot.
 */
import type { Block } from './agentClient';

/** A single message in the conversation history. */
export interface ChatMessage {
  /** Unique identifier — generated via crypto.randomUUID() */
  id: string;
  role: 'user' | 'assistant';
  /** Plain text content (also what gets sent back as history). */
  content: string;
  /** Unix timestamp in milliseconds (Date.now()) */
  timestamp: number;
  /** Structured blocks returned by the agent (assistant messages only). */
  blocks?: Block[];
  /** Follow-up questions suggested by the agent (assistant messages only). */
  suggestions?: string[];
  /** Knowledge topics/tools that informed the answer. */
  sources?: string[];
  /** Tool-loop steps, e.g. "searched knowledge base". */
  trace?: string[];
}
