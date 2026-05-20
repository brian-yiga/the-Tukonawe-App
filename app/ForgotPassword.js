import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { auth } from "../config/firebaseConfig";
import { COLORS } from "../constants/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      if (Platform.OS === 'web') {
        alert("Check Your Email: We've sent a password reset link to your email. Please check your inbox.");
        router.push("/Login");
        return;
      }
      Alert.alert(
        "Check Your Email",
        "We've sent a password reset link to your email. Please check your inbox.",
        [
          {
            text: "OK",
            onPress: () => router.push("/Login"),
          },
        ],
      );
    } catch (err) {
      let errorMessage = "Failed to send reset email";
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 50 }} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.form}>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={"rgba(255,255,255,0.5)"}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <CustomButton
            title={loading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            disabled={loading}
          />

          <TouchableOpacity
            onPress={() => router.push("/Login")}
            style={{ marginTop: 16 }}
          >
            <Text style={styles.backToLogin}>Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: { color: COLORS.sageGreen, fontSize: 16, fontWeight: "600" },
  headerTitle: { color: COLORS.warmNeutral, fontSize: 20, fontWeight: "300" },
  form: { marginTop: 150 },
  description: {
    color: COLORS.textDark,
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  label: { color: COLORS.textDark, fontSize: 14, marginBottom: 10 },
  input: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    color: COLORS.textDark,
    marginBottom: 20,
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  backToLogin: {
    color: COLORS.sageGreen,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
