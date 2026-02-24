# Firebase Authentication Setup Guide

This document explains how to set up Firebase Authentication for the Tukonawe app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" and follow the setup wizard
3. Name your project (e.g., "tukonawe-app")
4. Enable Google Analytics (optional but recommended)
5. Select your country and agree to terms

## Step 2: Register Your App

1. In the Firebase Console, click the web icon `</>` to add a web app
2. Give it a name (e.g., "Tukonawe Web" or "Tukonawe Mobile")
3. Register the app
4. You'll see your Firebase configuration - copy it for the next step

## Step 3: Get Your Firebase Credentials

In the Firebase Console:

1. Go to **Project Settings** (gear icon)
2. Under "Your apps" section, find your app
3. Click the config icon or scroll to see the Firebase SDK snippet
4. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 4: Configure Environment Variables

1. Open `.env.local` in the project root
2. Fill in your Firebase credentials:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on "Email/Password"
3. Enable it and save

## Step 6: Configure Email Templates (Optional)

1. Go to **Authentication** → **Templates**
2. Customize sign-in emails for password reset and email verification
3. Add your app logo and branding

## Finished!

Your Firebase authentication is now configured. The app will:

- ✅ Sign up new users with email/password
- ✅ Login existing users
- ✅ Send email verification links
- ✅ Send password reset emails
- ✅ Store tokens securely locally
- ✅ Automatically redirect based on auth state

## Environment Variable Notes

- **EXPO*PUBLIC*** prefix: These are safe to expose in client code (not secrets)
- The `.env.local` file is already in `.gitignore` - keep it private!
- Never commit real credentials to version control
- For production, use GitHub Secrets or your CI/CD platform's secret management

## Testing

1. Start the app: `npm start`
2. Test sign up with a test email
3. Check your email for verification link
4. Login with verified email
5. Test password reset
6. Test logout

## Troubleshooting

**"Cannot find module 'firebase'"**

- Run `npm install firebase expo-secure-store`

**"Firebase config not provided"**

- Check `.env.local` is in the project root
- Restart the app after updating `.env.local`

**"Email verification not received"**

- Check spam folder
- In Firebase Console, go to Authentication → Templates to customize sender info

**"Too many requests" error**

- Firebase rate-limits login attempts after several failures
- Wait a few minutes and try again
