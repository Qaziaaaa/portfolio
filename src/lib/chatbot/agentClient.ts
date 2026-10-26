/**
 * Client for the Python LangChain agent (/api/agent).
 *
 * The server returns structured blocks — typed content the UI renders as
 * native components (paragraphs, bullets, project cards, contact cards)
 * instead of parsing markdown text.
 */

export interface TextBlock {
  type: 'text';
  content: string;
}

export interface BulletsBlock {
  type: 'bullets';
  items: string[];
}

export interface ProjectCardBlock {
  type: 'project_card';
  title: string;
  emoji: string;
  stack: string[];
  href: string;
  repo: string;
  summary: string;
}

export interface ContactCardBlock {
  type: 'contact_card';
  headline: string;
  email: string;
  phone?: string | null;
}

export type Block =
  | TextBlock
  | BulletsBlock
  | ProjectCardBlock
  | ContactCardBlock;

export type AgentIntent =
  | 'bio'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'availability'
  | 'contact'
  | 'smalltalk'
  | 'fallback';

export interface AgentResponse {
  intent: AgentIntent;
  blocks: Block[];
  sources: string[];
  trace: string[];
  suggestions: string[];
}

export interface HistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export class AgentError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AgentError';
    this.status = status;
  }
}

const ENDPOINT = '/api/agent';

export async function askAgent(
  message: string,
  history: HistoryTurn[],
): Promise<AgentResponse> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
  } catch {
    throw new AgentError('network');
  }
  if (!res.ok) throw new AgentError('http', res.status);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new AgentError('bad-json');
  }
  const resp = data as Partial<AgentResponse> | null;
  if (!resp || !Array.isArray(resp.blocks)) throw new AgentError('bad-shape');
  return {
    intent: resp.intent ?? 'fallback',
    blocks: resp.blocks,
    sources: resp.sources ?? [],
    trace: resp.trace ?? [],
    suggestions: resp.suggestions ?? [],
  };
}

/** Warm the agent (server cold start) — failures are expected and ignored. */
export function pingAgent(): void {
  void fetch('/api/agent/health', { method: 'GET' }).catch(() => {});
}

/** Flatten structured blocks into plain text (conversation history, typing state). */
export function blocksToPlainText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.type === 'text') {
      parts.push(block.content);
    } else if (block.type === 'bullets') {
      parts.push(block.items.map((item) => `- ${item}`).join('\n'));
    } else if (block.type === 'project_card') {
      parts.push(`${block.title} — ${block.summary}`);
    } else if (block.type === 'contact_card') {
      parts.push(`${block.headline} ${block.email}${block.phone ? ` · ${block.phone}` : ''}`);
    }
  }
  return parts.join('\n\n');
}
