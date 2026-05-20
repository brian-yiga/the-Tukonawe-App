import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (!logout) {
      Alert.alert("Logout unavailable");
      return;
    }
    Alert.alert(
      "Log Out",
      "Do you want to log out and return to the welcome screen?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/Welcome");
            } catch (error) {
              Alert.alert("Error", "Unable to log out right now.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.mainTextColor,
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.warmNeutral,
            borderTopWidth: 1,
            borderTopColor: "#E0E0E0",
            height: 65,
            paddingBottom: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: "Tools",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="forum"
          options={{
            title: "Community",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="professional"
          options={{
            title: "Professional",
            tabBarIcon: ({ color }) => (
              <Ionicons name="medical-outline" size={24} color={color} />
            ),
          }}
        />

        {/* Hide internal screens from tab bar if necessary */}
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="mood-tracker" options={{ href: null }} />
        <Tabs.Screen name="journal" options={{ href: null }} />
        <Tabs.Screen name="cbt-record" options={{ href: null }} />
        <Tabs.Screen name="cbt-history" options={{ href: null }} />
        <Tabs.Screen name="resource-detail" options={{ href: null }} />
      </Tabs>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoutIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    padding: 10,
    backgroundColor: COLORS.warmNeutral,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 20,
  },
});
