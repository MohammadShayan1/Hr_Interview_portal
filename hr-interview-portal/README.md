# HR Virtual Interview Portal

> **AI-Powered Recruitment Automation Platform** - A production-ready, scalable SaaS application for automating the entire interview lifecycle.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [n8n Workflow Integration](#n8n-workflow-integration)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The HR Virtual Interview Portal is a comprehensive multi-tenant SaaS application that revolutionizes the recruitment process by automating:

- **AI-Generated Job Descriptions**: Create professional job posts using OpenRouter.ai
- **Candidate Management**: Track applications and interview statuses
- **Automated Interview Scheduling**: Integration with BeyondPresence for virtual interviews
- **AI-Powered Evaluation**: Automatic candidate assessment and report generation
- **Workflow Automation**: n8n integration for end-to-end process automation

## ✨ Features

### For HR Professionals

- 🔐 **Secure Authentication**: Firebase-based user management
- 📝 **AI Job Post Generation**: Intelligent job description creation
- 📊 **Dashboard Analytics**: Real-time metrics and insights
- 👥 **Candidate Tracking**: Complete applicant lifecycle management
- 📧 **Automated Communications**: Email notifications via Nodemailer
- 📑 **Interview Reports**: AI-generated candidate evaluations

### For Candidates

- 📋 **Simple Application Form**: Easy-to-use public application interface
- 📤 **Resume Upload**: Secure file storage with Firebase
- 🎥 **Virtual Interviews**: Seamless video interview experience
- ✉️ **Email Notifications**: Automated interview invitations

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Admin SDK
- **Validation**: Express Validator
- **Logging**: Winston
- **Security**: Helmet, CORS

### External Services
- **AI**: OpenRouter.ai API
- **Video Interviews**: BeyondPresence API
- **Email**: Nodemailer (SMTP)
- **Automation**: n8n Workflows

## 📁 Project Structure

\`\`\`
hr-interview-portal/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── index.ts       # Environment configuration
│   │   │   ├── firebase.ts    # Firebase Admin setup
│   │   │   └── logger.ts      # Winston logger
│   │   ├── controllers/       # Route controllers
│   │   │   ├── job.controller.ts
│   │   │   ├── candidate.controller.ts
│   │   │   └── webhook.controller.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── webhook.middleware.ts
│   │   ├── routes/           # API routes
│   │   │   ├── job.routes.ts
│   │   │   ├── candidate.routes.ts
│   │   │   ├── webhook.routes.ts
│   │   │   └── index.ts
│   │   ├── services/         # Business logic
│   │   │   ├── openrouter.service.ts
│   │   │   ├── beyondpresence.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── n8n.service.ts
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── login/        # Authentication pages
│   │   │   ├── signup/
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   └── globals.css   # Global styles
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # UI components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/             # Utilities
│   │   │   ├── firebase.ts  # Firebase client config
│   │   │   └── api.ts       # API client
│   │   ├── services/        # API services
│   │   │   ├── auth.service.ts
│   │   │   ├── job.service.ts
│   │   │   └── candidate.service.ts
│   │   └── types/           # TypeScript types
│   │       └── index.ts
│   ├── .env.example
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── package.json              # Root package.json
├── .gitignore
└── README.md
\`\`\`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

You will also need accounts for:

- **Firebase**: For authentication, Firestore database, and storage
- **OpenRouter.ai**: For AI job description generation and interview evaluation
- **BeyondPresence** (or alternative video platform): For interview meetings
- **n8n** (optional): For workflow automation
- **Email Provider**: Gmail, SendGrid, or similar for SMTP

## 🚀 Installation

### 1. Clone the Repository

\`\`\`powershell
git clone <repository-url>
cd hr-interview-portal
\`\`\`

### 2. Install Dependencies

Install all dependencies for both frontend and backend:

\`\`\`powershell
npm run install:all
\`\`\`

Or install individually:

\`\`\`powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

## ⚙️ Configuration

### Backend Configuration

1. **Navigate to backend directory**:
   \`\`\`powershell
   cd backend
   \`\`\`

2. **Create `.env` file** from the example:
   \`\`\`powershell
   cp .env.example .env
   \`\`\`

3. **Configure environment variables**:

\`\`\`env
# Server Configuration
NODE_ENV=development
PORT=5000

# Firebase Configuration
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# OpenRouter.ai API
# Sign up at https://openrouter.ai
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# BeyondPresence API (or your video platform)
BEYONDPRESENCE_API_KEY=your-beyondpresence-api-key
BEYONDPRESENCE_API_URL=https://api.beyondpresence.com/v1

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use App Password for Gmail
EMAIL_FROM=HR Interview Portal <your-email@gmail.com>

# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/candidate-application
N8N_WEBHOOK_SECRET=your-webhook-secret-key

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
WEBHOOK_SECRET=your-webhook-secret-for-n8n-callbacks
\`\`\`

### Frontend Configuration

1. **Navigate to frontend directory**:
   \`\`\`powershell
   cd frontend
   \`\`\`

2. **Create `.env.local` file**:
   \`\`\`powershell
   cp .env.example .env.local
   \`\`\`

3. **Configure environment variables**:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Configuration (Client-side)
# Get these from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
\`\`\`

### Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Cloud Storage

2. **Get Firebase Admin Credentials**:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file and extract the required fields for `.env`

3. **Get Firebase Client Configuration**:
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a Web app
   - Copy the config object for frontend `.env.local`

## 🏃 Running Locally

### Option 1: Run Both Services Concurrently

From the root directory:

\`\`\`powershell
npm run dev
\`\`\`

### Option 2: Run Services Separately

**Terminal 1 - Backend**:
\`\`\`powershell
cd backend
npm run dev
\`\`\`

**Terminal 2 - Frontend**:
\`\`\`powershell
cd frontend
npm run dev
\`\`\`

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🌐 Deployment

### Backend Deployment (Example: Google Cloud Run)

1. **Build the backend**:
   \`\`\`powershell
   cd backend
   npm run build
   \`\`\`

2. **Create a `Dockerfile`** (backend/Dockerfile):
   \`\`\`dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist ./dist
   EXPOSE 5000
   CMD ["node", "dist/server.js"]
   \`\`\`

3. **Deploy to Cloud Run**:
   \`\`\`powershell
   gcloud run deploy hr-interview-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   \`\`\`

### Frontend Deployment (Vercel - Recommended)

1. **Install Vercel CLI**:
   \`\`\`powershell
   npm i -g vercel
   \`\`\`

2. **Deploy**:
   \`\`\`powershell
   cd frontend
   vercel --prod
   \`\`\`

3. **Configure Environment Variables** in Vercel Dashboard

### Alternative Deployment Options

- **Backend**: AWS Lambda, DigitalOcean App Platform, Heroku, Railway
- **Frontend**: Netlify, AWS Amplify, Firebase Hosting

## 🔄 n8n Workflow Integration

The application uses n8n for workflow automation. Here's how to set it up:

### n8n Workflow Overview

```
1. Candidate applies → Backend saves to Firestore
2. Backend triggers n8n webhook
3. n8n creates interview link (BeyondPresence API)
4. n8n updates Firestore with interview link
5. n8n sends email invitation to candidate
6. After interview → n8n fetches transcript
7. n8n sends transcript to OpenRouter.ai for evaluation
8. n8n posts report back to application webhook
```

### Setting Up n8n

1. **Install n8n** (or use n8n Cloud):
   \`\`\`powershell
   npm install n8n -g
   n8n start
   \`\`\`

2. **Create Webhook Trigger**:
   - Add a Webhook node
   - Set URL path: `/webhook/candidate-application`
   - Method: POST
   - Copy the webhook URL to backend `.env` (N8N_WEBHOOK_URL)

3. **Add HTTP Request Node** (BeyondPresence):
   - Method: POST
   - URL: BeyondPresence API endpoint
   - Body: Interview details from webhook

4. **Add Firestore Node** (or HTTP Request to your backend):
   - Update candidate document with interview link

5. **Add Email Node** (Send Invitation):
   - Configure SMTP settings
   - Send interview link to candidate

6. **Post-Interview Workflow**:
   - Trigger: BeyondPresence webhook or manual
   - Fetch transcript
   - Call OpenRouter.ai API
   - POST to `/api/webhooks/update-interview` with evaluation

For a detailed n8n workflow template, see [n8n-workflow.json](./docs/n8n-workflow.json) (create this file with your workflow export).

## 📚 API Documentation

### Authentication

All protected endpoints require a Firebase JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <firebase-id-token>
\`\`\`

### Endpoints

#### Jobs

- `POST /api/jobs` - Create a new job post
- `GET /api/jobs` - Get all jobs for authenticated user
- `GET /api/jobs/:jobId` - Get job by ID
- `GET /api/jobs/public/:jobId` - Get public job details (no auth)
- `PUT /api/jobs/:jobId` - Update a job post
- `DELETE /api/jobs/:jobId` - Delete a job post
- `POST /api/jobs/ai/generate-description` - Generate AI job description

#### Candidates

- `POST /api/candidates/apply/:jobId` - Submit application (public, with file upload)
- `GET /api/candidates/job/:jobId` - Get candidates for a job
- `GET /api/candidates/:candidateId` - Get candidate details
- `GET /api/candidates/dashboard/stats` - Get dashboard statistics

#### Webhooks

- `POST /api/webhooks/update-interview` - Update interview data (secured with webhook secret)

### Example Request

\`\`\`javascript
// Create a job post
const response = await fetch('http://localhost:5000/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    title: 'Senior Software Engineer',
    description: '<h2>About the Role</h2><p>...</p>'
  })
});
\`\`\`

## 🔒 Security

### Implemented Security Measures

- ✅ Firebase Authentication with JWT verification
- ✅ CORS configuration for allowed origins
- ✅ Helmet.js for HTTP headers security
- ✅ Express Validator for input validation
- ✅ Webhook secret verification for n8n callbacks
- ✅ Environment variable protection
- ✅ Secure file upload with validation
- ✅ Error handling without exposing sensitive data

### Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** in production
3. **Enable Firebase App Check** for additional security
4. **Implement rate limiting** (add express-rate-limit)
5. **Regular dependency updates** with `npm audit`
6. **Use HTTPS** in production
7. **Implement CSRF protection** for forms

## 🧪 Testing

### Run Tests (when implemented)

\`\`\`powershell
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
\`\`\`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For issues, questions, or contributions, please:

1. Check existing [Issues](../../issues)
2. Create a new issue with detailed information
3. Submit pull requests for bug fixes or features

## 🎉 Acknowledgments

- OpenRouter.ai for AI capabilities
- Firebase for backend infrastructure
- Next.js team for the amazing framework
- n8n community for workflow automation

---

**Built with ❤️ for modern HR teams**
