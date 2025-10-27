import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSy-development-key-for-testing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const isValidConfig = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('undefined')
  );
};

if (!isValidConfig()) {
  console.warn('⚠️ Firebase configuration incomplete:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
  });
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Set persistence to local storage - must be set before any auth operations
    // This is a synchronous setup for the auth instance
    if (typeof window !== 'undefined') {
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error('Firebase persistence setup failed:', error);
      });
    }
    
    console.log('✅ Firebase initialized successfully');
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    
    // Ensure persistence is set even if app already exists
    if (typeof window !== 'undefined') {
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error('Firebase persistence setup failed:', error);
      });
    }
  }
} catch (error: any) {
  console.error('❌ Firebase initialization error:', error?.message || error);
  // Throw error to be caught by app error boundary
  throw error;
}

export { app, auth };
