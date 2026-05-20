import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
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
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import YoutubePlayer from "react-native-youtube-iframe";
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { moodToValue } from "../../utils/moodUtils";

const moodHero = require("../../assets/images/moodTrackerBg.jpg");

export default function MoodTrackerScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const params = useLocalSearchParams();
  const [selectedMood, setSelectedMood] = useState(
    params.initialMood || "calm",
  );
  const [reason, setReason] = useState("");
  const [activeRange, setActiveRange] = useState("Weekly");
  const [quote, setQuote] = useState({
    text: "Loading inspiration...",
    author: "",
  });
  const [scripture, setScripture] = useState({
    text: "Loading word...",
    ref: "",
  });
  const [chartData, setChartData] = useState({
    labels: ["Log"],
    datasets: [{ data: [3] }],
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  // Functionalize the Graph logic
  useEffect(() => {
    if (!user?.uid) return;

    // Determine how many logs to show based on the active range
    const rangeLimit =
      activeRange === "Daily" ? 12 : activeRange === "Weekly" ? 7 : 30;

    const q = query(
      collection(db, "mood_logs"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(rangeLimit),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rawData = snapshot.docs.map((doc) => doc.data());

      if (rawData.length > 0) {
        // Reverse to show chronological order (left to right)
        const values = rawData.map((d) => d.moodValue || 3).reverse();
        const labels = rawData
          .map((d, index) => {
            if (activeRange === "Weekly") {
              // Try to get day of week if timestamp exists
              const date = d.createdAt?.toDate();
              return date
                ? date.toLocaleDateString("en-US", { weekday: "short" })
                : (index + 1).toString();
            }
            return (index + 1).toString();
          })
          .reverse();

        setChartData({ labels, datasets: [{ data: values }] });
      }
    });

    return () => unsubscribe();
  }, [user, activeRange]);

  const fetchData = async () => {
    try {
      const quoteRes = await fetch("https://zenquotes.io/api/today");
      const quoteData = await quoteRes.json();
      setQuote({ text: quoteData[0].q, author: quoteData[0].a });

      const scripRes = await fetch("https://bible-api.com/psalm+23:1");
      const scripData = await scripRes.json();
      setScripture({ text: scripData.text.trim(), ref: scripData.reference });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      if (Platform.OS === "web") {
        alert("Please select a mood before logging.");
        return;
      }
      Alert.alert("Error", "Please select a mood before logging.");
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

    setSaving(true);
    try {
      await addDoc(collection(db, "mood_logs"), {
        // This creates the collection automatically on first save
        userId: user.uid,
        mood: selectedMood,
        moodValue: moodToValue(selectedMood), // Convert mood to a numerical value
        reason: reason,
        createdAt: serverTimestamp(),
      });
      if (Platform.OS === "web") {
        alert("Mood logged successfully!");
      } else {
        Alert.alert("Success", "Mood logged successfully!");
      }
      setReason(""); // Clear reason input
      router.back(); // Go back to home screen
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Failed to save mood. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save mood. Please try again.");
      }
      console.error("Error saving mood:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderMoodIcon = (mood, icon, color) => (
    <TouchableOpacity
      style={[
        styles.moodBtn,
        selectedMood === mood && { borderColor: color, borderWidth: 2 },
      ]}
      onPress={() => setSelectedMood(mood)}
    >
      <Ionicons name={icon} size={30} color={color} />
      <Text style={styles.moodLabel}>{mood}</Text>
    </TouchableOpacity>
  );

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

        <Text style={styles.title}>Mood Tracker</Text>

        <View style={styles.heroBanner}>
          <Image source={moodHero} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Track feelings with a gentle rhythm
            </Text>
            <Text style={styles.heroSubtitle}>
              Notice the patterns and keep your mood journey warm and kind.
            </Text>
          </View>
        </View>

        {/* Log Mood Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling right now?</Text>
          <View style={styles.moodContainer}>
            {renderMoodIcon("happy", "sunny-outline", "#FFB74D")}
            {renderMoodIcon("calm", "leaf-outline", COLORS.sageGreen)}
            {renderMoodIcon("sad", "water-outline", "#64B5F6")}
            {renderMoodIcon("angry", "flame-outline", "#E57373")}
            {renderMoodIcon("tired", "moon-outline", "#9575CD")}
          </View>

          <Text style={styles.label}>Why are you feeling this way?</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your thoughts..."
            value={reason}
            onChangeText={setReason}
            multiline
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveMood}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Log Entry</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/professional")}
            style={styles.proLink}
          >
            <Text style={styles.proLinkText}>
              Do you need to talk to a professional?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Graph Section */}
        <View style={styles.card}>
          <View style={styles.rangeSelector}>
            {["Daily", "Weekly", "Monthly"].map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setActiveRange(range)}
                style={[
                  styles.rangeBtn,
                  activeRange === range && styles.activeRangeBtn,
                ]}
              >
                <Text
                  style={[
                    styles.rangeText,
                    activeRange === range && styles.activeRangeText,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [{ data: [2, 4, 3, 5, 4] }],
            }}
            data={chartData}
            width={screenWidth - 80} // Adjusting for card padding
            height={160}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => COLORS.sageGreen,
              labelColor: (opacity = 1) => COLORS.textMuted,
            }}
            getDotColor={(dataPoint, index) => {
              const data = chartData.datasets[0].data;
              if (index === 0) return COLORS.sageGreen;
              const prevValue = data[index - 1];
              if (dataPoint > prevValue) return COLORS.mutedBlue; // Upward trend
              if (dataPoint < prevValue) return COLORS.sos; // Downward trend
              return COLORS.sageGreen; // No change
            }}
            style={styles.chart}
          />
        </View>

        {/* Daily Scripture & Quote */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>Daily Scripture</Text>
          <Text style={styles.scriptureText}>"{scripture.text}"</Text>
          <Text style={styles.scriptureRef}>{scripture.ref}</Text>

          <View style={styles.divider} />

          <Text style={styles.subHeader}>Inspirational Quote</Text>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>

        {/* Mood Booster Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mood Booster</Text>
          <Text style={styles.subtitle}>
            Listen to some calming frequencies
          </Text>
          <View style={styles.videoContainer}>
            <YoutubePlayer height={180} play={false} videoId={"lFcSrYw-ARY"} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { marginLeft: 8, color: COLORS.sageGreen, fontWeight: "600" },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 20,
  },
  heroBanner: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 140,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.95,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.20)",
    justifyContent: "flex-end",
    padding: 18,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.mainTextColor,
    lineHeight: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moodBtn: {
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#F9F9F9",
    width: "18%",
  },
  moodLabel: {
    fontSize: 10,
    marginTop: 5,
    color: COLORS.textMuted,
    textTransform: "capitalize",
  },
  label: {
    fontSize: 14,
    color: COLORS.mainTextColor,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: COLORS.sageGreen,
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
  },
  saveBtnText: { color: "white", fontWeight: "700" },
  proLink: { marginTop: 15, alignSelf: "center" },
  proLinkText: {
    color: COLORS.mutedBlue,
    textDecorationLine: "underline",
    fontSize: 13,
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  rangeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeRangeBtn: { backgroundColor: COLORS.sageGreen },
  rangeText: { color: COLORS.textMuted, fontSize: 12 },
  activeRangeText: { color: "white", fontWeight: "600" },
  chart: { marginVertical: 8, borderRadius: 16 },
  subHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brownish,
    marginBottom: 5,
  },
  scriptureText: {
    fontStyle: "italic",
    color: COLORS.mainTextColor,
    textAlign: "center",
  },
  scriptureRef: {
    textAlign: "right",
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 15 },
  quoteText: { color: COLORS.mainTextColor, textAlign: "center" },
  quoteAuthor: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  videoContainer: { borderRadius: 15, overflow: "hidden", marginTop: 10 },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
});
