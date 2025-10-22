import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  
  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  },
  
  // OpenRouter.ai
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    apiUrl: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
  },
  
  // Google Gemini AI
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  
  // BeyondPresence
  beyondPresence: {
    apiKey: process.env.BEYONDPRESENCE_API_KEY || '',
    apiUrl: process.env.BEYONDPRESENCE_API_URL || 'https://api.beyondpresence.com/v1',
  },
  
  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'HR Interview Portal <noreply@example.com>',
  },
  
  // n8n
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || '',
    webhookSecret: process.env.N8N_WEBHOOK_SECRET || '',
  },
  
  // URLs
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  webhookSecret: process.env.WEBHOOK_SECRET || 'change-this-webhook-secret',
};

// Validate required environment variables
export const validateConfig = (): void => {
  const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Warn about optional but recommended variables
  const recommended = [
    'OPENROUTER_API_KEY',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
  ];
  
  const missingRecommended = recommended.filter((key) => !process.env[key]);
  
  if (missingRecommended.length > 0 && config.nodeEnv === 'production') {
    console.warn(`⚠️  Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`);
    console.warn('   Some features may not work without these variables.');
  }
};
