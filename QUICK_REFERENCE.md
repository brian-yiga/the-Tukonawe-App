# Firebase Auth - Quick Reference Card

## 🚀 Three-Step Quick Start

### Step 1: Install Dependencies (2 min)

```bash
npm install
```

### Step 2: Get Firebase Credentials (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create/select project
3. Add Web app
4. Copy 6 credential values
5. Create `.env.local` in project root
6. Paste credentials (see template below)

### Step 3: Enable Email Auth in Firebase (1 min)

1. Firebase Console → Authentication
2. Click "Sign-in method"
3. Enable "Email/Password"

### Step 4: Start & Test (1 min)

```bash
npm start
```

---

## 📋 .env.local Template

Copy this to `.env.local` in your project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_value_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_value_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_value_here
```

**Don't commit this! It's in .gitignore ✓**

---

## 🎮 Using Auth in Components

```javascript
import { useAuth } from "../context/AuthContext";

export default function MyComponent() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  return <Text>{user?.email}</Text>;
}
```

---

## 📱 Main Auth Screens

| Screen         | Path              | Purpose               |
| -------------- | ----------------- | --------------------- |
| Login          | `/Login`          | Sign in to account    |
| Sign Up        | `/SignUp`         | Create new account    |
| Password Reset | `/ForgotPassword` | Recover account       |
| Profile        | `/(tabs)/profile` | View profile & logout |

---

## 🔑 Auth Methods Available

### Sign Up

```javascript
import { createUserWithEmailAndPassword } from "firebase/auth";
await createUserWithEmailAndPassword(auth, email, password);
```

### Login

```javascript
import { signInWithEmailAndPassword } from "firebase/auth";
await signInWithEmailAndPassword(auth, email, password);
```

### Logout

```javascript
const { logout } = useAuth();
await logout();
```

### Reset Password

```javascript
import { sendPasswordResetEmail } from "firebase/auth";
await sendPasswordResetEmail(auth, email);
```

---

## ✅ Complete File Inventory

### Created Files ✨

- ✅ `config/firebaseConfig.js` - Firebase setup
- ✅ `context/AuthContext.js` - Auth state management
- ✅ `app/SignUp.js` - Sign up form
- ✅ `app/ForgotPassword.js` - Password reset form
- ✅ `app/(tabs)/profile.js` - Profile & logout
- ✅ `.env.local` - Credentials template

### Updated Files 📝

- ✅ `package.json` - Added firebase + expo-secure-store
- ✅ `app/_layout.js` - Added auth routing
- ✅ `app/Login.js` - Added Firebase logic
- ✅ `components/CustomButton.js` - Added disabled state

### Documentation 📚

- ✅ `AUTHENTICATION_SETUP.md` - Complete guide
- ✅ `AUTH_IMPLEMENTATION.md` - Technical details
- ✅ `FIREBASE_SETUP.md` - Firebase Console steps
- ✅ `IMPLEMENTATION_COMPLETE.md` - Full reference

---

## 🧪 Testing Checklist

- [ ] Dependencies installed
- [ ] Firebase project created
- [ ] `.env.local` configured
- [ ] Email auth enabled in Firebase
- [ ] App starts without errors
- [ ] Sign up → receive verification email
- [ ] Click email link → verify email
- [ ] Login → redirects to home
- [ ] Logout → redirects to login
- [ ] Password reset working
- [ ] Close & reopen app → still logged in

---

## 🐛 Common Issues

| Error                         | Fix                             |
| ----------------------------- | ------------------------------- |
| Cannot find module 'firebase' | Run `npm install`               |
| Firebase config not provided  | Check `.env.local` exists       |
| Email not received            | Check spam folder               |
| Too many requests             | Wait 15-20 minutes              |
| App crashes on start          | Verify `.env.local` credentials |

---

## 📞 Get Help

- **Firebase Docs**: https://firebase.google.com/docs/auth
- **See detailed guides**: `AUTHENTICATION_SETUP.md`
- **Troubleshooting**: `AUTH_IMPLEMENTATION.md`

---

## ⏱️ Time Estimates

- **Setup**: ~10 minutes
- **Testing**: ~30 minutes
- **First user**: Ready immediately!

**Total: From zero to working auth in ~40 minutes! 🎉**

---

## 🎯 Next Optional Enhancements

1. **Google Sign-In** - 30 min
2. **Apple Sign-In** - 30 min
3. **Biometric Login** - 45 min
4. **User Profile Firestore** - 1 hour
5. **Custom Claims/Roles** - 1 hour

---

## 💾 Key Reminders

✅ `.env.local` is in `.gitignore` - won't be committed  
✅ All tokens stored securely  
✅ Email verification required  
✅ Sessions persist across app restarts  
✅ Automatic logout on token expiry

---

**Ready? Start with Step 1 above! 🚀**
