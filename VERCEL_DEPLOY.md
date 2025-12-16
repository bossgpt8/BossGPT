# Deploying BossAI to Vercel

This guide explains how to deploy your BossAI chatbot to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (free tier works)
3. Your API keys ready:
   - `OPENROUTER_API_KEY` - Required for chat functionality (must be set for all deployments including previews)
   - `HUGGINGFACE_API_KEY` - Required for image generation (note: some models require higher API quotas)
   - Firebase keys (optional, for authentication):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_APP_ID`

## Important Notes

- The `/api` serverless functions are **only used by Vercel**. When running locally, the Express server in `/server` handles all API requests.
- Environment variables must be set for **all environments** (Production, Preview, Development) in Vercel settings for preview deployments to work.
- Image generation may require a HuggingFace Pro account for higher rate limits on some models.

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Vercel will auto-detect the configuration from `vercel.json`

## Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key for chat |
| `HUGGINGFACE_API_KEY` | Yes | Your HuggingFace API key for images |
| `VITE_FIREBASE_API_KEY` | No | Firebase API key |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | No | Firebase app ID |

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Project Structure for Vercel

```
/api                    # Serverless functions
  ├── chat.ts          # POST /api/chat
  ├── generate-image.ts # POST /api/generate-image
  ├── status.ts        # GET /api/status
  └── firebase-config.ts # GET /api/firebase-config
/client                 # React frontend (Vite)
/shared                 # Shared TypeScript schemas
vercel.json            # Vercel configuration
```

## How It Works

- **Frontend**: Built with Vite and served as static files
- **Backend**: Express routes converted to serverless functions in `/api`
- **API Routing**: Vercel automatically routes `/api/*` requests to the serverless functions

## Troubleshooting

### API calls failing
- Check that environment variables are set correctly in Vercel dashboard
- View function logs in Vercel dashboard under "Functions" tab

### Build errors
- Ensure all dependencies are in `dependencies` (not `devDependencies`) if used by `/api` functions
- Check Vercel build logs for specific errors

### Firebase not working
- Ensure all Firebase environment variables are set
- Add your Vercel domain to Firebase authorized domains

## Local Development

This project continues to work locally with Replit's development server:
```bash
npm run dev
```

The `/api` folder is only used by Vercel; locally, the Express server in `/server` handles API requests.
