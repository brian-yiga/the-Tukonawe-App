import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            router.replace("/Login");
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bgphoto.webp")}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.userCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.email?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>
                {user?.emailVerified
                  ? "✓ Email Verified"
                  : "! Email Not Verified"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Change Password</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Privacy</Text>
              <Text style={styles.menuArrow}>›</Text>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  title: {
    color: COLORS.mainColor,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.mainColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { color: "white", fontSize: 24, fontWeight: "700" },
  userInfo: { flex: 1 },
  userEmail: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  userStatus: { color: COLORS.secondaryColor, fontSize: 12 },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: { color: "white", fontSize: 14, fontWeight: "500" },
  menuArrow: { color: "rgba(255, 255, 255, 0.4)", fontSize: 18 },
  spacer: { flex: 1 },
});
