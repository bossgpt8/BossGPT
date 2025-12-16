import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hasApiKey = !!process.env.OPENROUTER_API_KEY;
  const hasHfKey = !!process.env.HUGGINGFACE_API_KEY;

  return res.json({
    configured: hasApiKey,
    chatEnabled: hasApiKey,
    imageEnabled: hasHfKey,
  });
}
