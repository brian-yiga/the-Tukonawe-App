import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
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
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const journalHero = require("../../assets/images/journalBg.jpg");

export default function JournalScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [entry, setEntry] = useState("");
  const [image, setImage] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [quote, setQuote] = useState({
    text: "Write to be free.",
    author: "Reflection",
  });
  const [scripture, setScripture] = useState({ text: "Loading...", ref: "" });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInspiration();
    if (user?.uid) {
      const q = query(
        collection(db, "journalEntries"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(entries);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const fetchInspiration = async () => {
    try {
      const qRes = await fetch("https://zenquotes.io/api/today");
      const qData = await qRes.json();
      setQuote({ text: qData[0].q, author: qData[0].a });

      const sRes = await fetch("https://bible-api.com/philippians+4:8");
      const sData = await sRes.json();
      setScripture({ text: sData.text.trim(), ref: sData.reference });
    } catch (e) {
      console.log("Error fetching inspiration:", e);
    }
  };

  const handlePickImage = async () => {
    if (Platform.OS === "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
      return;
    }
    Alert.alert("Attach Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission to access camera is required!");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission to access gallery is required!");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      if (Platform.OS === "web") {
        alert(
          "Location permission is required to attach location. Please check your browser settings.",
        );
        return;
      }
      Alert.alert(
        "Permission denied",
        "Location permission is required to attach location. Would you like to open settings?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (address.length > 0) {
      const currentLoc = `${address[0].city || ""}, ${address[0].region || ""}`;
      setLocationData(currentLoc);
    } else {
      setLocationData(
        `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`,
      );
    }
  };

  const handleSaveEntry = async () => {
    if (!entry.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "journalEntries"), {
        userId: user.uid,
        content: entry,
        createdAt: serverTimestamp(),
        image: image,
        location: locationData,
      });
      setEntry("");
      setImage(null);
      setLocationData(null);
      Alert.alert("Saved", "Your thoughts are safely stored.");
    } catch (e) {
      Alert.alert("Error", "Could not save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.push("/tools")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.sageGreen} />
          <Text style={styles.backText}>Back to Tools</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Mindful Journal</Text>
        <Text style={styles.importanceText}>
          Journaling helps clarify your thoughts, reduces stress, and allows you
          to track your personal growth over time.
        </Text>

        <ImageBackground
          source={journalHero}
          style={styles.heroBanner}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              A softer place for your thoughts
            </Text>
            <Text style={styles.heroSubtitle}>
              Warm reflections and mindful moments in each entry.
            </Text>
          </View>
        </ImageBackground>

        {/* Inspirational Quote Card */}
        <View style={styles.quoteCard}>
          <Ionicons
            name="quote"
            size={24}
            color="white"
            style={{ opacity: 0.3 }}
          />
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>

        {/* Entry Input Area */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind today?"
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={entry}
            onChangeText={setEntry}
          />

          {image && <Image source={{ uri: image }} style={styles.entryImage} />}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={handlePickImage}
            >
              <Ionicons
                name={image ? "image" : "image-outline"}
                size={22}
                color={image ? COLORS.mutedBlue : COLORS.sageGreen}
              />
              <Text
                style={[
                  styles.attachText,
                  image && { color: COLORS.mutedBlue },
                ]}
              >
                {image ? "Attached" : "Photo"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={handleGetLocation}
            >
              <Ionicons
                name={locationData ? "location" : "location-outline"}
                size={22}
                color={locationData ? COLORS.mutedBlue : COLORS.sageGreen}
              />
              <Text
                style={[
                  styles.attachText,
                  locationData && { color: COLORS.mutedBlue },
                ]}
              >
                {locationData ? "Pinned" : "Location"}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSaveEntry}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Last 10 Journals */}
        <Text style={styles.sectionTitle}>Recent Reflections</Text>
        {loading ? (
          <ActivityIndicator
            color={COLORS.sageGreen}
            style={{ marginVertical: 20 }}
          />
        ) : history.length === 0 ? (
          <Text style={styles.emptyText}>
            No entries yet. Start your journey today.
          </Text>
        ) : (
          <View>
            {history.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyCard}
                onPress={() => {
                  if (Platform.OS === "web") {
                    const wantToDelete = window.confirm(
                      "Do you want to delete this entry? (OK to Delete, Cancel to Edit)",
                    );
                    if (wantToDelete) {
                      deleteDoc(doc(db, "journalEntries", item.id))
                        .then(() => alert("Deleted successfully."))
                        .catch(() => alert("Failed to delete."));
                    } else {
                      // On web, if they hit cancel on the delete prompt, we treat it as an edit request
                      const wantToEdit = window.confirm(
                        "Would you like to edit this entry into the input box above?",
                      );
                      if (wantToEdit) {
                        setEntry(item.content || "");
                        setImage(item.image || null);
                        setLocationData(item.location || null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }
                    return;
                  }
                  Alert.alert("Entry Options", "What would you like to do?", [
                    {
                      text: "Edit",
                      onPress: () => {
                        setEntry(item.content || "");
                        setImage(item.image || null);
                        setLocationData(item.location || null);
                      },
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await deleteDoc(doc(db, "journalEntries", item.id));
                          Alert.alert("Deleted", "Entry deleted successfully.");
                        } catch (error) {
                          Alert.alert("Error", "Failed to delete entry.");
                        }
                      },
                    },
                    { text: "Cancel", style: "cancel" },
                  ]);
                }}
              >
                <Text style={styles.historyDate}>
                  {item.createdAt?.toDate().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.historyImage}
                    blurRadius={1}
                  />
                )}
                <Text style={styles.historyContent} numberOfLines={3}>
                  {item.content}
                </Text>
                {item.location && (
                  <Text style={styles.historyLocation}>📍 {item.location}</Text>
                )}
              </TouchableOpacity>
            ))}
            {history.length === 10 && (
              <TouchableOpacity style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Daily Scripture Section */}
        <View
          style={[styles.card, { marginTop: 20, backgroundColor: "#F0F4EF" }]}
        >
          <Text style={styles.scriptureHeader}>Scripture for your Soul</Text>
          <Text style={styles.scriptureText}>"{scripture.text}"</Text>
          <Text style={styles.scriptureRef}>{scripture.ref}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { marginLeft: 8, color: COLORS.sageGreen, fontWeight: "600" },
  mainTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 8,
  },
  importanceText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 20,
  },
  heroBanner: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 160,
    justifyContent: "flex-end",
  },
  heroImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    opacity: 0.95,
  },
  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.22)",
    padding: 18,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 20,
  },
  quoteCard: {
    backgroundColor: COLORS.sageGreen,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  quoteText: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  quoteAuthor: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    minHeight: 120,
    fontSize: 16,
    color: COLORS.textDark,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  entryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionRow: { flexDirection: "row", alignItems: "center" },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 10,
  },
  attachText: { marginLeft: 5, fontSize: 12, color: COLORS.textMuted },
  saveBtn: {
    backgroundColor: COLORS.sageGreen,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: { color: "white", fontWeight: "700" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.sageGreen,
  },
  historyDate: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  historyContent: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 5,
  },
  historyLocation: { fontSize: 12, color: COLORS.textMuted, marginTop: 5 },
  emptyText: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginVertical: 20,
    fontStyle: "italic",
  },
  readMoreBtn: { alignSelf: "center", padding: 10 },
  readMoreText: {
    color: COLORS.sageGreen,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  scriptureHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.sageGreen,
    marginBottom: 8,
    textAlign: "center",
  },
  scriptureText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  scriptureRef: {
    textAlign: "right",
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 10,
    fontWeight: "600",
  },
});
