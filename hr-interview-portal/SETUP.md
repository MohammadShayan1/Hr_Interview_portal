# 🚀 HR Interview Portal - Complete Setup & Deployment Guide

> **Everything you need to run locally and deploy to production**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Firebase Setup](#firebase-setup)
5. [Running the Application](#running-the-application)
6. [Deployment (Production)](#deployment-production)
7. [Troubleshooting](#troubleshooting)
8. [API Documentation](#api-documentation)

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Firebase account (free)
- Vercel account (for frontend hosting)
- Railway/Render account (for backend hosting)

### 5-Minute Setup (Local Development)
```powershell
# 1. Clone repository
git clone https://github.com/MohammadShayan1/Hr_Interview_portal.git
cd Hr_Interview_portal

# 2. Install dependencies
npm install

# 3. Set up environment variables (see section below)
# Create backend/.env and frontend/.env.local

# 4. Run both servers
npm run dev
```

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5000  
**API:** http://localhost:5000/api

---

## Local Development Setup

### Step 1: Install Dependencies

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env)

Create `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Firebase Admin (Get from Firebase Console → Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OpenRouter AI (Optional - for AI job generation)
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=HR Portal <your-email@gmail.com>

# BeyondPresence (Optional - for video interviews)
BEYONDPRESENCE_API_KEY=your-key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com

# n8n Webhook (Optional - for automation)
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/candidate
WEBHOOK_SECRET=your-webhook-secret
```

#### Frontend (.env.local)

Create `frontend/.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Client Config (Get from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Environment Variables

### How to Get Each Variable

#### Firebase Variables

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create new one)

**For Backend (Admin SDK):**
- Go to **Project Settings** → **Service Accounts**
- Click **"Generate New Private Key"**
- Download JSON file
- Extract values:
  - `FIREBASE_PROJECT_ID`: `project_id` from JSON
  - `FIREBASE_CLIENT_EMAIL`: `client_email` from JSON
  - `FIREBASE_PRIVATE_KEY`: `private_key` from JSON (keep `\n` characters)

**For Frontend (Client SDK):**
- Go to **Project Settings** → **General**
- Scroll to **"Your apps"** → Click Web icon `</>`
- Copy config values to NEXT_PUBLIC_* variables

#### OpenRouter API Key (Optional)
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to [Keys](https://openrouter.ai/keys)
3. Create new key
4. Copy to `OPENROUTER_API_KEY`

#### Gmail App Password (Optional)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate password for "Mail"
5. Copy to `EMAIL_PASSWORD`

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name (e.g., "hr-interview-portal")
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

### 2. Enable Authentication

1. Click **"Authentication"** in sidebar
2. Click **"Get Started"**
3. Click **"Email/Password"** provider
4. Enable **"Email/Password"**
5. Click **"Save"**

### 3. Enable Firestore Database

1. Click **"Firestore Database"** in sidebar
2. Click **"Create Database"**
3. Select **"Production mode"**
4. Choose location closest to users
5. Click **"Enable"**

### 4. Set Firestore Security Rules

Go to **"Rules"** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs - only creators can manage
    match /jobs/{jobId} {
      allow read: if request.auth != null && resource.data.createdBy == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
    
    // Candidates - job creators can view
    match /candidates/{candidateId} {
      allow read: if request.auth != null;
      allow create: if true; // Public applications
      allow update: if request.auth != null;
    }
  }
}
```

### 5. Enable Storage

1. Click **"Storage"** in sidebar
2. Click **"Get Started"**
3. Select **"Production mode"**
4. Click **"Done"**

### 6. Set Storage Security Rules

Go to **"Rules"** tab and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if true; // Allow public uploads for candidates
    }
  }
}
```

---

## Running the Application

### Option 1: Run Both Servers (Recommended)

From project root:
```powershell
npm run dev
```

This starts both frontend and backend concurrently.

### Option 2: Run Separately

**Terminal 1 (Backend):**
```powershell
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### Test the Application

1. **Sign Up:** http://localhost:3000/signup
2. **Login:** http://localhost:3000/login
3. **Dashboard:** Create a job, view stats
4. **Apply:** Get application link from job, test in incognito

---

## Deployment (Production)

### Architecture

```
Frontend (Vercel) → Backend (Railway) → Firebase (Database/Storage/Auth)
```

### Step 1: Deploy Frontend to Vercel

#### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Set **Root Directory:** `frontend`
5. Click **"Deploy"**

#### Add Environment Variables

After deployment, go to **Settings** → **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc
```

**Redeploy** after adding variables.

---

### Step 2: Deploy Backend to Railway (Recommended)

#### Why Railway?
- ✅ $5/month free credit (~500 hours)
- ✅ No cold starts
- ✅ Easy setup
- ✅ Auto-deploy from GitHub

#### Setup Steps

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose `Hr_Interview_portal` repository

3. **Configure Service**
   - Click on deployed service
   - Go to **Settings**
   - Set **Root Directory:** `backend`
   - Click **"Save"**

4. **Add Environment Variables**
   - Click **"Variables"** tab
   - Add each variable:

```env
PORT=5000
NODE_ENV=production

# Firebase (Required)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----

# Frontend URL (Required)
FRONTEND_URL=https://your-app.vercel.app

# Optional Features
OPENROUTER_API_KEY=sk-or-v1-your-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
BEYONDPRESENCE_API_KEY=your-key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com
N8N_WEBHOOK_URL=your-webhook-url
WEBHOOK_SECRET=random-32-char-secret
```

5. **Deploy**
   - Railway auto-deploys
   - Wait 2-3 minutes for build
   - Get your URL: `https://your-app.up.railway.app`

6. **Generate Domain**
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy URL

#### Update Vercel Frontend

1. Go to Vercel project
2. **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to Railway URL
4. **Deployments** → **Redeploy**

---

### Alternative: Deploy Backend to Render

#### Why Render?
- ✅ Completely free (750 hours/month)
- ⚠️ Sleeps after 15 min inactivity (cold starts)

#### Setup Steps

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect GitHub repo
5. Configure:
   - **Name:** hr-interview-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
6. Select **"Free"** plan
7. Add environment variables (same as Railway)
8. Click **"Create Web Service"**

#### Keep Service Awake (Optional)

Use [UptimeRobot](https://uptimerobot.com) (free):
- Monitor your backend URL
- Pings every 5 minutes
- Prevents sleep

---

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"

**Symptoms:** Frontend can't reach API

**Solutions:**
- Check `NEXT_PUBLIC_API_URL` in Vercel matches backend URL
- Verify backend is running (test health endpoint)
- Check CORS: `FRONTEND_URL` in backend matches Vercel URL

**Test:**
```bash
curl https://your-backend.railway.app/api/health
```

---

#### 2. "Firebase Admin Error"

**Symptoms:** "Could not load default credentials"

**Solutions:**
- Verify `FIREBASE_PRIVATE_KEY` has `\n` for line breaks
- Check `FIREBASE_CLIENT_EMAIL` is correct
- Ensure Firestore and Storage are enabled

**Correct format:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

---

#### 3. "AI Generation Failed"

**Symptoms:** Job generation returns error

**Solutions:**
- Check `OPENROUTER_API_KEY` is set
- Verify API key is valid at [openrouter.ai/keys](https://openrouter.ai/keys)
- Check account has credits
- **Workaround:** Use manual job creation (works without AI)

---

#### 4. "Email Not Sending"

**Symptoms:** No email notifications

**Solutions:**
- Check `EMAIL_USER` and `EMAIL_PASSWORD` are set
- Use Gmail App Password (not regular password)
- Verify SMTP settings are correct
- **Workaround:** App works without email, just no notifications

---

#### 5. "Railway Build Failed"

**Symptoms:** "npm WARN config production"

**Solutions:**
- Make sure `railway.json` uses `npm ci`
- Check `nixpacks.toml` exists
- Verify all dependencies in `package.json`

**Files should exist:**
```
backend/
├── railway.json (with npm ci)
└── nixpacks.toml
```

---

#### 6. "Port Already in Use"

**Symptoms:** "EADDRINUSE :::5000"

**Solution:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

#### 7. "CORS Error"

**Symptoms:** "Access-Control-Allow-Origin" error in browser

**Solutions:**
- Check `FRONTEND_URL` in backend matches Vercel URL
- Verify URL includes `https://` and no trailing slash
- Restart backend after changing CORS settings

---

### Debug Checklist

When something doesn't work:

```
Local Development:
□ Both servers running? (frontend:3000, backend:5000)
□ Environment files exist? (backend/.env, frontend/.env.local)
□ Firebase services enabled? (Auth, Firestore, Storage)
□ Health check works? http://localhost:5000/api/health

Production:
□ Frontend deployed on Vercel?
□ Backend deployed on Railway/Render?
□ Environment variables set on both platforms?
□ Backend URL updated in Vercel?
□ Health check works? https://your-backend.railway.app/api/health
□ Firebase security rules configured?
□ CORS configured with correct URLs?
```

---

## API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-backend.railway.app/api`

### Authentication

All protected endpoints require Firebase ID token in header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-22T..."
}
```

---

#### Jobs

**Create Job**
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "<p>Job description HTML</p>"
}
```

**List Jobs**
```http
GET /api/jobs
Authorization: Bearer <token>
```

**Get Public Job (No Auth)**
```http
GET /api/jobs/public/:jobId
```

**Generate Job with AI**
```http
POST /api/jobs/ai/generate-description
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior React Developer",
  "requirements": "5+ years React, TypeScript, Node.js"
}
```

**Update Job**
```http
PUT /api/jobs/:jobId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "<p>Updated description</p>"
}
```

**Delete Job**
```http
DELETE /api/jobs/:jobId
Authorization: Bearer <token>
```

---

#### Candidates

**Apply for Job (Public)**
```http
POST /api/candidates/apply/:jobId
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: +1234567890
experience: 5
resume: <file>
```

**Get Candidates by Job**
```http
GET /api/candidates/job/:jobId
Authorization: Bearer <token>
```

**Get Candidate Details**
```http
GET /api/candidates/:candidateId
Authorization: Bearer <token>
```

**Dashboard Statistics**
```http
GET /api/candidates/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 5,
    "totalCandidates": 12,
    "interviewsCompleted": 3
  }
}
```

---

#### Webhooks

**Update Interview Status**
```http
POST /api/webhooks/update-interview
X-Webhook-Secret: <webhook-secret>
Content-Type: application/json

{
  "candidateId": "abc123",
  "status": "Interview Completed",
  "interviewData": {
    "score": 85,
    "strengths": ["Great communication"],
    "weaknesses": ["Limited experience"],
    "recommendation": "Recommended"
  }
}
```

---

## Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## Features

### ✅ Working Without Optional APIs

- User authentication (signup/login)
- Manual job creation/editing/deletion
- Candidate applications
- Resume uploads to Firebase Storage
- Dashboard statistics
- View candidates by job

### ⚠️ Requires Optional APIs

- **AI Job Generation** → Needs `OPENROUTER_API_KEY`
- **Email Notifications** → Needs `EMAIL_USER` + `EMAIL_PASSWORD`
- **Video Interviews** → Needs `BEYONDPRESENCE_API_KEY`
- **Workflow Automation** → Needs `N8N_WEBHOOK_URL`

---

## Cost Summary

### Free Tier (Recommended for Starting)

```
Frontend (Vercel):   $0 - 100GB bandwidth/month
Backend (Railway):   $0 - $5 credit (~500 hours)
Database (Firebase): $0 - 1GB storage, 50K reads/day
Storage (Firebase):  $0 - 5GB, 1GB downloads/day
Auth (Firebase):     $0 - Unlimited users

TOTAL: $0/month (within limits)
```

**Can handle:** 100-500 users easily

### When to Upgrade

**Railway** ($5/month):
- Exceed 500 hours/month
- Need more resources

**Firebase** ($25+/month):
- Exceed 50K Firestore reads/day
- Exceed 5GB storage
- Need automatic backups

**Vercel** ($20/month):
- Need custom domain features
- Commercial use
- Exceed 100GB bandwidth

---

## Project Structure

```
Hr_Interview_portal/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── routes/          # API routes
│   │   ├── services/        # External services
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env                # Environment variables
│   ├── Dockerfile          # Docker config
│   ├── railway.json        # Railway config
│   ├── nixpacks.toml       # Build config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # Auth context
│   │   ├── lib/            # Firebase, API client
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── .env.local          # Environment variables
│   └── package.json
│
├── SETUP.md               # This file
└── README.md              # Project overview
```

---

## Quick Commands Reference

### Local Development
```powershell
# Install all dependencies
npm install

# Run both servers
npm run dev

# Run backend only
cd backend && npm run dev

# Run frontend only
cd frontend && npm run dev

# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

### Deployment
```powershell
# Push to GitHub (auto-deploys)
git add .
git commit -m "Your message"
git push origin main

# Test production backend
curl https://your-backend.railway.app/api/health

# Test production frontend
open https://your-app.vercel.app
```

---

## Support

### Documentation
- This guide covers all setup and deployment
- Check troubleshooting section for common issues

### External Resources
- [Firebase Docs](https://firebase.google.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com)

### Community
- Railway Discord: https://discord.gg/railway
- Firebase Discord: Community forums
- Stack Overflow: Tag with `firebase`, `express`, `next.js`

---

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use different values for dev and production
- ✅ Rotate secrets regularly
- ✅ Use strong passwords (32+ characters)

### Firebase
- ✅ Set security rules for Firestore and Storage
- ✅ Enable App Check for production
- ✅ Monitor usage to prevent abuse
- ✅ Use Firebase Admin SDK only on backend

### General
- ✅ Keep dependencies updated
- ✅ Use HTTPS in production (auto with Vercel/Railway)
- ✅ Validate all user inputs
- ✅ Rate limit API endpoints

---

## Next Steps After Setup

1. **Test Locally**
   - Create account
   - Create job
   - Test application flow

2. **Deploy to Production**
   - Frontend to Vercel
   - Backend to Railway
   - Configure environment variables

3. **Configure Optional Services**
   - OpenRouter for AI features
   - Gmail for email notifications
   - BeyondPresence for video interviews

4. **Monitor Usage**
   - Check Railway dashboard
   - Monitor Firebase usage
   - Set up alerts for limits

5. **Optimize**
   - Add caching if needed
   - Optimize Firebase queries
   - Add error tracking (Sentry)

---

**🎉 You're all set!**

This guide covers everything from local development to production deployment. If you encounter any issues, check the troubleshooting section first.

**Last Updated:** October 22, 2025  
**Version:** 1.0  
**Repository:** MohammadShayan1/Hr_Interview_portal
