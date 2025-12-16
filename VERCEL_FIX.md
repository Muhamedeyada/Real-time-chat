# Fix Vercel Deployment Error

## Problem
Vercel is looking for "public" directory but Vite builds to "dist"

## Solution: Configure in Vercel Dashboard

### Option 1: Set Root Directory (Recommended)

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Under **Root Directory**, click **Edit**
4. Select **frontend** as the root directory
5. Click **Save**

Then configure:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Option 2: Keep Root Directory as Project Root

If you keep the root directory as the project root, make sure:

1. Go to **Settings** → **General**
2. **Root Directory**: Leave as root (`.`)
3. **Build Command**: `cd frontend && npm install && npm run build`
4. **Output Directory**: `frontend/dist`
5. **Install Command**: `cd frontend && npm install`

The `vercel.json` file should handle this automatically, but you can also set it manually in the dashboard.

## After Configuration

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the failed deployment
3. Click **Redeploy**

Or push a new commit to trigger a new deployment.

