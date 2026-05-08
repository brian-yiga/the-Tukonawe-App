import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { auth } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(auth);
            router.replace("/");
          } catch (error) {
            Alert.alert("Error", "Failed to log out.");
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Profile</Text>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.[0]?.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.emailLabel}>Email Account</Text>
            <Text style={styles.emailValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <CustomButton
          title={loading ? "Logging Out..." : "Log Out"}
          onPress={handleLogout}
          disabled={loading}
          type="sos"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24 },
  backButton: { marginBottom: 20, marginTop: 20 },
  backText: { color: COLORS.sageGreen, fontSize: 16, fontWeight: "600" },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.sageGreen,
    marginBottom: 24,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.sageGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { color: "white", fontSize: 24, fontWeight: "700" },
  emailLabel: { fontSize: 12, color: "#AAA", textTransform: "uppercase" },
  emailValue: { fontSize: 16, color: "#444", fontWeight: "500" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    color: "#AAA",
    textTransform: "uppercase",
    marginBottom: 12,
    fontWeight: "600",
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuText: { fontSize: 16, color: "#444" },
  spacer: { flex: 1 },
});
