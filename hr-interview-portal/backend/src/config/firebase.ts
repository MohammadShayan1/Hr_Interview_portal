import admin from 'firebase-admin';
import { config } from '../config';

let isInitialized = false;

// Initialize Firebase Admin
const initializeFirebase = () => {
  if (isInitialized) {
    return;
  }
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
      storageBucket: config.firebase.storageBucket,
    });
    
    isInitialized = true;
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
    throw error;
  }
};

// Export lazy getters for Firebase instances
export const getDb = () => admin.firestore();
export const getAuth = () => admin.auth();
export const getStorage = () => admin.storage();

// Aliases for compatibility
export const db = getDb;
export const auth = getAuth;
export const storage = getStorage;

export default initializeFirebase;
