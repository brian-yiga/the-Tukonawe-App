import { Ionicons } from "@expo/vector-icons";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["General", "Anxiety", "Depression", "Wins"];

export default function ForumScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("General");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "forum_posts"),
      where("category", "==", activeTab),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleLogout = () => {
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
              router.replace("/");
            } catch (error) {
              Alert.alert("Error", "Unable to log out right now.");
            }
          },
        },
      ],
    );
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "forum_posts"), {
        userId: user.uid,
        authorName: user.email.split("@")[0],
        content: newPost,
        category: activeTab,
        createdAt: serverTimestamp(),
        reports: 0,
      });
      setNewPost("");
    } catch (error) {
      Alert.alert("Error", "Could not share your post.");
    } finally {
      setPosting(false);
    }
  };

  const handleReport = (postId) => {
    Alert.alert("Report Post", "Is this post harmful or inappropriate?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        onPress: () =>
          Alert.alert("Thank you", "Our moderators will review this."),
      },
    ]);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postAuthor}>@{item.authorName}</Text>
        <Text style={styles.postTime}>
          {item.createdAt?.toDate().toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <TouchableOpacity
        style={styles.reportBtn}
        onPress={() => handleReport(item.id)}
      >
        <Ionicons name="flag-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.reportText}>Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: "#E8F7EF" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerBar}>
            <Text style={styles.header}>Community</Text>
            <Text style={styles.subHeader}>
              A supportive space for honest check-ins and gentle encouragement.
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Community Guidelines</Text>
          <Text style={styles.ruleItem}>
            • Be respectful and kind to everyone.
          </Text>
          <Text style={styles.ruleItem}>
            • Share support, not medical or legal advice.
          </Text>
          <Text style={styles.ruleItem}>
            • No hate speech, bullying, or abusive language.
          </Text>
          <Text style={styles.ruleItem}>
            • Do not post private contact details or personal data.
          </Text>
        </View>

        <View style={styles.tabBarRow}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveTab(item)}
              style={[styles.tab, activeTab === item && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.sageGreen} style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No posts yet. Be the first to share!
              </Text>
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Share something with ${activeTab}...`}
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !newPost.trim() && { opacity: 0.5 }]}
            onPress={handleCreatePost}
            disabled={posting || !newPost.trim()}
          >
            {posting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 120 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 12,
  },
  headerBar: {
    flex: 1,
    backgroundColor: "#075E54",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 6,
  },
  subHeader: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
  rulesCard: {
    backgroundColor: "#F3FFF7",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C8F0DF",
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.sageGreen,
    marginBottom: 10,
  },
  ruleItem: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 6,
    lineHeight: 20,
  },
  tabBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8F1EE",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#25D366",
    borderColor: "#25D366",
  },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "600" },
  activeTabText: { color: "white" },
  logoutIcon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginLeft: 12,
    backgroundColor: COLORS.warmNeutral,
    borderRadius: 16,
  },
  listContent: { paddingBottom: 180 },
  postCard: {
    backgroundColor: "#F8FFF8",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#25D366",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  postAuthor: { fontWeight: "700", color: COLORS.sageGreen, fontSize: 13 },
  postTime: { color: COLORS.textMuted, fontSize: 11 },
  postContent: { fontSize: 15, color: COLORS.textDark, lineHeight: 22 },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", marginLeft: 15 },
  actionText: { fontSize: 11, color: COLORS.textMuted, marginLeft: 4 },
  inputContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: { flex: 1, maxHeight: 100, fontSize: 14, color: COLORS.textDark },
  sendBtn: {
    backgroundColor: COLORS.sageGreen,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  emptyText: { textAlign: "center", color: COLORS.textMuted, marginTop: 50 },
});
