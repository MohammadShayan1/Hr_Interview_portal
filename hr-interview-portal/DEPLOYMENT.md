# HR Interview Portal - Production Deployment Guide

## 📦 Pre-Deployment Checklist

### Security
- [ ] All `.env` files are in `.gitignore`
- [ ] Strong JWT secrets are set (min 32 characters)
- [ ] Firebase security rules are configured
- [ ] CORS is set to production domains only
- [ ] Rate limiting is enabled (optional but recommended)
- [ ] HTTPS is enforced

### Configuration
- [ ] All environment variables are set correctly
- [ ] Production URLs are updated
- [ ] Email templates are reviewed
- [ ] Firebase project is in production mode
- [ ] API keys have proper rate limits

### Testing
- [ ] All features tested locally
- [ ] File uploads work correctly
- [ ] Email notifications are sent
- [ ] Authentication flow is complete
- [ ] n8n webhooks are working (if configured)

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Google Cloud Run (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login to Vercel**:
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy Frontend**:
   \`\`\`bash
   cd frontend
   vercel --prod
   \`\`\`

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add all variables from `.env.example`
   - Redeploy if needed

#### Backend on Google Cloud Run

1. **Install Google Cloud SDK**:
   - Download from: https://cloud.google.com/sdk/docs/install

2. **Login and Set Project**:
   \`\`\`bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   \`\`\`

3. **Create Dockerfile** (if not exists):
   
   Create `backend/Dockerfile`:
   \`\`\`dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   
   # Install dependencies
   RUN npm ci --only=production
   
   # Copy built files
   COPY dist ./dist
   
   # Expose port
   EXPOSE 8080
   
   # Start the server
   CMD ["node", "dist/server.js"]
   \`\`\`

4. **Build TypeScript**:
   \`\`\`bash
   cd backend
   npm run build
   \`\`\`

5. **Deploy to Cloud Run**:
   \`\`\`bash
   gcloud run deploy hr-interview-backend \\
     --source . \\
     --platform managed \\
     --region us-central1 \\
     --allow-unauthenticated \\
     --set-env-vars "NODE_ENV=production,PORT=8080" \\
     --memory 1Gi
   \`\`\`

6. **Set Environment Variables**:
   \`\`\`bash
   gcloud run services update hr-interview-backend \\
     --region us-central1 \\
     --update-env-vars FIREBASE_PROJECT_ID=your-project-id,\\
FIREBASE_CLIENT_EMAIL=your-email@....iam.gserviceaccount.com,\\
OPENROUTER_API_KEY=your-key
   \`\`\`

   Note: For sensitive vars like `FIREBASE_PRIVATE_KEY`, use Secret Manager

### Option 2: Railway (Full Stack)

1. **Sign up** at https://railway.app

2. **Create New Project** > Deploy from GitHub

3. **Add Backend Service**:
   - Root Directory: `/backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add all environment variables

4. **Add Frontend Service**:
   - Root Directory: `/frontend`
   - Framework: Next.js (auto-detected)
   - Add all environment variables

5. **Generate Domains** for both services

### Option 3: DigitalOcean App Platform

1. **Create Account** at DigitalOcean

2. **Create New App** > From GitHub

3. **Configure Backend**:
   - Type: Web Service
   - Build Command: `cd backend && npm install && npm run build`
   - Run Command: `cd backend && npm start`
   - HTTP Port: 5000

4. **Configure Frontend**:
   - Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/.next`

5. **Set Environment Variables** for each component

### Option 4: AWS (Advanced)

#### Backend on AWS Lambda + API Gateway

1. Install Serverless Framework:
   \`\`\`bash
   npm install -g serverless
   \`\`\`

2. Create `serverless.yml` in backend:
   \`\`\`yaml
   service: hr-interview-backend
   
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
     environment:
       NODE_ENV: production
       # Add other env vars
   
   functions:
     app:
       handler: dist/lambda.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
             cors: true
   \`\`\`

3. Create `backend/src/lambda.ts`:
   \`\`\`typescript
   import serverless from 'serverless-http';
   import createApp from './app';
   
   const app = createApp();
   export const handler = serverless(app);
   \`\`\`

4. Deploy:
   \`\`\`bash
   cd backend
   serverless deploy
   \`\`\`

#### Frontend on AWS Amplify

1. Connect GitHub repository
2. Select frontend folder
3. Configure build settings
4. Add environment variables
5. Deploy

## 🔐 Production Environment Variables

### Backend Production `.env`

\`\`\`env
NODE_ENV=production
PORT=8080

# Firebase
FIREBASE_PROJECT_ID=prod-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=prod-project.appspot.com

# OpenRouter.ai
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# BeyondPresence (or your video platform)
BEYONDPRESENCE_API_KEY=prod-api-key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com/v1

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxx
EMAIL_FROM=HR Team <noreply@yourdomain.com>

# n8n
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/candidate
N8N_WEBHOOK_SECRET=strong-random-secret-key

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Security
JWT_SECRET=super-secure-random-string-min-32-chars
WEBHOOK_SECRET=another-secure-random-string
\`\`\`

### Frontend Production Variables

\`\`\`env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
\`\`\`

## 📊 Firebase Production Setup

### Firestore Security Rules

Update Firestore rules for production:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if true; // Public read for job listings
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
    }
    
    // Candidates collection
    match /candidates/{candidateId} {
      allow create: if true; // Public create for applications
      allow read, update: if request.auth != null && 
        get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.createdBy == request.auth.uid;
    }
  }
}
\`\`\`

### Storage Security Rules

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{jobId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.resource.size < 5 * 1024 * 1024 && // 5MB
        (request.resource.contentType.matches('application/pdf') ||
         request.resource.contentType.matches('application/msword') ||
         request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
    }
  }
}
\`\`\`

## 🔍 Post-Deployment Testing

### 1. Health Check
\`\`\`bash
curl https://api.yourdomain.com/api/health
\`\`\`

### 2. Test Authentication
- Sign up with a new account
- Verify email (if enabled)
- Log in and access dashboard

### 3. Test Job Creation
- Create a new job with AI
- Verify it appears in the list
- Check Firestore for the document

### 4. Test Application Flow
- Visit public job application page
- Submit an application with resume
- Verify email is received
- Check candidate appears in dashboard

### 5. Test n8n Integration (if configured)
- Submit application
- Check n8n workflow execution
- Verify interview link is generated
- Confirm email is sent

## 📈 Monitoring & Logging

### Set Up Application Monitoring

1. **Google Cloud Monitoring** (for Cloud Run):
   - Automatic logging and metrics
   - Set up alerts for errors and latency

2. **Vercel Analytics** (for frontend):
   - Enable in project settings
   - Monitor Web Vitals

3. **Sentry** (optional, for error tracking):
   \`\`\`bash
   npm install @sentry/node @sentry/react
   \`\`\`

### Log Rotation

For backend logs, configure Winston for production:

\`\`\`typescript
// In backend/src/config/logger.ts
new winston.transports.File({ 
  filename: 'logs/error.log', 
  level: 'error',
  maxsize: 5242880, // 5MB
  maxFiles: 5,
})
\`\`\`

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Build
        run: cd backend && npm run build
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: hr-interview-backend
          region: us-central1
          source: ./backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
\`\`\`

## 🛡️ Security Hardening

1. **Enable Rate Limiting**:
   \`\`\`bash
   cd backend
   npm install express-rate-limit
   \`\`\`

2. **Add CSRF Protection**:
   \`\`\`bash
   npm install csurf
   \`\`\`

3. **Enable Firebase App Check**:
   - Follow: https://firebase.google.com/docs/app-check

4. **Set up WAF** (Web Application Firewall):
   - Cloudflare (free tier available)
   - AWS WAF
   - Google Cloud Armor

## 📞 Support & Maintenance

### Backup Strategy

1. **Firestore Backups**:
   - Enable automatic backups in Firebase Console
   - Export data regularly

2. **Code Backups**:
   - GitHub repository (primary)
   - Secondary backup location

### Update Schedule

- Weekly: Dependency updates (\`npm audit\`)
- Monthly: Security patches
- Quarterly: Feature updates

---

**Your HR Interview Portal is now production-ready! 🎉**

For issues or questions, refer to the main [README.md](./README.md) or create an issue on GitHub.
