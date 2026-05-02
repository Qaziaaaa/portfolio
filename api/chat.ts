import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel serverless function — proxies streaming chat requests to Groq.
 * Runs server-side so CORS is not an issue.
 * POST /api/chat  { messages: [...], max_tokens: number }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VITE_GROQ_API_KEY not configured on server' });
  }

  const { messages, max_tokens } = req.body as {
    messages?: unknown[];
    max_tokens?: number;
  };

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        stream: true,
        max_tokens: max_tokens ?? 300,
      }),
    });

    if (!groqResponse.ok) {
      const text = await groqResponse.text();
      return res.status(groqResponse.status).json({ error: text });
    }

    // Forward the SSE stream directly to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = groqResponse.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
