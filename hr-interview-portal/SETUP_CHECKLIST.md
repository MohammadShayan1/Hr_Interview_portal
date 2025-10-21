# ✅ HR Interview Portal - Complete Setup Checklist

Use this checklist to ensure you have everything configured correctly.

## 📋 Pre-Setup (5 minutes)

- [ ] Node.js (v18+) installed - Run: `node --version`
- [ ] npm or yarn installed - Run: `npm --version`
- [ ] Git installed - Run: `git --version`
- [ ] Text editor (VS Code recommended) installed
- [ ] Firebase account created (free tier is fine)
- [ ] OpenRouter.ai account created

## 🔥 Firebase Setup (10 minutes)

### Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Click "Create a project" or "Add project"
- [ ] Enter project name (e.g., "hr-interview-portal-dev")
- [ ] Disable Google Analytics (or enable if you want it)
- [ ] Click "Create project"

### Enable Authentication
- [ ] In Firebase Console, go to "Authentication"
- [ ] Click "Get started"
- [ ] Click "Sign-in method" tab
- [ ] Click "Email/Password"
- [ ] Toggle "Enable" switch ON
- [ ] Click "Save"

### Enable Firestore
- [ ] In Firebase Console, go to "Firestore Database"
- [ ] Click "Create database"
- [ ] Select "Start in test mode" (for development)
- [ ] Choose a location (closest to you)
- [ ] Click "Enable"

### Enable Storage
- [ ] In Firebase Console, go to "Storage"
- [ ] Click "Get started"
- [ ] Start in test mode
- [ ] Click "Next" → "Done"

### Get Admin Credentials
- [ ] Go to Project Settings (gear icon) → "Service accounts"
- [ ] Click "Generate new private key"
- [ ] Click "Generate key"
- [ ] Save the JSON file (keep it secure!)
- [ ] Open the JSON file and note:
  - `project_id` → `FIREBASE_PROJECT_ID`
  - `private_key` → `FIREBASE_PRIVATE_KEY`
  - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Get Web Credentials
- [ ] Go to Project Settings → "General"
- [ ] Scroll to "Your apps"
- [ ] Click "</>" (Web) icon
- [ ] Enter app nickname (e.g., "Web App")
- [ ] Don't check "Firebase Hosting"
- [ ] Click "Register app"
- [ ] Copy the config object values:
  - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🤖 OpenRouter.ai Setup (5 minutes)

