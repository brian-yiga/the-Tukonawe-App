import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function ForumScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgGreen }}>
      <View style={styles.container}>
        <Text style={styles.header}>Community</Text>
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>General</Text>
          <Text style={styles.tab}>Anxiety</Text>
          <Text style={styles.tab}>Wins</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Join the conversation with others.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24 },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.sageGreen,
    marginTop: 40,
    marginBottom: 20,
  },
  tabContainer: { flexDirection: "row", marginBottom: 20 },
  tab: { marginRight: 20, fontSize: 16, color: COLORS.textMuted },
  activeTab: {
    color: COLORS.sageGreen,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.sageGreen,
  },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { color: COLORS.textMuted },
});
