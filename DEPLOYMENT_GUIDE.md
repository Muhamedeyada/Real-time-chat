# Deployment Guide for YallaChat

This guide will help you deploy your YallaChat application using **Vercel** (frontend) and **Fly.io** (backend + database).

## 🚀 Deployment Architecture

- **Frontend**: Vercel (React/Vite)
- **Backend**: Fly.io (Node.js + Express + Socket.io)
- **Database**: Supabase (Free PostgreSQL) or Fly.io PostgreSQL

---

## 📋 Prerequisites

1. GitHub account (your code is already there)
2. Vercel account (free, no credit card)
3. Fly.io account (free, no credit card)
4. Supabase account (free, no credit card) - for database

---

## Step 1: Deploy Database (Supabase) 🗄️

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free, no credit card)
3. Create a new project

### 1.2 Get Database URL
1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

### 1.3 Run Database Schema
1. Go to **SQL Editor** in Supabase
2. Run this SQL to create tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  "fullName" VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  "profilePic" TEXT DEFAULT '',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  "senderId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "receiverId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT,
  image TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages("receiverId");
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages("senderId", "receiverId");
```

---

## Step 2: Deploy Backend (Fly.io) 🔧

### 2.1 Install Fly.io CLI
**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Or download from:** [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl)

### 2.2 Login to Fly.io
```bash
fly auth login
```

### 2.3 Create Fly.io App
```bash
cd backend
fly launch
```

When prompted:
- **App name**: `yallachat-backend` (or your choice)
- **Region**: Choose closest to you
- **PostgreSQL**: Say **No** (we're using Supabase)
- **Redis**: Say **No**

### 2.4 Create `fly.toml` Configuration
Create `backend/fly.toml`:

```toml
app = "yallachat-backend"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.ports]]
    port = 8080
    handlers = ["http"]
```

### 2.5 Create Dockerfile
Create `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "src/index.js"]
```

### 2.6 Set Environment Variables
```bash
fly secrets set DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
fly secrets set JWT_SECRET="your-jwt-secret-key-here"
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
fly secrets set CLOUDINARY_API_KEY="your-cloudinary-key"
fly secrets set CLOUDINARY_API_SECRET="your-cloudinary-secret"
fly secrets set FRONTEND_URL="https://your-vercel-app.vercel.app"
fly secrets set PORT="8080"
```

### 2.7 Deploy Backend
```bash
fly deploy
```

### 2.8 Get Backend URL
After deployment, get your backend URL:
```bash
fly status
```

Your backend URL will be: `https://yallachat-backend.fly.dev`

---

## Step 3: Deploy Frontend (Vercel) 🎨

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **Add New Project**
4. Import your GitHub repository: `Muhamedeyada/Real-time-chat`

### 3.2 Configure Project Settings

**Root Directory**: Leave as root (or set to `frontend` if needed)

**Build Settings:**
- **Framework Preset**: Vite
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

### 3.3 Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:

```
VITE_API_URL=https://yallachat-backend.fly.dev
```

### 3.4 Deploy
Click **Deploy** and wait for deployment to complete.

Your frontend will be at: `https://your-app-name.vercel.app`

---

## Step 4: Update Backend CORS 🔄

Update your backend CORS to allow your Vercel frontend:

```bash
fly secrets set FRONTEND_URL="https://your-vercel-app.vercel.app"
fly deploy
```

---

## Step 5: Test Deployment ✅

1. Visit your Vercel frontend URL
2. Try to sign up/login
3. Test real-time messaging
4. Check if profile picture upload works

---

## 🔧 Troubleshooting

### Backend not connecting?
- Check Fly.io logs: `fly logs`
- Verify environment variables: `fly secrets list`
- Check database connection string

### Frontend can't reach backend?
- Verify `VITE_API_URL` in Vercel environment variables
- Check CORS settings in backend
- Check browser console for errors

### Socket.io not working?
- Ensure backend is deployed on Fly.io (not Vercel serverless)
- Check WebSocket support in Fly.io
- Verify socket connection URL in frontend

---

## 📝 Environment Variables Summary

### Backend (Fly.io):
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=8080
```

### Frontend (Vercel):
```
VITE_API_URL=https://yallachat-backend.fly.dev
```

---

## 🎉 You're Done!

Your app should now be live! Share your Vercel URL with others to test.

---

## 📚 Useful Commands

**Fly.io:**
- `fly logs` - View backend logs
- `fly secrets list` - List environment variables
- `fly deploy` - Redeploy backend

**Vercel:**
- Automatic deployment on every git push
- View logs in Vercel dashboard

