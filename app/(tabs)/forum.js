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
  const { user } = useAuth();
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>Community</Text>

        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
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
            )}
            style={styles.tabBar}
          />
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
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.sageGreen,
    marginTop: 40,
    marginBottom: 20,
  },
  tabBar: { marginBottom: 15, maxHeight: 40 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeTab: {
    backgroundColor: COLORS.sageGreen,
    borderColor: COLORS.sageGreen,
  },
  tabText: { fontSize: 14, color: COLORS.textMuted },
  activeTabText: { color: "white", fontWeight: "600" },
  listContent: { paddingBottom: 100 },
  postCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  postAuthor: { fontWeight: "700", color: COLORS.sageGreen, fontSize: 13 },
  postTime: { color: COLORS.textMuted, fontSize: 11 },
  postContent: { fontSize: 15, color: COLORS.textDark, lineHeight: 22 },
  postActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
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
