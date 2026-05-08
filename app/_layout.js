import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { COLORS } from "../constants/theme";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.bgGreen,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.sageGreen} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgGreen },
      }}
      initialRouteName={isAuthenticated ? "(tabs)/home" : "Login"}
    >
      {!isAuthenticated && (
        <>
          <Stack.Screen name="index" options={{ title: "Welcome" }} />
          <Stack.Screen name="Login" options={{ animationEnabled: false }} />
          <Stack.Screen name="SignUp" />
          <Stack.Screen name="Welcome" options={{ title: "theCalmSpace" }} />
          <Stack.Screen name="Goals" />
          <Stack.Screen name="ForgotPassword" />
        </>
      )}
      {isAuthenticated && (
        <Stack.Screen name="(tabs)" options={{ animationEnabled: false }} />
      )}
      <Stack.Screen name="TermsOfUse" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
