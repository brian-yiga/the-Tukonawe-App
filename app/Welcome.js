import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/theme";

export default function Welcome() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/Goals");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>Welcome to theCalmSpace</Text>
          <Text style={styles.welcomeSubtitle}>Your Journey Starts Here</Text>

          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              theCalmSpace is your personal mental health companion designed to
              create calm spaces in your life.
            </Text>
            <Text style={styles.messageText}>
              Whether you're facing stress, anxiety, or just need a moment of
              peace, our app provides tools and resources to help you find
              tranquility and support.
            </Text>
            <Text style={styles.messageText}>
              We're here to help you navigate your emotional wellness journey
              with personalized guidance and a caring community.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="I Agree and Want to Continue"
              onPress={handleContinue}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  welcomeTitle: {
    color: COLORS.textDark,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    color: COLORS.sageGreen,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 40,
  },
  messageText: {
    color: COLORS.textDark,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});
