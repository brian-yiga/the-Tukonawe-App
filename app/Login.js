import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ImageBackground,
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Navigation to home page - user stays logged in via Firebase auth
      router.replace("/(tabs)/home");
    } catch (err) {
      let errorMessage = "Login failed";
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bgphoto.webp")}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Log In</Text>
            <View style={{ width: 50 }} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
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

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              onPress={() => router.push("/ForgotPassword")}
              style={{ alignSelf: "flex-end", marginTop: 8 }}
            >
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>

            <CustomButton
              title={loading ? "Logging In..." : "Log In"}
              onPress={handleLogin}
              disabled={loading}
            />

            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/SignUp")}>
                <Text
                  style={[
                    styles.signUpText,
                    { color: COLORS.sageGreen, fontWeight: "600" },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/TermsOfUse")}
              style={{ marginTop: 16 }}
            >
              <Text style={styles.smallLink}>Terms & Privacy</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: { color: COLORS.sageGreen, fontSize: 16, fontWeight: "600" },
  headerTitle: { color: COLORS.warmNeutral, fontSize: 24, fontWeight: "500" },
  form: { marginTop: 120 },
  label: { color: "rgba(255,255,255,0.95)", fontSize: 14, marginBottom: 10 },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    color: "white",
    marginBottom: 14,
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  smallLink: {
    color: COLORS.sageGreen,
    fontSize: 12,
    textAlign: "center",
  },
  forgotLink: {
    color: COLORS.sageGreen,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 20,
  },
  signUpPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
});
