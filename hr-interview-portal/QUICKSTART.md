# HR Interview Portal - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Set Up Firebase (5-10 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or use an existing one)
3. Enable the following services:
   - **Authentication**: 
     - Go to Authentication > Sign-in method
     - Enable "Email/Password"
   - **Firestore Database**:
     - Go to Firestore Database
     - Create database (Start in test mode for development)
   - **Storage**:
     - Go to Storage
     - Get started

4. Get your credentials:
   
   **For Backend (Admin SDK)**:
   - Go to Project Settings (gear icon) > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file
   
   **For Frontend (Web SDK)**:
   - Go to Project Settings > General
   - Scroll to "Your apps" > Add app > Web
   - Copy the config object

### Step 2: Get API Keys

#### OpenRouter.ai (Required)
1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Generate an API key from the dashboard
4. Copy the key for your `.env` file

#### Email Setup (Gmail Example)
1. Use your Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Google Account > Security
   - Enable 2-Step Verification
   - Go to App passwords
   - Generate password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

### Step 3: Install and Configure

\`\`\`powershell
# 1. Clone the repository
git clone <repo-url>
cd hr-interview-portal

# 2. Install dependencies
npm run install:all

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your Firebase and API credentials

# 4. Configure frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your Firebase web config

# 5. Start the application
cd ..
npm run dev
\`\`\`

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Step 5: Create Your First Job

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with email/password
4. Navigate to "Create New Job Post"
5. Use the AI generator to create a job description
6. Publish and share the application link!

## 🔧 Minimal Configuration (.env)

### Backend (.env)

\`\`\`env
NODE_ENV=development
PORT=5000

# Firebase (from Service Account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# OpenRouter.ai
OPENROUTER_API_KEY=your-key-here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=HR Portal <your-email@gmail.com>

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Security
JWT_SECRET=change-this-to-random-string
WEBHOOK_SECRET=change-this-to-random-string

# Optional (can be empty for testing)
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
BEYONDPRESENCE_API_KEY=
BEYONDPRESENCE_API_URL=
\`\`\`

### Frontend (.env.local)

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase (from Firebase Console web config)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
\`\`\`

## 📖 Common Issues & Solutions

### Issue: "Cannot find module" errors

**Solution**: Make sure you've installed dependencies:
\`\`\`powershell
cd backend && npm install
cd ../frontend && npm install
\`\`\`

### Issue: Firebase authentication errors

**Solution**: 
1. Double-check your Firebase credentials
2. Make sure Email/Password auth is enabled in Firebase Console
3. Verify the private key has proper line breaks (\n)

### Issue: CORS errors

**Solution**: Update `FRONTEND_URL` in backend `.env` to match your frontend URL

### Issue: File upload fails

**Solution**: 
1. Check Firebase Storage rules
2. Verify `FIREBASE_STORAGE_BUCKET` is correct
3. Ensure Storage is enabled in Firebase Console

## 🎯 Next Steps

1. **Set up n8n** for full automation (optional)
2. **Configure BeyondPresence** or your video platform
3. **Customize email templates** in `backend/src/services/email.service.ts`
4. **Deploy to production** (see main README)
5. **Set up monitoring and logging**

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review error logs in `backend/logs/`
- Enable debug logging by setting `NODE_ENV=development`

Happy hiring! 🎉
