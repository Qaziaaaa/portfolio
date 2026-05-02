/**
 * Groq Chat Completions client with SSE streaming.
 * Calls the Groq API directly from the browser — Groq supports CORS.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const MAX_TOKENS = 300;
const MAX_HISTORY_MESSAGES = 8;

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Build the system prompt that instructs the LLM to answer only from the
 * provided context chunks, representing Qazi professionally.
 */
export function buildSystemPrompt(chunks: string[]): string {
  const contextBlock =
    chunks.length > 0
      ? chunks.map((c) => `---\n${c}\n---`).join('\n')
      : '---\n(No relevant context found)\n---';

  return `You are Qazi's personal AI assistant on his portfolio website (qaziahmad.vercel.app).
Your job is to help visitors — recruiters, clients, and collaborators — learn about Qazi Farhan Ahmad.

PERSONALITY: Friendly, professional, and enthusiastic about Qazi's work. Like a knowledgeable colleague who knows Qazi well.

RESPONSE RULES:
- Answer ONLY using the context provided below. Never invent details.
- Keep responses concise but complete — aim for 3-6 sentences or a short list.
- Use plain text formatting. For lists, use bullet points with "•". For project details, use a clean structure.
- When mentioning projects, always include the live link if available.
- If asked about something not in the context, say: "I don't have that info, but you can reach Qazi directly on WhatsApp: https://wa.me/923141935787 or LinkedIn: https://www.linkedin.com/in/qazi-farhan-ahmad-7a3b3432b/"
- End responses about hiring/collaboration with a call to action to contact Qazi.
- Never say "based on the context" or "according to the information provided" — just answer naturally.

CONTEXT:
${contextBlock}`;
}

/**
 * Stream a chat completion from the Groq API.
 */
export async function streamCompletion(
  systemPrompt: string,
  history: HistoryMessage[],
  userMessage: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  const cappedHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...cappedHistory,
    { role: 'user', content: userMessage },
  ];

  let response: Response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey ?? ''}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        stream: true,
        max_tokens: MAX_TOKENS,
      }),
    });
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
    return;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    onError(new Error(`Groq API error ${response.status}: ${errorText}`));
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError(new Error('Groq API returned no response body.'));
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data) as {
            choices: Array<{
              delta: { content?: string };
              finish_reason: string | null;
            }>;
          };

          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onToken(delta);

          if (parsed.choices?.[0]?.finish_reason === 'stop') {
            onDone();
            return;
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  } finally {
    reader.releaseLock();
  }
}
