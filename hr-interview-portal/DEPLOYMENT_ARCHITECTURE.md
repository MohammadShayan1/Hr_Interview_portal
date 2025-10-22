# 🏗️ Deployment Architecture

## Current Setup (Development)

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Frontend      │ ───────>│    Backend      │
│   localhost     │  API    │   localhost     │
│   :3000         │ Calls   │   :5000         │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────────┐
│                                             │
│          Firebase Services                  │
│  (Auth, Firestore, Storage)                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Production Setup (After Deployment)

```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET                            │
└─────────────────────────────────────────────────────────┘
           │                            │
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐
│                      │    │                      │
│  Frontend (Vercel)   │────│ Backend (Railway)    │
│  your-app.vercel.app │    │ your-app.railway.app │
│                      │    │                      │
│  - Next.js App       │    │  - Express API       │
│  - Static Assets     │    │  - Business Logic    │
│  - Client-side Code  │    │  - File Processing   │
│                      │    │  - Webhooks          │
└──────────────────────┘    └──────────────────────┘
           │                            │
           │                            │
           └────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │                               │
        │   Firebase Services (Free)    │
        │                               │
        │  ┌─────────────────────────┐ │
        │  │  Firebase Auth          │ │
        │  │  - User authentication  │ │
        │  │  - Token management     │ │
        │  └─────────────────────────┘ │
        │                               │
        │  ┌─────────────────────────┐ │
        │  │  Firestore Database     │ │
        │  │  - Jobs collection      │ │
        │  │  - Candidates collection│ │
        │  │  - Real-time sync       │ │
        │  └─────────────────────────┘ │
        │                               │
        │  ┌─────────────────────────┐ │
        │  │  Firebase Storage       │ │
        │  │  - Resume files         │ │
        │  │  - Secure URLs          │ │
        │  └─────────────────────────┘ │
        │                               │
        └───────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐           ┌───────────────────┐
│               │           │                   │
│  OpenRouter   │           │  Email Service    │
│  (AI)         │           │  (Gmail/SMTP)     │
│               │           │                   │
│  - Job gen    │           │  - Notifications  │
│  - Evaluation │           │  - Invitations    │
│               │           │                   │
└───────────────┘           └───────────────────┘
```

---

## Data Flow

### 1. User Signs Up / Logs In

```
Browser → Vercel Frontend → Firebase Auth
         ↓
    Get ID Token
         ↓
    Store in Context
```

### 2. HR Creates Job

```
Frontend (Vercel)
    │
    ├─ Option A: Manual Creation
    │      └─> POST /api/jobs → Railway Backend → Firestore
    │
    └─ Option B: AI Generation
           └─> POST /api/jobs/ai/generate-description
                  └─> Railway Backend
                         └─> OpenRouter AI
                               └─> Returns description
                                     └─> POST /api/jobs → Firestore
```

### 3. Candidate Applies

```
Public Link (no auth)
    │
    ▼
Vercel Frontend (/apply/[jobId])
    │
    ├─> GET /api/jobs/public/:jobId (Railway)
    │      └─> Firestore (get job details)
    │
    └─> POST /api/candidates/apply/:jobId (Railway)
           │
           ├─> Upload resume → Firebase Storage
           │
           ├─> Save candidate data → Firestore
           │
           ├─> Trigger n8n webhook (optional)
           │      └─> Create interview link (BeyondPresence)
           │      └─> Send email invitation
           │
           └─> Return success
```

### 4. HR Views Candidates

```
Frontend (Vercel)
    │
    ▼
GET /api/candidates/job/:jobId (Railway)
    │
    ▼
Firestore query
    │
    └─> Returns candidates list
           └─> Displayed in dashboard
```

---

## Free Hosting Breakdown

### Frontend: Vercel (Free Hobby Plan)
```
✅ Unlimited deployments
✅ 100GB bandwidth/month
✅ Auto SSL (HTTPS)
✅ CDN (global)
✅ Automatic builds from GitHub
```

### Backend: Railway (Free $5/month credit)
```
✅ ~500 hours/month runtime
✅ 512MB RAM, shared CPU
✅ Auto-deploy from GitHub
✅ Environment variables
✅ Built-in logs
✅ Custom domains
✅ NO cold starts
```

### Database: Firebase (Free Spark Plan)
```
✅ Firestore: 1GB storage, 50K reads/day, 20K writes/day
✅ Storage: 5GB, 1GB downloads/day
✅ Auth: Unlimited users
✅ Real-time sync
✅ Security rules
```

---

## Deployment Platforms Comparison

```
┌─────────────────────────────────────────────────────────┐
│                    RAILWAY ⭐                           │
├─────────────────────────────────────────────────────────┤
│ Free: $5/month credit (~500 hours)                      │
│ Setup: Click deploy, set env vars                       │
│ Cold Starts: NO                                         │
│ Best For: Recommended for this project                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      RENDER                             │
├─────────────────────────────────────────────────────────┤
│ Free: 750 hours/month                                   │
│ Setup: Connect GitHub, configure                        │
│ Cold Starts: YES (sleeps after 15 min)                  │
│ Best For: Side projects, demos                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      FLY.IO                             │
├─────────────────────────────────────────────────────────┤
│ Free: 3 VMs, 160GB bandwidth                            │
│ Setup: CLI required, more technical                     │
│ Cold Starts: NO                                         │
│ Best For: Production apps, global distribution          │
└─────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ 1. HTTPS/TLS (Vercel & Railway auto SSL)               │
├─────────────────────────────────────────────────────────┤
│ 2. Firebase Authentication (JWT tokens)                 │
├─────────────────────────────────────────────────────────┤
│ 3. CORS (Backend validates origin)                      │
├─────────────────────────────────────────────────────────┤
│ 4. Firebase Security Rules (Database access control)    │
├─────────────────────────────────────────────────────────┤
│ 5. Webhook Secret Validation (n8n/BeyondPresence)      │
├─────────────────────────────────────────────────────────┤
│ 6. File Upload Validation (Type & size limits)         │
├─────────────────────────────────────────────────────────┤
│ 7. Input Validation (express-validator)                │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Variables Flow

```
Development (.env files)
    ↓
