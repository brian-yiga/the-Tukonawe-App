import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Alert,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/theme";
import professionals from "../data/professionals";

const featured = professionals[0];
const CHECK_IN_MESSAGE = "Hi, I would like a quick 5-minute check-in.";
const WHATSAPP_NUMBER = "+2560709203470";

async function openWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${phone}&text=${encoded}`;
  const webUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encoded}`;

  try {
    if (Platform.OS === 'web') {
      return Linking.openURL(webUrl);
    }
    const supported = await Linking.canOpenURL(appUrl);
    return supported ? Linking.openURL(appUrl) : Linking.openURL(webUrl);
  } catch (error) {
    Alert.alert(
      "Unable to open WhatsApp",
      "Please ensure WhatsApp is installed or try again later.",
    );
  }
}

export default function GuestPreview() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Guest Preview</Text>
          <Text style={styles.subtitle}>
            See one featured professional and try a quick check-in before you
            create an account.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureLabel}>Featured Professional</Text>
          <View style={styles.profileCard}>
            <Image source={featured.image} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{featured.name}</Text>
              <Text style={styles.profileRole}>{featured.profession}</Text>
              <Text style={styles.profileField}>{featured.field}</Text>
            </View>
          </View>
          <Text style={styles.profileBio}>{featured.bio}</Text>
          <View style={styles.buttonRow}>
            <CustomButton
              title="View More"
              onPress={() => router.push("/Login")}
            />
            <CustomButton
              title="Sign Up"
              type="outline"
              onPress={() => router.push("/SignUp")}
            />
          </View>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Quick Guest Action</Text>
          <Text style={styles.sectionText}>
            Non-logged in users can preview this featured professional and send
            a quick check-in message.
          </Text>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => openWhatsApp(WHATSAPP_NUMBER, CHECK_IN_MESSAGE)}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.whatsappText}>5-Minute Check-In</Text>
          </TouchableOpacity>
          <Text style={styles.noteText}>
            For full access to the community, journal history, and more
            professionals, please log in or sign up.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.sageGreen,
    marginBottom: 8,
  },
  subtitle: { color: COLORS.textMuted, fontSize: 15, lineHeight: 22 },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  featureLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 12,
    fontWeight: "600",
  },
  profileCard: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: { width: 68, height: 68, borderRadius: 16, marginRight: 14 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "700", color: COLORS.textDark },
  profileRole: { fontSize: 14, color: COLORS.sageGreen, marginTop: 4 },
  profileField: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  profileBio: {
    color: COLORS.textDark,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  sectionText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 10,
  },
  whatsappText: { color: "white", fontSize: 15, fontWeight: "700" },
  noteText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 16,
    lineHeight: 20,
  },
});
