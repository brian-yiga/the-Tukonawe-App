import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
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
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const recordHero = require("../../assets/images/thoughtProcessBg.jpg");

const DISTORTIONS = [
  {
    name: "All-or-Nothing Thinking",
    desc: "Seeing things in black-or-white. If it's not perfect, it's a failure.",
  },
  {
    name: "Catastrophizing",
    desc: "Expecting the worst-case scenario to happen, no matter how unlikely.",
  },
  {
    name: "Mind Reading",
    desc: "Assuming you know what others are thinking without any evidence.",
  },
  {
    name: "Overgeneralization",
    desc: "Seeing a single negative event as a never-ending pattern of defeat.",
  },
  {
    name: "Labeling",
    desc: "Assigning rigid, negative labels to yourself (e.g., 'I'm a failure').",
  },
  {
    name: "Emotional Reasoning",
    desc: "Assuming that your negative emotions reflect the way things really are.",
  },
];

export default function CBTRecordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showDistortions, setShowDistortions] = useState(false);

  const [form, setForm] = useState({
    situation: "",
    automaticThought: "",
    emotion: "",
    evidenceFor: "",
    evidenceAgainst: "",
    balancedThought: "",
  });

  const handleSave = async () => {
    if (!form.situation || !form.automaticThought) {
      if (Platform.OS === "web") {
        alert("Please describe the situation and your automatic thought.");
        return;
      }
      Alert.alert(
        "Required Fields",
        "Please describe the situation and your automatic thought.",
      );
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "cbt_records"), {
        userId: user.uid,
        ...form,
        createdAt: serverTimestamp(),
      });
      if (Platform.OS === "web") {
        alert("Your balanced perspective has been saved.");
      } else {
        Alert.alert(
          "Record Saved",
          "Your balanced perspective has been saved.",
        );
      }
      router.back();
    } catch (e) {
      if (Platform.OS === "web") {
        alert("Could not save the record. Please try again.");
      } else {
        Alert.alert("Error", "Could not save the record. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, key, placeholder, description) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline
        value={form[key]}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.push("/tools")}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.sageGreen} />
            <Text style={styles.backText}>Back to Tools</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/cbt-history")}
            style={styles.historyBtn}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.sageGreen} />
            <Text style={styles.historyBtnText}>History</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>CBT Thought Record</Text>

        <View style={styles.heroBanner}>
          <Image source={recordHero} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Shape your thoughts with a calmer space
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Challenge negative thoughts by examining the evidence and finding
          balance.
        </Text>

        <View style={styles.card}>
          {renderField(
            "1. The Situation",
            "situation",
            "What happened? Where? Who with?",
            "Example: My boss didn't reply to my email for 3 hours.",
          )}

          {renderField(
            "2. Automatic Thought",
            "automaticThought",
            "What went through your mind?",
            "Example: They think my work is terrible and I'm going to be fired.",
          )}

          <TouchableOpacity
            style={styles.guideToggle}
            onPress={() => setShowDistortions(!showDistortions)}
          >
            <Ionicons
              name={showDistortions ? "chevron-up" : "help-circle-outline"}
              size={20}
              color={COLORS.sageGreen}
            />
            <Text style={styles.guideToggleText}>
              {showDistortions
                ? "Hide Distortion Guide"
                : "View Common Distortions"}
            </Text>
          </TouchableOpacity>

          {showDistortions && (
            <View style={styles.distortionGuide}>
              {DISTORTIONS.map((d, index) => (
                <View key={index} style={styles.distortionItem}>
                  <Text style={styles.distortionName}>{d.name}</Text>
                  <Text style={styles.distortionDesc}>{d.desc}</Text>
                </View>
              ))}
            </View>
          )}

          {renderField(
            "3. Emotion & Intensity",
            "emotion",
            "How did you feel? (0-100%)",
            "Example: Anxious (80%), Insecure (90%)",
          )}

          <View style={styles.divider} />

          {renderField(
            "4. Evidence FOR",
            "evidenceFor",
            "What facts support this thought?",
            "Is there any factual proof this thought is true?",
          )}

          {renderField(
            "5. Evidence AGAINST",
            "evidenceAgainst",
            "What facts contradict this thought?",
            "Has your boss praised you before? Are they usually busy?",
          )}

          {renderField(
            "6. Balanced Perspective",
            "balancedThought",
            "A more realistic way to see it.",
            "Example: My boss is likely busy. They usually reply when they can.",
          )}

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Save Record</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { marginLeft: 8, color: COLORS.sageGreen, fontWeight: "600" },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 45,
  },
  historyBtnText: {
    marginLeft: 6,
    color: COLORS.sageGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 8,
  },
  heroBanner: {
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 140,
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.95,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.24)",
    justifyContent: "flex-end",
    padding: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.textDark,
    textAlignVertical: "top",
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
    marginBottom: 25,
  },
  saveBtn: {
    backgroundColor: COLORS.sageGreen,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  guideToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#F0F4EF",
    borderRadius: 12,
  },
  guideToggleText: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.sageGreen,
    fontWeight: "600",
  },
  distortionGuide: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  distortionItem: {
    marginBottom: 14,
  },
  distortionName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  distortionDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});
