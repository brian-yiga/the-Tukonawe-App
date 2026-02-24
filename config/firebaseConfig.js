import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyDbcg-CjmVzuvU0fpHetNg0BBUItnnSEvI",
  authDomain: "tukonawe-app.firebaseapp.com",
  projectId: "tukonawe-app",
  storageBucket: "tukonawe-app.firebasestorage.app",
  messagingSenderId: "967675739420",
  appId: "1:967675739420:web:8c5bae53bb91e63d784ed9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
