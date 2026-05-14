import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function TabLayout() {
  const [isFabModalVisible, setFabModalVisible] = useState(false);
  const router = useRouter();

  const handleQuickAction = (actionType) => {
    setFabModalVisible(false);
    if (actionType === "mood") {
      router.push("/(tabs)/mood-tracker");
    } else if (actionType === "thought") {
      router.push("/(tabs)/cbt-record");
    }
  };

  const CustomFabButton = ({ children, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.fabContainer}
      activeOpacity={0.8}
    >
      <View style={styles.fabInner}>{children}</View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.sageGreen,
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

        {/* Hidden screen/trigger for the FAB */}
        <Tabs.Screen
          name="fab-placeholder"
          options={{
            title: "",
            tabBarButton: (props) => (
              <CustomFabButton
                {...props}
                onPress={() => setFabModalVisible(true)}
              >
                <Ionicons name="add" size={32} color="white" />
              </CustomFabButton>
            ),
          }}
        />

        <Tabs.Screen
          name="forum"
          options={{
            title: "Forum",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="professional"
          options={{
            title: "Pro",
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

      <Modal
        visible={isFabModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFabModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFabModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quick Actions</Text>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleQuickAction("mood")}
            >
              <Ionicons
                name="happy-outline"
                size={24}
                color={COLORS.sageGreen}
              />
              <Text style={styles.actionText}>Log Mood</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleQuickAction("thought")}
            >
              <Ionicons
                name="journal-outline"
                size={24}
                color={COLORS.sageGreen}
              />
              <Text style={styles.actionText}>Thought Record</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.sageGreen,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: COLORS.textDark,
  },
});
