import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { COLORS } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SavedResourcesProvider } from "../context/SavedResourcesContext";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle Redirection Logic
  useEffect(() => {
    if (loading) return;

    const tabRoutes = [
      "home",
      "tools",
      "forum",
      "professional",
      "profile",
      "mood-tracker",
      "journal",
      "cbt-record",
      "cbt-history",
      "resource-detail",
    ];
    const inAuthGroup = segments.some((segment) => tabRoutes.includes(segment));

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to Login if trying to access tabs while logged out
      router.replace("/Login");
    } else if (isAuthenticated && !inAuthGroup) {
      // Redirect to Home if logged in and trying to access landing/login
      router.replace("/home");
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return null; // Returning null prevents the "Layout children" warning during initial auth check
  }

  // Note: All children of <Stack> must be <Stack.Screen> components.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgGreen },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="Login" options={{ animationEnabled: false }} />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="GuestPreview" />
      <Stack.Screen name="Welcome" options={{ title: "theCalmSpace" }} />
      <Stack.Screen name="Goals" />
      <Stack.Screen name="ForgotPassword" />
      <Stack.Screen name="(tabs)" options={{ animationEnabled: false }} />
      <Stack.Screen name="TermsOfUse" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedResourcesProvider>
        <RootLayoutNav />
      </SavedResourcesProvider>
    </AuthProvider>
  );
}
