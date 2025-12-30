import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const ttsRequestSchema = z.object({
  text: z.string().min(1),
  voiceId: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parseResult = ttsRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = parseResult.data;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY in environment variables.',
      });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return res.status(response.status).json({ error: 'ElevenLabs API error' });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return res.json({
      audio: `data:audio/mpeg;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: 'Failed to generate speech' });
  }
}
