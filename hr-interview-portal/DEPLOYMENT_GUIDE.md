# 🚀 Free Deployment Guide - HR Interview Portal

## Overview

This guide will help you deploy your HR Interview Portal for **completely free** using:
- ✅ **Frontend:** Vercel (Already done!)
- ✅ **Backend:** Railway, Render, or Fly.io (Free tier)
- ✅ **Database:** Firebase (Free Spark plan)
- ✅ **Storage:** Firebase Storage (Free)
- ✅ **Auth:** Firebase Auth (Free)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment Options](#backend-deployment-options)
   - [Option A: Railway (Recommended)](#option-a-railway-recommended)
   - [Option B: Render](#option-b-render)
   - [Option C: Fly.io](#option-c-flyio)
4. [Firebase Setup](#firebase-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Testing Your Deployment](#testing-your-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- [x] GitHub account (for code repository)
- [x] Vercel account (you already have this!)
- [x] Firebase project created
- [ ] Railway/Render/Fly.io account (choose one)
- [ ] All environment variables ready

---

## Frontend Deployment (Vercel)

### ✅ You've Already Done This!

Your frontend is deployed on Vercel. Note your frontend URL:
```
https://your-app-name.vercel.app
```

### Update Frontend Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Click **Save**
5. **Redeploy** your frontend to apply changes

---

## Backend Deployment Options

Choose ONE of these three free options:

---

## Option A: Railway (Recommended) ⭐

**Why Railway?**
- ✅ Free $5/month credit (enough for small apps)
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Built-in logs and monitoring
- ✅ No credit card required initially

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **Start a New Project**
3. Sign in with GitHub

### Step 2: Deploy Backend

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your `Hr_Interview_portal` repository
4. Railway will detect it's a Node.js app

### Step 3: Configure Build Settings

1. Click on your deployed service
2. Go to **Settings** → **Build & Deploy**
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Step 4: Add Environment Variables

1. Go to **Variables** tab
2. Click **+ New Variable** and add each one:

```env
PORT=5000
NODE_ENV=production

# Firebase Admin (paste your service account JSON)
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"..."}

# Or individual Firebase fields
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----

# Frontend URL
FRONTEND_URL=https://your-app-name.vercel.app

# OpenRouter (for AI features)
OPENROUTER_API_KEY=sk-or-v1-your-key

# BeyondPresence (for video interviews)
BEYONDPRESENCE_API_KEY=your_key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com

# n8n Webhook
N8N_WEBHOOK_URL=your_n8n_webhook_url

# Email (using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Webhook Secret
WEBHOOK_SECRET=generate_a_random_secret_key_here
```

### Step 5: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Railway will give you a URL like: `https://your-app.railway.app`

### Step 6: Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **Generate Domain**
3. You'll get: `your-app.up.railway.app`

### Step 7: Update Vercel Frontend

Go back to Vercel and update:
```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
```

Redeploy Vercel frontend.

---

## Option B: Render

**Why Render?**
- ✅ Completely free (750 hours/month)
- ✅ No credit card required
- ✅ Easy to use
- ⚠️ Sleeps after 15 minutes of inactivity (cold starts)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Select `Hr_Interview_portal`

### Step 3: Configure Service

```
Name: hr-interview-backend
Region: Choose closest to you
Branch: main
Root Directory: backend
Runtime: Node

Build Command: npm install && npm run build
Start Command: npm start
```

### Step 4: Select Free Plan

- Choose **Free** tier
- Note: Service will spin down after 15 min of inactivity

### Step 5: Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add all the same variables from Railway section above.

### Step 6: Deploy

1. Click **Create Web Service**
2. Wait 5-10 minutes for initial deploy
3. You'll get URL: `https://your-app.onrender.com`

### Step 7: Keep Service Awake (Optional)

Render free tier sleeps after 15 minutes. To prevent this:

**Option 1: Use Cron Job Monitoring Service**
- Sign up for [cron-job.org](https://cron-job.org) (free)
- Create a job to ping `https://your-app.onrender.com/api/health` every 10 minutes

**Option 2: Use UptimeRobot**
- Sign up for [uptimerobot.com](https://uptimerobot.com) (free)
- Monitor your backend URL
- Pings every 5 minutes

---

## Option C: Fly.io

**Why Fly.io?**
- ✅ Free allowance (3 shared VMs, 160GB bandwidth)
- ✅ Fast globally distributed
- ✅ No sleep/cold starts
- ⚠️ Requires credit card (won't charge unless you exceed free tier)

### Step 1: Install Fly CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Create Fly.io Account

```bash
fly auth signup
# Or if you have account:
fly auth login
```

### Step 3: Create fly.toml Configuration

Create `backend/fly.toml`:

```toml
app = "hr-interview-backend"
primary_region = "iad"

[build]
  [build.args]
    NODE_VERSION = "18"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[[services.http_checks]]
  interval = 10000
  timeout = 2000
  grace_period = "5s"
  method = "GET"
  path = "/api/health"
```

### Step 4: Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]
```

### Step 5: Deploy to Fly.io

```bash
cd backend
fly launch

# Follow prompts:
# - Choose app name
# - Select region
# - Don't add PostgreSQL/Redis (we use Firebase)
```

### Step 6: Set Environment Variables

```bash
fly secrets set PORT=8080
fly secrets set NODE_ENV=production
fly secrets set FIREBASE_PROJECT_ID=your_project_id
fly secrets set FIREBASE_CLIENT_EMAIL=your_email
fly secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----"
fly secrets set FRONTEND_URL=https://your-app.vercel.app
fly secrets set OPENROUTER_API_KEY=your_key
fly secrets set EMAIL_USER=your_email
fly secrets set EMAIL_PASSWORD=your_password
# ... add all other env vars
```

### Step 7: Deploy

```bash
fly deploy
```

Your backend will be live at: `https://hr-interview-backend.fly.dev`

---

## Firebase Setup

### 1. Enable Required Services

Go to [Firebase Console](https://console.firebase.google.com):

#### Enable Authentication
1. **Authentication** → **Get Started**
2. Enable **Email/Password** provider

#### Enable Firestore
1. **Firestore Database** → **Create Database**
2. Start in **Production mode**
3. Choose location closest to your users

#### Enable Storage
1. **Storage** → **Get Started**
2. Start in **Production mode**

### 2. Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs - only creators can read/write their jobs
    match /jobs/{jobId} {
      allow read: if request.auth != null && resource.data.createdBy == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
    
    // Candidates - only job creators can read
    match /candidates/{candidateId} {
      allow read: if request.auth != null;
      allow create: if true; // Public endpoint
      allow update: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if true; // Public upload for candidates
    }
  }
}
```

### 3. Get Service Account Key

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download JSON file
4. Copy entire JSON content for `FIREBASE_ADMIN_CREDENTIALS` env var

### 4. Get Firebase Config for Frontend

1. **Project Settings** → **General**
2. Under **Your apps**, click web icon (</>) 
3. Copy the config object values:

```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234:web:abcd"
}
```

These go into your Vercel frontend environment variables.

---

## Environment Variables

### Complete Backend Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Firebase Admin (Option 1: Full JSON)
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Firebase Admin (Option 2: Individual fields)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_API_URL=https://openrouter.ai/api/v1

# BeyondPresence Video Interviews
BEYONDPRESENCE_API_KEY=your-beyondpresence-key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com

# n8n Workflow Automation
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/candidate-application

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=HR Interview Portal <your-email@gmail.com>

# Webhook Security
WEBHOOK_SECRET=generate-random-secret-min-32-chars
```

### Complete Frontend Environment Variables (Vercel)

```env
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Post-Deployment Setup

### 1. Update CORS in Backend

Your backend already has CORS configured, but verify `backend/src/app.ts`:

```typescript
app.use(
  cors({
    origin: [
      config.frontendUrl, // From env var
      'https://your-app.vercel.app', // Your Vercel URL
      'http://localhost:3000' // For local development
    ],
    credentials: true,
  })
);
```

### 2. Set Up Email (Gmail)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate app password for "Mail"
5. Use this password in `EMAIL_PASSWORD` env var

### 3. Set Up n8n Webhook (Optional)

If you want automated workflows:

1. Sign up for [n8n.cloud](https://n8n.cloud) (free tier)
2. Create a new workflow
3. Add **Webhook** node
4. Copy webhook URL
5. Add to `N8N_WEBHOOK_URL` env var

### 4. Test External Services

#### Test OpenRouter:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Test BeyondPresence:
Check their documentation for test endpoints.

---

## Testing Your Deployment

### 1. Test Backend Health

```bash
curl https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-22T..."
}
```

### 2. Test Frontend

1. Open: `https://your-app.vercel.app`
2. Should load landing page
3. Try signing up/logging in
4. Test creating a job
5. Test AI generation
6. Get application link and test applying

### 3. Test Complete Flow

1. **Create Job:**
   - Login to dashboard
   - Create new job (with or without AI)
   - Copy application link

2. **Submit Application:**
   - Open application link in incognito
   - Fill form and upload resume
   - Submit

3. **View Application:**
   - Back to dashboard
   - Go to Candidates
   - Should see the application

4. **Check Integrations:**
   - Check if email was sent
   - Check if n8n workflow triggered
   - Check if BeyondPresence interview scheduled

---

## Troubleshooting

### Backend Issues

#### "Application failed to respond"
- Check logs on Railway/Render/Fly
- Verify `PORT` env var matches what service expects
- Check if build completed successfully

#### "Firebase Admin Error"
- Verify service account JSON is correct
- Check if `FIREBASE_PRIVATE_KEY` has proper line breaks (`\n`)
- Make sure Firestore and Storage are enabled

#### "CORS Error"
- Update `FRONTEND_URL` env var
- Check CORS configuration in `backend/src/app.ts`
- Redeploy backend after changes

#### "Module not found"
- Make sure `npm run build` runs in deploy
- Check `backend/dist` folder exists after build
- Verify `start` script in package.json points to `dist/server.js`

### Frontend Issues

#### "API Error / Network Failed"
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running (check health endpoint)
- Check browser console for exact error

#### "Firebase Auth Error"
- Verify all Firebase env vars are set
- Check Firebase project settings match
- Make sure Authentication is enabled in Firebase console

#### "Upload Failed"
- Check Firebase Storage is enabled
- Verify storage rules allow public upload
- Check file size (5MB limit in multer config)

### Railway Specific

#### "Out of Credits"
- Free plan: $5/month credit
- Check usage: Railway Dashboard → Usage
- Optimize: Reduce always-on services

#### "Build Failed"
- Check build logs
- Verify `backend` root directory is set
- Make sure `package.json` has `build` script

### Render Specific

#### "Service Sleeping / Slow Response"
- Free tier sleeps after 15 min
- Set up UptimeRobot to ping every 5 min
- Or upgrade to paid plan ($7/month)

#### "Build Timeout"
- Render free tier has 15 min build limit
- Optimize dependencies
- Remove unused packages

---

## Cost Breakdown (Free Tier Limits)

### Railway
- **Free:** $5/month credit (~500 hours)
- **Paid:** $5/month for more resources
- **Limits:** ~500MB RAM, shared CPU

### Render
- **Free:** 750 hours/month
- **Paid:** $7/month (no sleep, more resources)
- **Limits:** Sleeps after 15 min, 512MB RAM

### Fly.io
- **Free:** 3 VMs, 160GB bandwidth
- **Paid:** $0 if staying in free tier
- **Limits:** Requires credit card

### Firebase (All Use Same)
- **Free Spark Plan:**
  - Firestore: 1GB storage, 50K reads/day, 20K writes/day
  - Storage: 5GB, 1GB downloads/day
  - Auth: Unlimited users
- **Upgrade:** Blaze plan (pay as you go)

### Vercel (Frontend)
- **Free Hobby Plan:**
  - 100GB bandwidth/month
  - Unlimited sites
  - Automatic HTTPS
- **Upgrade:** Pro plan $20/month

---

## Recommended Setup for Free Hosting

### Best Free Combination:

1. **Frontend:** Vercel (Already done!) ✅
2. **Backend:** Railway (Most generous free tier) ⭐
3. **Database:** Firebase Firestore (Free Spark plan)
4. **Storage:** Firebase Storage (Free Spark plan)
5. **Auth:** Firebase Auth (Free)
6. **Monitoring:** UptimeRobot (Free, if using Render)
7. **Email:** Gmail with App Password (Free)

### When to Upgrade:

- **Backend:** If you exceed 500 hours/month or need more resources
- **Firebase:** If you exceed free tier limits (check Firebase console)
- **Vercel:** If you need more bandwidth or custom domains

---

## Next Steps After Deployment

1. ✅ Test all features end-to-end
2. ✅ Set up monitoring (UptimeRobot for uptime, Firebase for errors)
3. ✅ Add custom domain (optional, but professional)
4. ✅ Set up error tracking (Sentry free tier)
5. ✅ Monitor Firebase usage in console
6. ✅ Set up backups for Firestore (Firebase console → Exports)
7. ✅ Add analytics (Google Analytics, Vercel Analytics)

---

## Support & Resources

### Documentation
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- Railway Discord
- Render Community Forum
- Firebase Discord
- Stack Overflow

---

## Quick Deploy Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway/Render/Fly.io
- [ ] All environment variables set
- [ ] Firebase services enabled (Auth, Firestore, Storage)
- [ ] Firebase security rules configured
- [ ] CORS updated with production URLs
- [ ] Email configured (Gmail app password)
- [ ] Health endpoint tested (`/api/health`)
- [ ] Frontend can reach backend
- [ ] Sign up/Login works
- [ ] Job creation works
- [ ] AI generation works (if API key set)
- [ ] Application submission works
- [ ] File upload works
- [ ] Email notifications work (if configured)

---

**Congratulations! Your HR Interview Portal is now live! 🎉**

**Frontend:** https://your-app.vercel.app  
**Backend:** https://your-backend.railway.app  
**Status:** ✅ Deployed

---

**Last Updated:** October 22, 2025  
**Repository:** MohammadShayan1/Hr_Interview_portal