- [ ] Go to [OpenRouter.ai](https://openrouter.ai/)
- [ ] Click "Sign up" or "Get started"
- [ ] Create an account (can use Google sign-in)
- [ ] Go to "Keys" or "API Keys"
- [ ] Click "Create new key"
- [ ] Name it "HR Interview Portal"
- [ ] Copy the API key → `OPENROUTER_API_KEY`
- [ ] Add credits if needed (some models are free)

## 📧 Email Setup - Gmail (5 minutes)

### Enable 2-Factor Authentication
- [ ] Go to [Google Account Security](https://myaccount.google.com/security)
- [ ] Find "2-Step Verification"
- [ ] Follow steps to enable if not already on

### Create App Password
- [ ] Go to [App Passwords](https://myaccount.google.com/apppasswords)
- [ ] Select app: "Mail"
- [ ] Select device: "Other" → Enter "HR Portal"
- [ ] Click "Generate"
- [ ] Copy the 16-character password → `EMAIL_PASSWORD`

### Note Your Email
- [ ] Your Gmail address → `EMAIL_USER`

## 💻 Code Setup (10 minutes)

### Clone/Download Project
- [ ] Clone repository or extract ZIP
- [ ] Open terminal/PowerShell
- [ ] Navigate to project directory:
  \`\`\`powershell
  cd path\to\hr-interview-portal
  \`\`\`

### Install Dependencies
- [ ] Run: `npm install` (root directory)
- [ ] Run: `cd backend && npm install`
- [ ] Run: `cd ../frontend && npm install`
- [ ] Run: `cd ..` (back to root)

### Configure Backend
- [ ] Navigate to backend: `cd backend`
- [ ] Copy example: `cp .env.example .env` (or copy manually)
- [ ] Open `backend/.env` in text editor
- [ ] Fill in these values:

\`\`\`env
# Already set
NODE_ENV=development
PORT=5000

# From Firebase Admin
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# From OpenRouter.ai
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# From Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=HR Portal <youremail@gmail.com>

# URLs (keep as is for local dev)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Security (change these!)
JWT_SECRET=change-this-to-random-32-char-string
WEBHOOK_SECRET=change-this-to-another-random-string

# Optional (leave empty for now)
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
BEYONDPRESENCE_API_KEY=
BEYONDPRESENCE_API_URL=
\`\`\`

- [ ] **IMPORTANT**: For `FIREBASE_PRIVATE_KEY`, make sure to:
  - Keep the quotes
  - Keep the \n for line breaks
  - It should look like: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

### Configure Frontend
- [ ] Navigate to frontend: `cd ../frontend`
- [ ] Copy example: `cp .env.example .env.local` (or copy manually)
- [ ] Open `frontend/.env.local` in text editor
- [ ] Fill in these values:

\`\`\`env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# From Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
\`\`\`

## 🚀 First Run (5 minutes)

### Start Backend
- [ ] Open terminal 1
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm run dev`
- [ ] Watch for success message: "Server is running!"
- [ ] Check: http://localhost:5000/api/health
- [ ] Should see: `{"success":true,"message":"API is running",...}`

### Start Frontend
- [ ] Open terminal 2
- [ ] Navigate to frontend: `cd frontend`
- [ ] Run: `npm run dev`
- [ ] Watch for: "ready - started server on http://localhost:3000"
- [ ] Open browser: http://localhost:3000
- [ ] Should see the landing page

## ✨ First Test (10 minutes)

### Create Account
- [ ] Click "Get Started" or "Sign Up"
- [ ] Enter email and password (min 6 characters)
- [ ] Click "Create Account"
- [ ] Should redirect to dashboard

### Create First Job
- [ ] Click "Create New Job Post" from dashboard
- [ ] Or go to Jobs → New Job
- [ ] Enter job title: "Software Engineer"
- [ ] Enter requirements: "5 years experience, React, Node.js"
- [ ] Click "Generate with AI" (optional)
- [ ] Wait for AI to generate description
- [ ] Click "Save" or "Create Job"
- [ ] Should appear in job list

### Test Public Application
- [ ] Copy the job ID from the job list or URL
- [ ] Open new browser window (incognito/private)
- [ ] Go to: http://localhost:3000/apply/[job-id]
- [ ] Should see the application form
- [ ] Fill in:
  - Name: "Test Candidate"
  - Email: your-test-email@gmail.com
  - Phone: "+1234567890"
  - Experience: "5"
  - Resume: Upload a test PDF file
- [ ] Click "Submit Application"
- [ ] Should see success message

### Verify Email Sent
- [ ] Check the email inbox (your-test-email@gmail.com)
- [ ] Look for "Interview Invitation" email
- [ ] Should contain interview link
- [ ] Email might be in spam/promotions folder

### Check Dashboard
- [ ] Back in main browser (logged in)
- [ ] Go to Dashboard
- [ ] Should see:
  - Total Jobs: 1
  - Total Candidates: 1
  - Interviews Completed: 0
- [ ] Click "View All Jobs" or go to Jobs
- [ ] Click on your job
- [ ] Should see the candidate listed
- [ ] Status should be "Interview Scheduled"

## 🎯 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**:
\`\`\`powershell
# Delete node_modules and reinstall
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
\`\`\`

### Issue: Firebase authentication errors
**Solution**:
- [ ] Double-check `FIREBASE_PRIVATE_KEY` has proper line breaks (\n)
- [ ] Ensure Email/Password auth is enabled in Firebase Console
- [ ] Verify all Firebase credentials are correct

### Issue: Backend won't start
**Solution**:
- [ ] Check if port 5000 is already in use
- [ ] Try changing `PORT=5001` in `.env`
- [ ] Check for typos in `.env` file
- [ ] Look at error messages in terminal

### Issue: Frontend won't start
**Solution**:
- [ ] Check if port 3000 is already in use
- [ ] Ensure all dependencies installed: `npm install`
- [ ] Check `.env.local` file exists and is correct

### Issue: Email not sending
**Solution**:
- [ ] Verify Gmail App Password is correct
- [ ] Check if 2FA is enabled on Gmail
- [ ] Try sending a test email manually
- [ ] Check spam folder
- [ ] Look at backend logs for errors

### Issue: File upload fails
**Solution**:
- [ ] Check Firebase Storage is enabled
- [ ] Verify storage bucket name in `.env`
- [ ] Check file size (max 5MB)
- [ ] Check file type (PDF, DOC, DOCX only)

## 📚 Next Steps

Once everything is working:

### Explore the Application
- [ ] Try all features in the dashboard
- [ ] Create multiple jobs
- [ ] Test different application scenarios
- [ ] Review the generated emails

### Set Up n8n (Optional)
- [ ] Read [N8N_WORKFLOW_GUIDE.md](./N8N_WORKFLOW_GUIDE.md)
- [ ] Install n8n
- [ ] Configure the workflow
- [ ] Test automation

### Customize
- [ ] Modify email templates
- [ ] Change AI prompts
- [ ] Adjust UI colors/branding
- [ ] Add your logo

### Deploy (When Ready)
- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] Choose hosting provider
- [ ] Set up production Firebase project
- [ ] Deploy!

## 🎉 Success!

If you've checked all the boxes above, **congratulations!** 🎊

You now have a fully functional HR Interview Portal running locally!

## 📞 Need Help?

If you're stuck:
1. Check [QUICKSTART.md](./QUICKSTART.md) for detailed solutions
2. Review [README.md](./README.md) for comprehensive docs
3. Check error messages in terminal
4. Look at backend logs in `backend/logs/`
5. Create an issue with:
   - What you were trying to do
   - What happened instead
   - Error messages
   - Screenshots

## 📝 Notes Section

Use this space to write down your specific configurations:

**My Firebase Project ID**: ___________________________

**My Backend URL (production)**: ___________________________

**My Frontend URL (production)**: ___________________________

**My n8n Instance URL**: ___________________________

**Email for Notifications**: ___________________________

**Date Deployed**: ___________________________

---

**Happy Hiring! 🚀**

*Save this checklist for future reference or when setting up on a new machine.*
