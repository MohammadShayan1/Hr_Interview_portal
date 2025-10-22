# 🚂 Railway Deployment Fix

## Issue Found
Railway was crashing with npm warning: "Use `--omit=dev` instead"

## Root Causes
1. ❌ `npm install` doesn't work well in Railway's build process
2. ❌ Config validation was too strict (required OPENROUTER_API_KEY)
3. ❌ Missing nixpacks configuration

## Fixes Applied

### 1. Updated railway.json
**Changed:**
```json
"buildCommand": "npm install && npm run build"
```

**To:**
```json
"buildCommand": "npm ci && npm run build"
```

`npm ci` is better for CI/CD:
- Faster (uses package-lock.json exactly)
- More reliable (clean install)
- Better for production builds

### 2. Made Config Validation Flexible
**File:** `backend/src/config/index.ts`

**Before:** Crashed if OPENROUTER_API_KEY missing
**After:** 
- Only requires Firebase variables (critical)
- Warns about optional variables (OPENROUTER, EMAIL)
- App can run without AI features

### 3. Added nixpacks.toml
**File:** `backend/nixpacks.toml` (NEW)

Explicit build configuration for Railway:
- Use Node.js 18
- Install with `npm ci`
- Build TypeScript
- Start with `npm start`

## How to Redeploy on Railway

### Option 1: Automatic (Recommended)
Railway will auto-detect these changes and redeploy when you push to GitHub:

```powershell
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

Railway will automatically:
1. Pull latest code
2. Use new nixpacks.toml
3. Run `npm ci && npm run build`
4. Start with `npm start`

### Option 2: Manual Trigger
If auto-deploy isn't set up:

1. Go to Railway dashboard
2. Click your service
3. Click **"Redeploy"**

## Required Environment Variables on Railway

### Critical (Must Set):
```env
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FRONTEND_URL=https://your-app.vercel.app
```

### Optional (For Features):
```env
OPENROUTER_API_KEY=your_key          # For AI job generation
EMAIL_USER=your_email                # For email notifications
EMAIL_PASSWORD=your_password
BEYONDPRESENCE_API_KEY=your_key     # For video interviews
N8N_WEBHOOK_URL=your_webhook        # For automation
WEBHOOK_SECRET=random_secret_32_chars
```

## Verify Deployment

After redeploying, check:

### 1. Build Logs
Should see:
```
✓ Installing dependencies with npm ci
✓ Building TypeScript
✓ Compiled successfully
```

### 2. Start Logs
Should see:
```
🚀 Server is running!
📡 Environment: production
✅ Health Check: https://your-app.railway.app/api/health
```

### 3. Health Check
```bash
curl https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-22T..."
}
```

## What Will Work Now

### ✅ With Just Firebase Variables:
- Authentication (login/signup)
- Job CRUD (create, read, update, delete)
- Candidate applications
- File uploads to Firebase Storage
- Dashboard statistics
- Manual job descriptions

### ⚠️ Requires Additional Variables:
- AI job generation → Needs OPENROUTER_API_KEY
- Email notifications → Needs EMAIL_USER + EMAIL_PASSWORD
- Video interviews → Needs BEYONDPRESENCE_API_KEY
- Workflow automation → Needs N8N_WEBHOOK_URL

## Common Railway Errors Fixed

### Error: "npm WARN config production"
✅ **Fixed:** Using `npm ci` instead of `npm install`

### Error: "Cannot find module 'typescript'"
✅ **Fixed:** `npm ci` installs all dependencies including dev deps for build

### Error: "Missing required environment variables: OPENROUTER_API_KEY"
✅ **Fixed:** OpenRouter is now optional, only warns if missing

### Error: Build timeout
✅ **Fixed:** `npm ci` is faster than `npm install`

## Next Steps

1. **Push changes to GitHub:**
   ```powershell
   git add .
   git commit -m "Fix Railway deployment"
   git push origin main
   ```

2. **Watch Railway logs:**
   - Go to Railway dashboard
   - Click your service
   - Click "Logs" tab
   - Should see successful build and start

3. **Test health endpoint:**
   ```bash
   curl https://your-app.railway.app/api/health
   ```

4. **Update Vercel if needed:**
   If Railway gave you a new URL, update Vercel:
   - Vercel dashboard → Environment Variables
   - Update `NEXT_PUBLIC_API_URL`
   - Redeploy

## Troubleshooting

### Still crashing?

**Check Railway Logs:**
1. Railway dashboard → Your service → Logs
2. Look for error messages

**Common issues:**

1. **"Missing required environment variables"**
   - Check Variables tab in Railway
   - Verify FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY are set

2. **"Port already in use"**
   - Railway sets PORT automatically
   - Make sure you have `PORT` env var or it defaults to 5000

3. **"Cannot connect to Firestore"**
   - Check FIREBASE_PRIVATE_KEY has proper line breaks: `\n`
   - Example: `"-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----"`

4. **Build succeeds but start fails**
   - Check if `dist/server.js` exists after build
   - Verify `npm start` command works: should run `node dist/server.js`

### Need More Help?

1. **Railway Logs:** Most helpful for debugging
2. **Railway Discord:** https://discord.gg/railway
3. **Check:** `DEPLOYMENT_GUIDE.md` → Troubleshooting section

## Files Changed

✅ `backend/railway.json` - Updated build command to `npm ci`
✅ `backend/nixpacks.toml` - Added explicit build config (NEW)
✅ `backend/src/config/index.ts` - Made validation flexible
✅ `RAILWAY_FIX.md` - This guide (NEW)

---

**Status:** ✅ Ready to redeploy  
**Action:** Push to GitHub or click Redeploy in Railway  
**Expected:** Successful deployment with health check passing

**Last Updated:** October 22, 2025
