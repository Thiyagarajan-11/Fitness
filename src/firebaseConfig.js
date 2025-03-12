// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Removed updateProfile
import { getFirestore } from "firebase/firestore"; // Firestore
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD97Y4uAMewCnD09irB1RKHU1OJCbz_gLI",
  authDomain: "login-7b8e3.firebaseapp.com",
  projectId: "login-7b8e3",
  storageBucket: "login-7b8e3.appspot.com", // Optional: Keep if you might use it later
  messagingSenderId: "289402986277",
  appId: "1:289402986277:web:9e18775f5d17fbeb54c4cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Export only what's needed
export { auth, db };