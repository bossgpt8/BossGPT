import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_PROJECT_ID
      ? `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
      : undefined,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_PROJECT_ID
      ? `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`
      : undefined,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const configured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

  return res.json({
    configured,
    config: configured ? firebaseConfig : null,
  });
}
