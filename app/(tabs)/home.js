import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import YoutubePlayer from "react-native-youtube-iframe"; // Ensure this is installed: npx expo install react-native-youtube-iframe
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.email?.split("@")[0] || "Friend";
  const [quote, setQuote] = useState({
    text: "Tranquility comes from within.",
    author: "Reflection",
  });
  const [scripture, setScripture] = useState({ text: "Loading word...", ref: "" });
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [loadingScripture, setLoadingScripture] = useState(true);
  const [moodReason, setMoodReason] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [chartData, setChartData] = useState([3, 3, 3, 3, 3, 3, 3]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    fetchQuote();
    fetchScripture();
    
    if (user?.uid) {
      const q = query(
        collection(db, "mood_logs"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(7)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const moods = [];
        querySnapshot.forEach((doc) => {
          moods.push(doc.data().moodValue || 3);
        });
        
        if (moods.length > 0) {
          // Pad with default values if less than 7 logs exist, then reverse to show chronological order
          const filledMoods = [...moods, ...Array(7 - moods.length).fill(3)].slice(0, 7).reverse();
          setChartData(filledMoods);
        }
        setLoadingChart(false);
      });

      return () => unsubscribe();
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
      setScripture({ text: "Be still, and know that I am God.", ref: "Psalm 46:10" });
    } finally {
      setLoadingScripture(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.name}>{firstName}.</Text>
        </View>

        {/* Interactive Mood Check-in */}
        <View style={styles.sectionCard}>
          <Text style={styles.feelingTitle}>How are you feeling today?</Text>
          <View style={styles.moodRow}>
            {["happy", "calm", "sad", "angry", "tired"].map((mood) => (
              <TouchableOpacity 
                key={mood} 
                style={styles.moodItem}
                onPress={() => router.push({ pathname: "/(tabs)/mood-tracker", params: { initialMood: mood } })}
              >
                <Ionicons
                  name={
                    mood === "happy"
                      ? "sunny-outline"
                      : mood === "calm"
                        ? "leaf-outline"
                        : "water-outline"
                  }
                  size={32}
                  color={COLORS.sageGreen}
                />
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.reasonInput}
            placeholder="What's making you feel this way?"
            placeholderTextColor={COLORS.textMuted}
            value={moodReason}
            onChangeText={setMoodReason}
            multiline
          />

          <TouchableOpacity 
            onPress={() => router.push("/professional")}
            style={styles.talkLink}
          >
            <Text style={styles.talkLinkText}>Do you want to talk?</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Trend (Moved up) */}
        <View style={[styles.sectionCard, { backgroundColor: '#F0F4EF' }]}>
          <Text style={styles.sectionTitle}>Weekly Trend</Text>
          {loadingChart ? (
            <ActivityIndicator color={COLORS.sageGreen} style={{ height: 180 }} />
          ) : (
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: chartData }]
            }}
            width={screenWidth - 48} // Adjusting for container padding (24*2)
            height={180}
            chartConfig={{
              backgroundColor: "#F0F4EF",
              backgroundGradientFrom: "#F0F4EF",
              backgroundGradientTo: "#F0F4EF",
              color: (opacity = 1) => `rgba(163, 177, 138, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(109, 76, 65, ${opacity})`,
              propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.sageGreen }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
          )}
          <Text style={styles.moodSummary}>
            {chartData[6] > chartData[0] ? "Your mood has been improving steadily!" : "Keep tracking to see your patterns."}
          </Text>
        </View>

        {/* Daily Inspiration (YouTube) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Morning Meditation</Text>
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
          <Text style={styles.sectionTitle}>Scripture for The Day</Text>
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
            placeholder="How was your night? What's on your mind?"
            multiline
            value={journalEntry}
            onChangeText={setJournalEntry}
          />
          <View style={styles.journalActions}>
            <TouchableOpacity style={styles.journalActionBtn}>
              <Ionicons name="image-outline" size={20} color={COLORS.sageGreen} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.journalActionBtn}>
              <Ionicons name="location-outline" size={20} color={COLORS.sageGreen} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lastEntryBox}>
            <Text style={styles.lastEntryLabel}>Last entry: Yesterday</Text>
            <Text style={styles.lastEntryText} numberOfLines={1}>
              I felt a deep sense of peace after the meditation...
            </Text>
          </View>
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
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  moodItem: { alignItems: "center" },
  moodText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  reasonInput: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    height: 60,
    color: COLORS.textDark,
    fontSize: 14,
    textAlignVertical: "top",
  },
  talkLink: {
    marginTop: 12,
    alignSelf: "center",
  },
  talkLinkText: {
    color: COLORS.mutedBlue,
    fontSize: 13,
    textDecorationLine: "underline",
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
  journalActions: { flexDirection: "row", alignItems: "center" },
  journalActionBtn: {
    padding: 8,
    marginRight: 10,
    backgroundColor: "#F0F4EF",
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
  lastEntryText: { fontSize: 12, color: COLORS.textDark, fontStyle: "italic" },
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
