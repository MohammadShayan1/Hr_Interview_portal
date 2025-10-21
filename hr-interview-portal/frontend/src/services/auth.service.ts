import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthError {
  code: string;
  message: string;
}

const parseFirebaseError = (error: any): AuthError => {
  // Check if error has Firebase error structure
  const isFirebaseError = error && typeof error === 'object' && 'code' in error;
  
  if (isFirebaseError) {
    const errorMap: Record<string, string> = {
      'auth/invalid-api-key': 'Firebase API key is invalid. Please contact support.',
      'auth/api-key-not-valid': 'Firebase API key is not valid. Please contact support.',
      'auth/email-already-in-use': 'Email already registered. Try signing in or resetting password.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many login attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    
    return {
      code: error.code,
      message: errorMap[error.code] || error.message || 'Authentication failed',
    };
  }
  
  return {
    code: 'unknown',
    message: error?.message || 'An unknown error occurred',
  };
};

export const authService = {
  // Sign up
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const parsedError = parseFirebaseError(error);
      throw new Error(parsedError.message);
    }
  },

  // Sign in
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const parsedError = parseFirebaseError(error);
      throw new Error(parsedError.message);
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const parsedError = parseFirebaseError(error);
      throw new Error(parsedError.message);
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const parsedError = parseFirebaseError(error);
      throw new Error(parsedError.message);
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};
