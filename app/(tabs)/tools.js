import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";

const TOOLS = [
  {
    id: "1",
    title: "Mood Tracker",
    icon: "sunny-outline",
    color: "#E9EDC9",
    progress: "1/1",
    achieved: true,
  },
  {
    id: "2",
    title: "Journal",
    icon: "create-outline",
    color: "#CCD5AE",
    progress: "0/1",
    achieved: false,
  },
  {
    id: "3",
    title: "Thought Process",
    icon: "brain-outline",
    color: "#D4A373",
    progress: "New",
    achieved: false,
  },
  {
    id: "4",
    title: "Meditation",
    icon: "leaf-outline",
    color: "#FAEDCD",
    progress: "10m",
    achieved: true,
  },
];

const RESOURCE_TABS = [
  { id: "meditation", label: "Meditation" },
  { id: "work", label: "At Work" },
  { id: "sleep", label: "Better Sleep" },
  { id: "depression", label: "Depression" },
  { id: "anxiety", label: "Anxiety" },
];

const MOCK_RESOURCES = {
  meditation: [
    { id: "m1", title: "5-Minute Morning Reset", duration: "5 min" },
    { id: "m2", title: "Deep Breathing Basics", duration: "3 min" },
  ],
  work: [
    { id: "w1", title: "Handling Deadline Stress", type: "Article" },
    { id: "w2", title: "Desk Yoga for Focus", type: "Video" },
  ],
  sleep: [
    { id: "s1", title: "Unwinding Your Mind", duration: "15 min" },
    { id: "s2", title: "White Noise: Rain Forest", duration: "Infinite" },
  ],
  depression: [
    { id: "d1", title: "Finding Small Wins Today", type: "Guide" },
    { id: "d2", title: "The Power of Routine", type: "Article" },
  ],
  anxiety: [
    { id: "a1", title: "Grounding Technique (5-4-3-2-1)", type: "Exercise" },
    { id: "a2", title: "Quietening Social Anxiety", type: "Audio" },
  ],
};

export default function ToolsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("meditation");

  const handleToolPress = (toolId) => {
    if (toolId === "1") {
      router.push("/(tabs)/mood-tracker");
    } else if (toolId === "2") {
      router.push("/(tabs)/journal");
    } else if (toolId === "3") {
      router.push("/(tabs)/cbt-record");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Calm Corner</Text>
        <Text style={styles.subtitle}>Daily grounding and growth.</Text>

        <Text style={styles.categoryTitle}>Daily Tools</Text>
        <View style={styles.toolsGrid}>
          {TOOLS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.toolCard}
              activeOpacity={0.7}
              onPress={() => handleToolPress(item.id)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon} size={28} color="#444" />
              </View>
              <Text style={styles.toolTitle}>{item.title}</Text>

              <View style={styles.progressRow}>
                <Text style={styles.progressText}>{item.progress}</Text>
                {item.achieved && (
                  <Ionicons
                    name="star"
                    size={14}
                    color="#FFD700"
                    style={styles.starIcon}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.categoryTitle, { marginTop: 10 }]}>Resources</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {RESOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.activeTabItem,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resourceList}>
          {MOCK_RESOURCES[activeTab].map((resource) => (
            <TouchableOpacity key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceMeta}>
                  {resource.duration || resource.type}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.sageGreen,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
    marginTop: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toolCard: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: { fontSize: 11, fontWeight: "700", color: COLORS.textMuted },
  starIcon: { marginLeft: 4 },

  // Tab Bar Styles
  tabBar: { marginBottom: 16 },
  tabBarContent: { paddingRight: 20 },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeTabItem: {
    backgroundColor: COLORS.sageGreen,
    borderColor: COLORS.sageGreen,
  },
  tabLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: "500" },
  activeTabLabel: { color: "white", fontWeight: "600" },

  // Resource Card Styles
  resourceList: { marginBottom: 20 },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  resourceInfo: { flex: 1 },
  resourceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  resourceMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
