import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function CBTHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "cbt_records"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
      // You could optionally show an alert or set an error state here
    });

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>
          {item.createdAt?.toDate().toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </Text>
        <Ionicons name="checkmark-done-circle" size={20} color={COLORS.sageGreen} />
      </View>
      
      <Text style={styles.sectionLabel}>Situation</Text>
      <Text style={styles.contentText} numberOfLines={2}>{item.situation}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.sectionLabel}>Balanced Perspective</Text>
      <Text style={styles.balancedText}>{item.balancedThought}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.sageGreen} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Review your progress in challenging thoughts.</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.sageGreen} size="large" style={{ marginTop: 50 }} />
        ) : records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>No records found yet.</Text>
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { marginLeft: 8, color: COLORS.sageGreen, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "600", color: COLORS.brownish, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase" },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.sageGreen, marginBottom: 4 },
  contentText: { fontSize: 14, color: COLORS.textDark, marginBottom: 10, lineHeight: 20 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 10 },
  balancedText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontStyle: "italic",
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: COLORS.textMuted,
    fontSize: 16,
  },
});