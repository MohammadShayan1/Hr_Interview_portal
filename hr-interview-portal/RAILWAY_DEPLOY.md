# 🚀 Quick Deploy to Railway

## Prerequisites
- [x] Frontend deployed on Vercel
- [ ] GitHub repository pushed
- [ ] Firebase project created
- [ ] Environment variables ready

## Steps

### 1. Create Railway Account
Go to [railway.app](https://railway.app) and sign in with GitHub.

### 2. Create New Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `Hr_Interview_portal` repository
4. Railway will auto-detect Node.js

### 3. Configure Service
1. Click on the deployed service
2. Go to **Settings**
3. Set **Root Directory:** `backend`
4. Click **Save**

### 4. Add Environment Variables

Click **Variables** tab and add these:

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----

# OpenRouter (Optional - for AI features)
OPENROUTER_API_KEY=sk-or-v1-your-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# BeyondPresence (Optional)
BEYONDPRESENCE_API_KEY=your_key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com

# n8n (Optional)
N8N_WEBHOOK_URL=your_webhook_url

# Webhook Secret
WEBHOOK_SECRET=generate-random-32-char-secret
```

### 5. Get Backend URL

After deployment completes:
1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy URL: `https://your-app.up.railway.app`

### 6. Update Vercel Frontend

1. Go to Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
   ```
4. **Deployments** → Click `...` → **Redeploy**

### 7. Test Your Deployment

```bash
# Test backend health
curl https://your-app.up.railway.app/api/health

# Should return:
# {"success":true,"message":"API is running","timestamp":"..."}
```

Open your frontend: `https://your-app.vercel.app`
- Try logging in
- Create a job
- Test application flow

## Troubleshooting

### Build Failed
- Check logs in Railway dashboard
- Verify `backend` root directory is set
- Ensure all dependencies in package.json

### Service Not Responding
- Check environment variables are set
- Verify Firebase credentials are correct
- Check logs for errors

### CORS Error
- Make sure `FRONTEND_URL` matches your Vercel URL exactly
- Include https:// in the URL
- Redeploy after changing env vars

## Next Steps

✅ Backend deployed on Railway  
✅ Frontend connected to backend  
✅ Environment variables configured  
✅ Health check passing  

Now test:
- [ ] Sign up / Login
- [ ] Create job
- [ ] AI generation (if API key set)
- [ ] Submit application
- [ ] View candidates

## Support

Need help? Check:
- `DEPLOYMENT_GUIDE.md` - Full deployment guide
- Railway logs for errors
- Firebase console for service issues

---

**Estimated Time:** 10-15 minutes  
**Cost:** $0 (within free tier limits)
