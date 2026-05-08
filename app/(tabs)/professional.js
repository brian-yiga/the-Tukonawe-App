import { Ionicons } from "@expo/vector-icons";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";

export default function ProfessionalScreen() {
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Professional Support</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#AAA" />
          <Text style={styles.searchText}>Find a specialist...</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Directory of mental health professionals will appear here.
          </Text>
        </View>

        <TouchableOpacity style={styles.crisisButton}>
          <Text style={styles.crisisText}>GET HELP NOW (CRISIS)</Text>
        </TouchableOpacity>
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
  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  searchText: { color: "#AAA", marginLeft: 8 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#AAA", textAlign: "center" },
  crisisButton: {
    backgroundColor: "#E63946",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  crisisText: { color: "white", fontWeight: "700" },
});
