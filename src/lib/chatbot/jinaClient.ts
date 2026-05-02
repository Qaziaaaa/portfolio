/**
 * Jina AI Embeddings client — calls the API directly from the browser.
 * Jina AI supports CORS for browser requests.
 */

const JINA_API_URL = 'https://api.jina.ai/v1/embeddings';
const JINA_MODEL = 'jina-embeddings-v3';

/** Thrown when the embeddings API returns a non-2xx response. */
export class EmbeddingError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'EmbeddingError';
    this.status = status;
  }
}

interface JinaEmbeddingResponse {
  data: Array<{
    index: number;
    embedding: number[];
  }>;
}

/**
 * Embed an array of text strings using the Jina AI Embeddings API.
 * Returns one embedding vector per input text, in the same order.
 *
 * @throws {EmbeddingError} if the API returns a non-2xx response.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const apiKey = import.meta.env.VITE_JINA_API_KEY as string | undefined;

  const response = await fetch(JINA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey ?? ''}`,
    },
    body: JSON.stringify({
      model: JINA_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new EmbeddingError(
      `Jina AI error ${response.status}: ${errorText}`,
      response.status
    );
  }

  const json = (await response.json()) as JinaEmbeddingResponse;
  const sorted = [...json.data].sort((a, b) => a.index - b.index);
  return sorted.map((item) => item.embedding);
}
