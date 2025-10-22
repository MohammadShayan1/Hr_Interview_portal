# 🎯 Deployment Quick Reference

## Best Free Backend Options Comparison

| Feature | Railway ⭐ | Render | Fly.io |
|---------|----------|--------|--------|
| **Free Credit** | $5/month | 750 hrs/month | 3 VMs free |
| **Setup Time** | ⚡ 5 min | ⚡ 10 min | 🔧 15 min (CLI) |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cold Starts** | ❌ No | ⚠️ Yes (15 min) | ❌ No |
| **Credit Card** | ❌ Not required | ❌ Not required | ⚠️ Required |
| **Build Speed** | 🚀 Fast | 🐢 Slower | 🚀 Fast |
| **Logs** | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Best For** | Small apps | Side projects | Production-ready |

### 🏆 Recommendation: **Railway**
- Easiest setup
- No cold starts
- Generous free tier
- Perfect for this project

---

## Deployment URLs Template

```
Frontend (Vercel): https://hr-interview-portal.vercel.app
Backend (Railway): https://hr-interview-backend.up.railway.app
Health Check: https://hr-interview-backend.up.railway.app/api/health
API Base URL: https://hr-interview-backend.up.railway.app/api
```

---

## Critical Environment Variables

### Backend (Railway Dashboard)
```env
✅ PORT=5000
✅ NODE_ENV=production
✅ FIREBASE_PROJECT_ID=your_project
✅ FIREBASE_CLIENT_EMAIL=your_email
✅ FIREBASE_PRIVATE_KEY=your_key
✅ FRONTEND_URL=https://your-app.vercel.app
⚠️ OPENROUTER_API_KEY=your_key (optional)
⚠️ EMAIL_USER=your_email (optional)
⚠️ EMAIL_PASSWORD=your_password (optional)
```

### Frontend (Vercel Dashboard)
```env
✅ NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
✅ NEXT_PUBLIC_FIREBASE_API_KEY=your_key
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
✅ NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

---

## Step-by-Step Quick Deploy

### ✅ Already Done:
1. Frontend on Vercel

### 🚀 Deploy Backend (Railway - 5 minutes):

```
1. Go to railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select Hr_Interview_portal
5. Settings → Root Directory → backend
6. Variables → Add all env vars
7. Settings → Networking → Generate Domain
8. Copy backend URL
```

### 🔗 Connect Frontend to Backend (2 minutes):

```
1. Go to Vercel project
2. Settings → Environment Variables
3. Update NEXT_PUBLIC_API_URL with Railway URL
4. Deployments → Redeploy
```

### ✅ Total Time: ~10 minutes

---

## Post-Deployment Checklist

```
Backend:
[ ] Deployed on Railway/Render/Fly.io
[ ] Health check passing: /api/health
[ ] Environment variables set
[ ] Logs showing no errors

Frontend:
[ ] Deployed on Vercel
[ ] NEXT_PUBLIC_API_URL updated
[ ] Can reach backend API
[ ] No CORS errors

Firebase:
[ ] Firestore enabled
[ ] Storage enabled
[ ] Auth enabled
[ ] Security rules set

Testing:
[ ] Can sign up / login
[ ] Can create jobs
[ ] Can submit applications
[ ] Dashboard stats load
[ ] File upload works
```

---

## Common Issues & Quick Fixes

### "Cannot connect to backend"
```bash
✅ Fix: Update NEXT_PUBLIC_API_URL in Vercel
✅ Fix: Check backend health endpoint
✅ Fix: Verify FRONTEND_URL in backend env vars
```

### "Firebase Admin Error"
```bash
✅ Fix: Check FIREBASE_PRIVATE_KEY has \n for line breaks
✅ Fix: Verify service account email is correct
✅ Fix: Make sure Firestore is enabled
```

### "CORS Error"
```bash
✅ Fix: Add your Vercel URL to FRONTEND_URL
✅ Fix: Include https:// in URL
✅ Fix: Redeploy backend after env change
```

### "Build Failed"
```bash
✅ Fix: Set root directory to 'backend'
✅ Fix: Check package.json has build script
✅ Fix: Verify all dependencies installed
```

---

## Getting Help

### Railway
- Dashboard logs: Click service → Logs tab
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Render
- Logs: Service → Logs
- Docs: https://render.com/docs
- Community: https://community.render.com

### Fly.io
- Logs: `fly logs`
- Docs: https://fly.io/docs
- Forum: https://community.fly.io

### Firebase
- Console: https://console.firebase.google.com
- Docs: https://firebase.google.com/docs
- Stack Overflow: Tag `firebase`

---

## Cost Monitoring

### Stay Within Free Tier:

**Railway:**
- Dashboard → Usage
- $5/month credit = ~500 hours
- Alert: Set up email alerts in settings

**Render:**
- 750 hours = Always free if 1 service
- Sleeps after 15 min (use UptimeRobot)

**Firebase:**
- Console → Usage tab
- Spark plan limits:
  - 1GB Firestore storage
  - 50K reads, 20K writes per day
  - 5GB Storage, 1GB downloads per day

**Vercel:**
- Dashboard → Usage
- 100GB bandwidth/month free
- Commercial use requires Pro ($20/mo)

---

## Upgrade Paths (When You Grow)

### When to Upgrade:

**Backend ($5-7/month):**
- Exceed free tier hours
- Need more RAM/CPU
- Need zero downtime

**Firebase ($25-50/month):**
- Exceed 50K Firestore reads/day
- Need more storage
- Want automatic backups

**Vercel ($20/month):**
- Need custom domain
- Commercial use
- Want analytics

### Estimated Costs (100 users):
```
Backend (Railway Starter): $5/mo
Firebase (Blaze pay-as-go): ~$10/mo
Vercel (Pro): $20/mo
Total: ~$35/month
```

---

## Quick Commands Reference

### Test Backend Health
```bash
curl https://your-backend.railway.app/api/health
```

### View Railway Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### View Fly.io Logs
```bash
fly logs
```

### Test Firebase Connection
```javascript
// In browser console on your frontend
firebase.auth().currentUser
// Should show user object if logged in
```

---

## Support Files in This Repo

- 📘 `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- 🚂 `RAILWAY_DEPLOY.md` - Quick Railway setup
- 📋 `.env.example` - Environment variables template
- 🐳 `backend/Dockerfile` - Docker configuration
- ⚙️ `backend/railway.json` - Railway config
- ⚙️ `backend/render.yaml` - Render config
- ✈️ `backend/fly.toml` - Fly.io config

---

**Ready to Deploy?** Start with Railway → See `RAILWAY_DEPLOY.md`

**Need Details?** Read full guide → See `DEPLOYMENT_GUIDE.md`

**Questions?** Check troubleshooting sections in guides

---

Last Updated: October 22, 2025
