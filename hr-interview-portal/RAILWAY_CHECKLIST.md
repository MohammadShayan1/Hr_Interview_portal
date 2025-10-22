# ✅ Railway Deployment Checklist

## Fixes Applied ✅

- [x] Changed `npm install` to `npm ci` in railway.json
- [x] Added nixpacks.toml for explicit build config
- [x] Made OPENROUTER_API_KEY optional (only warns if missing)
- [x] Config now only requires Firebase variables
- [x] Backend rebuilt successfully locally

## Your Next Steps

### 1. Commit and Push Changes 🚀

```powershell
# From your project root
git add .
git commit -m "Fix Railway deployment: use npm ci and flexible config"
git push origin main
```

### 2. Railway Will Auto-Deploy 🤖

Once you push, Railway will:
1. Detect changes
2. Run `npm ci` (faster, more reliable)
3. Build TypeScript with `npm run build`
4. Start with `npm start`
5. Your app should be live! ✅

### 3. Watch the Logs 👀

In Railway dashboard:
1. Click your service
2. Click "Logs" tab
3. Look for:
   - ✅ "Installing dependencies"
   - ✅ "Building TypeScript"
   - ✅ "🚀 Server is running!"

### 4. Test Health Endpoint 🏥

```bash
curl https://your-app.railway.app/api/health
```

Expected:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-22T..."
}
```

### 5. Verify on Frontend ✨

Open your Vercel frontend:
- Try logging in
- Try creating a job
- Check dashboard loads

---

## What Changed?

### Before ❌
```
npm install → crashes with warning
OPENROUTER_API_KEY required → crashes if missing
No nixpacks config → Railway guesses build process
```

### After ✅
```
npm ci → clean, fast install
OPENROUTER_API_KEY optional → warns but doesn't crash
nixpacks.toml → explicit, reliable build
```

---

## Required Environment Variables on Railway

Make sure these are set in Railway Variables tab:

### Critical (Must Have):
```
✅ PORT=5000
✅ NODE_ENV=production
✅ FIREBASE_PROJECT_ID=your_project_id
✅ FIREBASE_CLIENT_EMAIL=your_email@iam.gserviceaccount.com
✅ FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
✅ FRONTEND_URL=https://your-app.vercel.app
```

### Optional (For Features):
```
⚠️ OPENROUTER_API_KEY=your_key (AI features)
⚠️ EMAIL_USER=your_email (email notifications)
⚠️ EMAIL_PASSWORD=your_password
⚠️ BEYONDPRESENCE_API_KEY=your_key (video interviews)
⚠️ N8N_WEBHOOK_URL=your_webhook (automation)
⚠️ WEBHOOK_SECRET=random_secret
```

---

## What Works Without Optional Variables?

### ✅ Core Features (Work Without Optional Keys):
- User authentication (login/signup)
- Manual job creation
- Job editing and deletion
- Candidate applications
- Resume uploads
- Dashboard statistics
- View candidates

### ⚠️ Optional Features (Need Extra Keys):
- AI job description generation (needs OPENROUTER_API_KEY)
- Email notifications (needs EMAIL_USER + PASSWORD)
- Video interview scheduling (needs BEYONDPRESENCE_API_KEY)
- Workflow automation (needs N8N_WEBHOOK_URL)

---

## Troubleshooting

### If Still Crashing:

1. **Check Railway Logs**
   - Look for the actual error message
   - Most common: Missing Firebase variables

2. **Verify Environment Variables**
   - Railway dashboard → Variables tab
   - Check FIREBASE_PRIVATE_KEY has `\n` for line breaks
   - Example: `"-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----"`

3. **Check Build Output**
   - Should see "tsc" compile successfully
   - Should create `dist/` folder with compiled files

4. **Test Locally First**
   ```powershell
   cd backend
   npm ci
   npm run build
   npm start
   ```
   If works locally, should work on Railway

### Common Errors:

**"Cannot find module"**
→ Fix: `npm ci` installs all deps including dev deps for build

**"Missing required environment variables: FIREBASE_..."**
→ Fix: Add Firebase variables in Railway Variables tab

**"ENOENT: no such file or directory, open '.env'"**
→ Fix: Railway uses environment variables from dashboard, not .env file

**Build timeout**
→ Fix: `npm ci` is faster than `npm install`

---

## Quick Commands

```powershell
# Rebuild locally
cd backend
npm run build

# Test locally
npm start

# Push to Railway
git add .
git commit -m "Fix Railway deployment"
git push origin main

# Test Railway deployment
curl https://your-app.railway.app/api/health
```

---

## Files Modified

✅ `backend/railway.json` - Build command updated
✅ `backend/nixpacks.toml` - Added build config
✅ `backend/src/config/index.ts` - Flexible validation
✅ `backend/dist/` - Rebuilt successfully

---

## Expected Result

After pushing:
1. ✅ Railway auto-deploys
2. ✅ Build succeeds in ~2 minutes
3. ✅ Server starts without crashes
4. ✅ Health endpoint responds
5. ✅ Frontend can connect to backend
6. ✅ App works end-to-end

---

**Ready?** Run the git commands above and push to GitHub! 🚀

Railway will automatically detect the changes and redeploy with the fixes.

**Estimated time:** 5 minutes (push + Railway build + deploy)

---

**Still having issues?** Check `RAILWAY_FIX.md` for detailed troubleshooting!