Git (.env ignored, .env.example committed)
    ↓
Deployment Platform Dashboard
    ↓
    ├─> Railway Variables Tab
    ├─> Render Environment Tab  
    └─> Fly.io Secrets (CLI)
         ↓
    Application Runtime
         ↓
    process.env.VARIABLE_NAME
```

---

## Scaling Path

### Current (Free Tier)
```
Users: 0-500
Requests: ~10K/day
Cost: $0
```

### Small Growth ($10-35/month)
```
Users: 500-5K
Requests: ~50K/day
Cost: Railway $5 + Firebase $10 + Vercel $20
```

### Medium Growth ($100-200/month)
```
Users: 5K-50K
Requests: ~500K/day
Cost: Railway $20 + Firebase $50 + Vercel $20 + CDN $30
```

### Large Scale ($500+/month)
```
Users: 50K+
Requests: 5M+/day
Consider: AWS/GCP with auto-scaling, Redis cache, CDN
```

---

## Monitoring Setup

```
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
├─────────────────────────────────────────────────────────┤
│  Railway Logs → Real-time backend logs                  │
│  Vercel Analytics → Frontend performance                │
│  Firebase Console → Database/Storage usage              │
├─────────────────────────────────────────────────────────┤
│                  External Tools (Free)                  │
├─────────────────────────────────────────────────────────┤
│  UptimeRobot → Ping /api/health every 5 min            │
│  Sentry → Error tracking (free tier)                    │
│  Google Analytics → User behavior                       │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Checklist Flowchart

```
START
  │
  ├─> Frontend on Vercel? ────> YES ─┐
  │                                   │
  └─> NO ──> Deploy to Vercel ───────┤
                                      │
  ┌───────────────────────────────────┘
  │
  ├─> Choose Backend Platform
  │   ├─> Railway (Recommended)
  │   ├─> Render (Free, cold starts)
  │   └─> Fly.io (Production)
  │
  ├─> Deploy Backend
  │   ├─> Connect GitHub
  │   ├─> Set root directory: backend
  │   └─> Add environment variables
  │
  ├─> Get Backend URL
  │
  ├─> Update Vercel Frontend
  │   └─> NEXT_PUBLIC_API_URL = backend_url
  │
  ├─> Test Health Endpoint
  │   └─> curl backend_url/api/health
  │
  ├─> Test Frontend
  │   ├─> Sign up / Login
  │   ├─> Create job
  │   └─> Submit application
  │
  └─> DEPLOYED! 🎉
```

---

## Cost Optimization Tips

```
FREE TIER BEST PRACTICES:

1. Railway:
   ✓ Use sleep command if inactive
   ✓ Monitor usage in dashboard
   ✓ Stay under 500 hours/month

2. Firebase:
   ✓ Use pagination (limit queries)
   ✓ Cache data on frontend
   ✓ Use .where() before .orderBy()
   ✓ Monitor usage daily

3. Vercel:
   ✓ Optimize images (next/image)
   ✓ Use static generation where possible
   ✓ Monitor bandwidth usage

4. General:
   ✓ Use CDN for static assets
   ✓ Compress responses (gzip)
   ✓ Implement rate limiting
   ✓ Cache API responses
```

---

## Quick URLs Reference

```
DEVELOPMENT:
Frontend:     http://localhost:3000
Backend:      http://localhost:5000
API:          http://localhost:5000/api
Health:       http://localhost:5000/api/health

PRODUCTION:
Frontend:     https://your-app.vercel.app
Backend:      https://your-app.railway.app
API:          https://your-app.railway.app/api
Health:       https://your-app.railway.app/api/health

FIREBASE:
Console:      https://console.firebase.google.com
Auth:         https://your-project.firebaseapp.com/__/auth
Firestore:    https://console.firebase.google.com/project/your-project/firestore
Storage:      https://console.firebase.google.com/project/your-project/storage
```

---

## Support Resources

```
📚 Documentation:
   - DEPLOYMENT_GUIDE.md (Complete guide)
   - RAILWAY_DEPLOY.md (Quick setup)
   - DEPLOY_QUICKREF.md (Quick reference)
   - .env.example (All variables)

🔧 Configuration:
   - backend/Dockerfile
   - backend/railway.json
   - backend/render.yaml
   - backend/fly.toml

🌐 External Docs:
   - Railway: https://docs.railway.app
   - Render: https://render.com/docs
   - Fly.io: https://fly.io/docs
   - Firebase: https://firebase.google.com/docs
   - Vercel: https://vercel.com/docs
```

---

**Ready to Deploy?**

👉 Start with `RAILWAY_DEPLOY.md` for fastest setup!

Last Updated: October 22, 2025
