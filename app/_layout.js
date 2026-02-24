import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/colors";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.mainColor} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
      initialRouteName={isAuthenticated ? "(tabs)" : "Login"}
    >
      {!isAuthenticated && (
        <>
          <Stack.Screen name="Login" options={{ animationEnabled: false }} />
          <Stack.Screen name="SignUp" />
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
