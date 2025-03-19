// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the AuthContext type
type AuthContextType = {
  user: any; // Firebase user object
  userData: any; // Additional user data (name, age, height, weight)
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, age: string, height: string, weight: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
};

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null); // Additional user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem("user", JSON.stringify(firebaseUser));
        await fetchUserData(); // Fetch user data on login
      } else {
        setUser(null);
        setUserData(null);
        await AsyncStorage.removeItem("user");
      }
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const register = async (name: string, age: string, height: string, weight: string, email: string, password: string) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save additional user data in Firestore
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        email,
      });

      // Fetch user data after registration
      await fetchUserData();
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          console.log("Fetched user data:", userDoc.data()); // Debugging
          setUserData(userDoc.data());
        } else {
          console.log("User document does not exist."); // Debugging
        }
      } catch (error) {
        console.error("Error fetching user data:", error); // Debugging
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, login, register, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};