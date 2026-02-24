import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

const GOAL_OPTIONS = [
  { id: 1, label: "Heal from past experiences" },
  { id: 2, label: "Improve sleep quality" },
  { id: 3, label: "Build a meditation practice" },
  { id: 4, label: "Prevent burnout" },
  { id: 5, label: "Manage stress effectively" },
  { id: 6, label: "Increase happiness and joy" },
  { id: 7, label: "Boost self-confidence" },
  { id: 8, label: "Overcome anxiety" },
  { id: 9, label: "Combat depression" },
];

export default function Goals() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goalId) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    // TODO: Save selected goals to user profile or context
    router.push("/(tabs)");
  };

  const handleSkip = () => {
    router.push("/(tabs)");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bgphoto.webp")}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What are your wellness goals?</Text>
            <Text style={styles.subtitle}>
              Select all that resonate with you
            </Text>
          </View>

          <View style={styles.goalsContainer}>
            {GOAL_OPTIONS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedGoals.includes(goal.id) &&
                    styles.goalOptionSelected,
                ]}
                onPress={() => toggleGoal(goal.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedGoals.includes(goal.id) &&
                      styles.checkboxSelected,
                  ]}
                >
                  {selectedGoals.includes(goal.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.goalLabel,
                    selectedGoals.includes(goal.id) &&
                      styles.goalLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Next"
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerContainer: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  skipButton: {
    alignSelf: "flex-end",
  },
  skipText: {
    color: COLORS.secondaryColor,
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 28,
  },
  title: {
    color: COLORS.mainColor,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
  },
  goalsContainer: {
    marginBottom: 20,
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  goalOptionSelected: {
    backgroundColor: `${COLORS.secondaryColor}20`,
    borderColor: COLORS.secondaryColor,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.secondaryColor,
    borderColor: COLORS.secondaryColor,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  goalLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    flex: 1,
  },
  goalLabelSelected: {
    color: COLORS.mainColor,
    fontWeight: "600",
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
});
