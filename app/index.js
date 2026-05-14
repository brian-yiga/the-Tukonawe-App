import { useRouter } from "expo-router";
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/theme";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/bgphoto.webp")}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={[styles.overlay, { backgroundColor: COLORS.overlay }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/GuestPreview")}
        >
          <Text style={styles.skipText}>PREVIEW</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.logoSection}>
            <Image
              source={require("../assets/images/logo-nobg.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>theCalmSpace</Text>
            <Text style={styles.subtitle}>Your Mental Health Companion</Text>
          </View>

          <View style={styles.buttonSection}>
            <CustomButton
              title="Log In"
              onPress={() => router.push("/Login")}
            />
            <CustomButton
              title="Sign Up"
              type="outline"
              onPress={() => router.push("/SignUp")}
            />
            <CustomButton
              title="Find A Professional"
              type="sos"
              onPress={() => router.push("/GuestPreview")}
            />
            <View style={styles.guestNote}>
              <Text style={styles.guestNoteText}>
                As a guest, you can preview one featured professional and try a
                quick check-in. Sign up for full access to all tools, resources,
                and the community.
              </Text>
            </View>
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                By tapping Sign Up/Log in you agree to the{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/TermsOfUse")}>
                <Text style={styles.disclaimerLink}>terms of use</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimerText}> and </Text>
              <TouchableOpacity onPress={() => router.push("/TermsOfUse")}>
                <Text style={styles.disclaimerLink}>privacy policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: { flex: 1, padding: 25, justifyContent: "space-between" },
  logoSection: { alignItems: "center", marginTop: 80 },
  logo: { width: 155, height: 155, marginBottom: 30 },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: 1,
  },
  subtitle: { color: COLORS.sageGreen, fontSize: 16, marginTop: 5 },
  buttonSection: { marginBottom: 30 },
  guestNote: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
  },
  guestNoteText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  skipButton: { position: "absolute", top: 50, right: 25, zIndex: 10 },
  skipText: { color: COLORS.sageGreen, fontSize: 14, fontWeight: "600" },
  disclaimerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  disclaimerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    textAlign: "center",
  },
  disclaimerLink: {
    color: COLORS.sageGreen,
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
