import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // User is logged in
          setUser(currentUser);
          // Store the user's ID token for future use
          const token = await currentUser.getIdToken();
          await SecureStore.setItemAsync("userToken", token);
        } else {
          // User is logged out
          setUser(null);
          await SecureStore.deleteItemAsync("userToken").catch(() => {});
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("userToken").catch(() => {});
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
