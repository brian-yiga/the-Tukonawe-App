import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { auth, db } from "../config/firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadingTimeout;
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);

          // Fetch user role from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
              setRole(userDoc.data().role);
            }
          } catch (roleError) {
            console.warn("Could not fetch user role:", roleError);
          }

          // Store the user's ID token for future use
          const token = await currentUser.getIdToken();
          if (Platform.OS === "web") {
            localStorage.setItem("userToken", token);
          } else {
            await SecureStore.setItemAsync("userToken", token);
          }
        } else {
          // User is logged out
          setUser(null);
          setRole(null);
          if (Platform.OS === "web") {
            localStorage.removeItem("userToken");
          } else {
            await SecureStore.deleteItemAsync("userToken").catch(() => {});
          }
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    });

    // Timeout: if auth doesn't resolve in 5 seconds, stop loading anyway
    loadingTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        console.warn("Auth check timed out, proceeding without verification");
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      if (Platform.OS === "web") {
        localStorage.removeItem("userToken");
      } else {
        await SecureStore.deleteItemAsync("userToken").catch(() => {});
      }
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    role,
    logout,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
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
