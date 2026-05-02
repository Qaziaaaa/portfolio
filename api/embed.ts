import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel serverless function — proxies embedding requests to Jina AI.
 * Runs server-side so CORS is not an issue.
 * POST /api/embed  { texts: string[] }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { texts } = req.body as { texts?: string[] };
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'texts array is required' });
  }

  const apiKey = process.env.VITE_JINA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VITE_JINA_API_KEY not configured on server' });
  }

  try {
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'jina-embeddings-v3', input: texts }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
