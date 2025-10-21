# Firebase API Key Configuration Fix

## Problem
`Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

This error occurs when the frontend's Firebase Web API Key is invalid or incorrectly configured.

## Root Cause
The Firebase Web API Key in `frontend/.env.local` must be:
1. A **Web API Key** (not Android/iOS)
2. Valid for the `hr-interview-portal-dev` Firebase project
3. Properly restricted to your domain (or unrestricted for development)

## Solution

### Step 1: Get the Correct API Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **hr-interview-portal-dev** project
3. Go to **Project Settings** (gear icon) → **General**
4. Scroll down to **Your apps** section
5. Look for the Web app entry
6. Copy the **apiKey** value from the Firebase config

### Step 2: Update frontend/.env.local

Replace the `NEXT_PUBLIC_FIREBASE_API_KEY` with the correct value from step 1:

```bash
# Before (invalid):
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDGPfPQZxHrTN4mQqGxnzEq5T2h6JvYi2s

# After (replace with your actual key):
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy<YOUR_ACTUAL_KEY_HERE>
```

### Step 3: Verify Firebase Configuration

All these values must match your Firebase Console settings:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<YOUR_WEB_API_KEY>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hr-interview-portal-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hr-interview-portal-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hr-interview-portal-dev.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=457833626048
NEXT_PUBLIC_FIREBASE_APP_ID=1:457833626048:web:<YOUR_APP_ID>
```

### Step 4: Fix API Key Restrictions (if needed)

If the API key has restrictions:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project **hr-interview-portal-dev**
3. Go to **APIs & Services** → **Credentials**
4. Find your Web API Key
5. Click on it to edit
6. Under **Application restrictions** → select **HTTP referrers (web sites)**
7. Add your allowed referrers:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
   - `http://192.168.0.141:3000/*`
   - `http://192.168.0.141:3001/*`

### Step 5: Restart the Application

```bash
# Kill any running instances
Ctrl+C

# Restart
npm run dev
```

## Alternative: Disable Auth Temporarily for Testing

If you need to proceed without valid API key, edit `frontend/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'test-key-for-development',
  // ... rest of config
};
```

**Note:** This is for development only. Production must have valid keys.

## Quick Validation

After updating the API key, check the browser console. You should see:

```
✅ Firebase initialized successfully
```

Instead of:

```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## Reference

- [Firebase Documentation](https://firebase.google.com/docs/web/setup)
- [Firebase API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Restricted API Keys](https://cloud.google.com/docs/authentication/api-keys#api-key-restrictions)

