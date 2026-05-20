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
import { useEffect, useRef, useState } from "react";
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
  useWindowDimensions,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import YoutubePlayer from "react-native-youtube-iframe"; // For web compatibility, also run: npx expo install react-native-web-webview react-native-webview
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { moodToValue } from "../../utils/moodUtils";

const COMMON_WHATSAPP_NUMBER = "+2560709203470";

async function openWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${phone}&text=${encoded}`;
  const webUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encoded}`;

  try {
    if (Platform.OS === "web") {
      return Linking.openURL(webUrl);
    }
    const supported = await Linking.canOpenURL(appUrl);
    return supported ? Linking.openURL(appUrl) : Linking.openURL(webUrl);
  } catch (error) {
    Alert.alert(
      "Unable to open WhatsApp",
      "Please ensure WhatsApp is installed or try again later.",
    );
  }
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const firstName = user?.email?.split("@")[0] || "Friend";
  const [quote, setQuote] = useState({
    text: "Tranquility comes from within.",
    author: "Reflection",
  });
  const [scripture, setScripture] = useState({
    text: "Loading word...",
    ref: "",
  });
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [loadingScripture, setLoadingScripture] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");
  const moodInputRef = useRef(null);
  const [moodReason, setMoodReason] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [journalImage, setJournalImage] = useState(null);
  const [journalLocation, setJournalLocation] = useState(null);
  const [chartData, setChartData] = useState([3, 3, 3, 3, 3, 3, 3]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [lastEntry, setLastEntry] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleCheckIn = () => {
    openWhatsApp(
      COMMON_WHATSAPP_NUMBER,
      "Hi, I would like a 5-minute check-in.",
    );
  };

  const handlePlayMusic = () => {
    setMusicPlaying((prev) => !prev);
  };

  const moodIconName = (mood) => {
    if (mood === "happy") return "sunny-outline";
    if (mood === "calm") return "leaf-outline";
    if (mood === "sad") return "water-outline";
    if (mood === "angry") return "flame-outline";
    return "moon-outline";
  };

  const moodIconColor = (mood) => {
    if (mood === "happy") return "#F7D046";
    if (mood === "calm") return COLORS.sageGreen;
    if (mood === "sad") return "#64B5F6";
    if (mood === "angry") return "#E57373";
    return "#9575CD";
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTimeout(() => {
      moodInputRef.current?.focus();
    }, 50);
  };

  const handleLogMood = async () => {
    if (!selectedMood) {
      Alert.alert(
        "Choose a mood",
        "Please select how you're feeling before logging.",
      );
      return;
    }

    if (!moodReason.trim()) {
      Alert.alert(
        "Add a reason",
        "Please describe why you're feeling this way.",
      );
      return;
    }

    if (!user?.uid) {
      if (Platform.OS === "web") {
        alert("You must be logged in to save your mood.");
        return;
      }
      Alert.alert("Error", "You must be logged in to save your mood.");
      return;
    }

    try {
      await addDoc(collection(db, "mood_logs"), {
        userId: user.uid,
        mood: selectedMood,
        moodValue: moodToValue(selectedMood),
        reason: moodReason,
        createdAt: serverTimestamp(),
      });
      setMoodReason("");
      setSelectedMood("");
      if (Platform.OS === "web") {
        alert("Mood logged successfully!");
      } else {
        Alert.alert("Success", "Mood logged successfully!");
      }
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Failed to save mood. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save mood. Please try again.");
      }
      console.error("Error saving mood from Home:", error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Do you want to log out and return to the welcome screen?",
      );
      if (confirmed) {
        logout()
          .then(() => router.replace("/"))
          .catch(() => alert("Unable to log out."));
      }
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
              router.replace("/");
            } catch (error) {
              Alert.alert("Error", "Unable to log out right now.");
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    fetchQuote();
    fetchScripture();

    if (user?.uid) {
      const q = query(
        collection(db, "mood_logs"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(7),
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const moods = [];
        querySnapshot.forEach((doc) => {
          moods.push(doc.data().moodValue || 3);
        });

        if (moods.length > 0) {
          // Pad with default values if less than 7 logs exist, then reverse to show chronological order
          const filledMoods = [...moods, ...Array(7 - moods.length).fill(3)]
            .slice(0, 7)
            .reverse();
          setChartData(filledMoods);
        }
        setLoadingChart(false);
      });

      const journalQ = query(
        collection(db, "journalEntries"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1),
      );

      const unsubscribeJournal = onSnapshot(journalQ, (snapshot) => {
        if (!snapshot.empty) {
          setLastEntry({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id });
        } else {
          setLastEntry(null);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeJournal();
      };
    }
  }, []);

  const fetchQuote = async () => {
    try {
      // Using a public proxy-friendly API for daily quotes
      const response = await fetch("https://zenquotes.io/api/today");
      const data = await response.json();
      if (data && data[0]) {
        setQuote({ text: data[0].q, author: data[0].a });
      }
    } catch (error) {
      console.log("Error fetching quote:", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const fetchScripture = async () => {
    try {
      // Fetching a random encouraging verse
      const response = await fetch("https://bible-api.com/john+3:16"); // Example endpoint
      const data = await response.json();
      if (data) {
        setScripture({ text: data.text.trim(), ref: data.reference });
      }
    } catch (error) {
      setScripture({
        text: "Be still, and know that I am God.",
        ref: "Psalm 46:10",
      });
    } finally {
      setLoadingScripture(false);
    }
  };

  const handlePickImage = async () => {
    if (Platform.OS === "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) setJournalImage(result.assets[0].uri);
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
          if (!result.canceled) setJournalImage(result.assets[0].uri);
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
          if (!result.canceled) setJournalImage(result.assets[0].uri);
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
          "Location permission is required. Please check browser settings.",
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
      setJournalLocation(
        `${address[0].city || ""}, ${address[0].region || ""}`,
      );
    } else {
      setJournalLocation(
        `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`,
      );
    }
  };

  const handleSaveJournalEntry = async () => {
    if (!journalEntry.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }
    try {
      await addDoc(collection(db, "journalEntries"), {
        userId: user.uid,
        content: journalEntry,
        createdAt: serverTimestamp(),
        image: journalImage,
        location: journalLocation,
      });
      setJournalEntry("");
      setJournalImage(null);
      setJournalLocation(null);
      Alert.alert("Saved", "Your journal entry was saved successfully.");
    } catch (e) {
      Alert.alert("Error", "Could not save entry.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextGroup}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{firstName}</Text>
              <TouchableOpacity
                onPress={handlePlayMusic}
                style={styles.musicButton}
              >
                <Ionicons
                  name={musicPlaying ? "pause-circle" : "play-circle"}
                  size={26}
                  color={COLORS.sageGreen}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.findProfessionalBtn}
          onPress={() => router.push("/professional")}
        >
          <Text style={styles.findProfessionalBtnText}>
            Find A Professional
          </Text>
        </TouchableOpacity>

        <ImageBackground
          source={require("../../assets/images/homePageHeroBg.jpg")}
          style={styles.heroCard}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>A gentle path to balance</Text>
            <Text style={styles.heroSubtitle}>
              Explore daily support techniques with soothing imagery.
            </Text>
          </View>
        </ImageBackground>

        

        {musicPlaying && (
          <View style={styles.musicPanel}>
            <Text style={styles.musicLabel}>Soothing music is playing...</Text>
            <YoutubePlayer
              height={140}
              play={musicPlaying}
              videoId={"2OEL4P1Rz04"}
            />
          </View>
        )}

        {/* Interactive Mood Check-in */}
        <View style={styles.sectionCard}>
          <Text style={styles.feelingTitle}>How Are You Feeling Today?</Text>
          <View style={styles.moodRow}>
            {["happy", "calm", "sad", "angry", "tired"].map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodItem,
                  selectedMood === mood && {
                    borderColor: moodIconColor(mood),
                    borderWidth: 2,
                    borderRadius: 18,
                    padding: 8,
                  },
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <Ionicons
                  name={moodIconName(mood)}
                  size={32}
                  color={moodIconColor(mood)}
                />
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            ref={moodInputRef}
            style={styles.reasonInput}
            placeholder="What's making you feel this way?"
            placeholderTextColor={COLORS.textMuted}
            value={moodReason}
            onChangeText={setMoodReason}
            multiline
          />

          <TouchableOpacity onPress={handleLogMood} style={styles.logMoodBtn}>
            <Text style={styles.logMoodText}>Log Mood</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCheckIn} style={styles.talkLink}>
            <Text style={styles.talkLinkText}>5 MINUTE CHECK IN</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Trend (Moved up) */}
        <View style={[styles.sectionCard, { backgroundColor: "#F0F4EF" }]}>
          <Text style={styles.sectionTitle}>Your 7-Day Mood Trend</Text>
          {loadingChart ? (
            <ActivityIndicator
              color={COLORS.sageGreen}
              style={{ height: 180 }}
            />
          ) : (
            <LineChart
              data={{
                labels: ["1", "2", "3", "4", "5", "6", "7"],
                datasets: [{ data: chartData }],
              }}
              width={screenWidth - 88} // Account for page + card padding
              height={150}
              chartConfig={{
                backgroundColor: "#d4e6f1",
                backgroundGradientFrom: "#d4e6f1",
                backgroundGradientTo: "#aacde0",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(68, 113, 141, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(25, 49, 65, ${opacity})`,
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: COLORS.white,
                },
                propsForBackgroundLines: {
                  stroke: "#aac6d6",
                  strokeDasharray: "3",
                },
                withShadow: true,
                withInnerLines: false,
                withOuterLines: false,
              }}
              getDotColor={(dataPoint, index) => {
                if (index === 0) return COLORS.sageGreen;
                const prevValue = chartData[index - 1];
                if (dataPoint > prevValue) return "#F7D046"; // Bright yellow for improvement
                if (dataPoint < prevValue) return COLORS.sos; // Red for decline
                return COLORS.sageGreen; // No change
              }}
              fromZero
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginHorizontal: -4,
              }}
            />
          )}
          <Text style={styles.moodSummary}>
            {chartData[6] > chartData[0]
              ? "Your mood has been improving steadily!"
              : "Keep tracking to see your patterns."}
          </Text>
        </View>

        {/* Daily Inspiration (YouTube) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Daily Inspiration</Text>
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={200}
              play={false}
              videoId={"inpok4MKVLM"} // 5-minute morning meditation
            />
          </View>
        </View>

        {/* Your Scripture for The Day */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Scripture For The Day</Text>
          {loadingScripture ? (
            <ActivityIndicator color={COLORS.sageGreen} />
          ) : (
            <View>
              <Text style={styles.scriptureText}>"{scripture.text}"</Text>
              <Text style={styles.scriptureRef}>{scripture.ref}</Text>
            </View>
          )}
        </View>

        {/* Your Journal Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Journal</Text>
          <TextInput
            style={styles.journalInput}
            placeholder="What's on your mind?"
            multiline
            value={journalEntry}
            onChangeText={setJournalEntry}
          />
          {journalImage && (
            <Image source={{ uri: journalImage }} style={styles.journalImage} />
          )}
          <View style={styles.journalActions}>
            <TouchableOpacity
              style={styles.journalActionBtn}
              onPress={handlePickImage}
            >
              <Ionicons
                name={journalImage ? "image" : "image-outline"}
                size={20}
                color={journalImage ? COLORS.mutedBlue : COLORS.sageGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.journalActionBtn}
              onPress={handleGetLocation}
            >
              <Ionicons
                name={journalLocation ? "location" : "location-outline"}
                size={20}
                color={journalLocation ? COLORS.mutedBlue : COLORS.sageGreen}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveJournalEntry}
            >
              <Text style={styles.saveBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.lastEntryBox}
            onPress={() => {
              if (lastEntry) {
                if (Platform.OS === "web") {
                  const wantToDelete = window.confirm(
                    "Delete last entry? (OK to Delete, Cancel to Edit)",
                  );
                  if (wantToDelete) {
                    deleteDoc(doc(db, "journalEntries", lastEntry.id)).catch(
                      () => alert("Error deleting."),
                    );
                  } else {
                    setJournalEntry(lastEntry.content || "");
                    setJournalImage(lastEntry.image || null);
                    setJournalLocation(lastEntry.location || null);
                  }
                  return;
                }
                Alert.alert("Last Entry", "What would you like to do?", [
                  {
                    text: "Edit",
                    onPress: () => {
                      setJournalEntry(lastEntry.content || "");
                      setJournalImage(lastEntry.image || null);
                      setJournalLocation(lastEntry.location || null);
                    },
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteDoc(
                          doc(db, "journalEntries", lastEntry.id),
                        );
                        Alert.alert("Deleted", "Entry deleted successfully.");
                      } catch (error) {
                        Alert.alert("Error", "Failed to delete entry.");
                      }
                    },
                  },
                  { text: "Cancel", style: "cancel" },
                ]);
              }
            }}
          >
            <Text style={styles.lastEntryLabel}>
              {lastEntry
                ? `Last entry: ${new Date(lastEntry.createdAt?.toDate()).toLocaleDateString()}`
                : "No entries yet"}
            </Text>
            {lastEntry?.image && (
              <Image
                source={{ uri: lastEntry.image }}
                style={styles.lastEntryImage}
              />
            )}
            <Text style={styles.lastEntryText} numberOfLines={2}>
              {lastEntry?.content || "Start journaling your thoughts..."}
            </Text>
            {lastEntry?.location && (
              <Text style={styles.lastEntryLocation}>
                📍 {lastEntry.location}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Take A Quick Wellness Check-In
          </Text>
          <Text style={styles.wellnessText}>
            A short wellness check-in helps you notice how you feel, calm your
            mind, and find the right videos or quizzes to support your day.
          </Text>
          <TouchableOpacity
            style={styles.wellnessBtn}
            onPress={() => router.push("/tools")}
          >
            <Text style={styles.wellnessBtnText}>
              Explore Wellness Resources
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Daily Quote */}
        <View style={styles.quoteCard}>
          {loadingQuote ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={[styles.quoteText, { color: COLORS.white }]}>
                "{quote.text}"
              </Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 24 },
  header: { marginTop: 20, marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: "300", color: COLORS.textDark },
  name: { fontSize: 32, fontWeight: "600", color: COLORS.sageGreen },
  feelingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E7D2C2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 16,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  moodItem: { alignItems: "center" },
  moodText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  reasonInput: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
    height: 60,
    color: COLORS.textDark,
    fontSize: 14,
    textAlignVertical: "top",
  },
  logMoodBtn: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: COLORS.warmNeutral,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  logMoodText: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "700",
  },
  wellnessText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  wellnessBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 18,
  },
  wellnessBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  talkLink: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  talkLinkText: {
    color: COLORS.white,
    fontSize: 13,
    textDecorationLine: "none",
    fontWeight: "700",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerTextGroup: { flex: 1, paddingRight: 12 },
  nameRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  musicButton: { marginLeft: 10, padding: 4 },
  logoutIcon: {
    padding: 10,
    backgroundColor: COLORS.warmNeutral,
    borderRadius: 16,
  },
  musicPanel: {
    backgroundColor: "#FFF4EE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
  },
  musicLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  findProfessionalBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  findProfessionalBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroCard: {
    width: "100%",
    height: 168,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 18,
    marginBottom: 22,
  },
  heroImage: { opacity: 0.95 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  heroText: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    maxWidth: "85%",
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
  },
  placeholderChart: {
    height: 120,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  colorfulChartText: { color: COLORS.sageGreen, fontWeight: "600" },
  moodSummary: { fontSize: 13, color: "#777", textAlign: "center" },
  scriptureText: {
    fontSize: 16,
    color: COLORS.textDark,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  scriptureRef: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: 8,
    fontWeight: "600",
  },
  journalInput: {
    minHeight: 80,
    fontSize: 15,
    color: COLORS.textDark,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  journalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  journalActions: { flexDirection: "row", alignItems: "center" },
  journalActionBtn: {
    padding: 8,
    marginRight: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveBtnText: { color: "white", fontWeight: "600", fontSize: 14 },
  lastEntryBox: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  lastEntryLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
  lastEntryImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginBottom: 5,
  },
  lastEntryText: { fontSize: 12, color: COLORS.textDark, fontStyle: "italic" },
  lastEntryLocation: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  quoteCard: {
    padding: 24,
    backgroundColor: COLORS.sageGreen,
    borderRadius: 20,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 26,
  },
  quoteAuthor: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 12,
  },
});
