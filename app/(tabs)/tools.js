import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS } from "../../constants/theme";
import { SavedResourcesContext } from "../../context/SavedResourcesContext";

const TOOLS = [
  {
    id: "1",
    title: "Mood Tracker",
    icon: "sunny-outline",
    color: "#E9EDC9",
    progress: "1/1",
    achieved: true,
  },
  {
    id: "2",
    title: "Journal",
    icon: "create-outline",
    color: "#CCD5AE",
    progress: "0/1",
    achieved: false,
  },
  {
    id: "3",
    title: "Thought Process",
    icon: "brain-outline",
    color: "#D4A373",
    progress: "New",
    achieved: false,
  },
  {
    id: "4",
    title: "Meditation",
    icon: "leaf-outline",
    color: "#FAEDCD",
    progress: "10m",
    achieved: true,
  },
];

const RESOURCE_TABS = [
  { id: "meditation", label: "Meditation" },
  { id: "work", label: "At Work" },
  { id: "sleep", label: "Better Sleep" },
  { id: "depression", label: "Depression" },
  { id: "anxiety", label: "Anxiety" },
];

const MOCK_RESOURCES = {
  meditation: [
    {
      id: "m1",
      title: "5-Minute Morning Reset",
      type: "Video",
      subtitle: "Guided breathing for calm focus.",
      url: "https://www.youtube.com/watch?v=inpok4MKVLM",
    },
    {
      id: "m2",
      title: "Deep Breathing Basics",
      type: "Audio",
      subtitle: "A short breathing practice for anxiety relief.",
      url: "https://www.youtube.com/watch?v=6p_yaNFSYao",
    },
    {
      id: "m3",
      title: "Meditation Readiness Quiz",
      type: "Quiz",
      subtitle: "Check how ready you are to meditate regularly.",
      quizId: "meditation",
    },
  ],
  work: [
    {
      id: "w1",
      title: "Desk Yoga for Focus",
      type: "Video",
      subtitle: "Simple stretches you can do at your desk.",
      url: "https://www.youtube.com/watch?v=xfAF6QeWBUk",
    },
    {
      id: "w2",
      title: "Handling Deadline Stress",
      type: "Video",
      subtitle: "A quick mental reset for busy workdays.",
      url: "https://www.youtube.com/watch?v=V5b_-i8I4v0",
    },
    {
      id: "w3",
      title: "Work Resilience Quiz",
      type: "Quiz",
      subtitle: "Discover your current resilience style.",
      quizId: "work",
    },
  ],
  sleep: [
    {
      id: "s1",
      title: "Unwinding Your Mind",
      type: "Audio",
      subtitle: "A guided sleep relaxation for evening.",
      url: "https://www.youtube.com/watch?v=ZDnfx5gz1bw",
    },
    {
      id: "s2",
      title: "Sleep Soundscape: Rain Forest",
      type: "Audio",
      subtitle: "Ambient nature sounds to help you drift off.",
      url: "https://www.youtube.com/watch?v=OdIJ2x3nxzQ",
    },
    {
      id: "s3",
      title: "Sleep Habits Quiz",
      type: "Quiz",
      subtitle: "What is your sleep pattern type?",
      quizId: "sleep",
    },
  ],
  depression: [
    {
      id: "d1",
      title: "Finding Small Wins Today",
      type: "Video",
      subtitle: "A short talk on building momentum.",
      url: "https://www.youtube.com/watch?v=U9YKY7fdwyg",
    },
    {
      id: "d2",
      title: "The Power of Routine",
      type: "Article",
      subtitle: "Why a daily structure can support mood.",
      url: "https://www.youtube.com/watch?v=iG9CE55wbtY",
    },
    {
      id: "d3",
      title: "Mood Awareness Quiz",
      type: "Quiz",
      subtitle: "Learn which mood habits matter most.",
      quizId: "depression",
    },
  ],
  anxiety: [
    {
      id: "a1",
      title: "Grounding Technique (5-4-3-2-1)",
      type: "Video",
      subtitle: "A reliable way to calm your nervous system.",
      url: "https://www.youtube.com/watch?v=fJzX06CZ4FM",
    },
    {
      id: "a2",
      title: "Quietening Social Anxiety",
      type: "Audio",
      subtitle: "A calming visualization for social stress.",
      url: "https://www.youtube.com/watch?v=aY6cDyq3nO0",
    },
    {
      id: "a3",
      title: "Anxiety Patterns Quiz",
      type: "Quiz",
      subtitle: "Identify your core anxiety triggers.",
      quizId: "anxiety",
    },
  ],
};

const QUIZ_CONTENT = {
  meditation: {
    title: "Meditation Readiness",
    questions: [
      {
        id: "q1",
        question: "How often do you currently practice quiet reflection?",
        options: [
          "Daily for 5+ minutes",
          "A few times per week",
          "Rarely",
          "Never",
        ],
        correctIndex: 0,
      },
      {
        id: "q2",
        question: "What is your biggest meditation barrier?",
        options: [
          "Time",
          "Distraction",
          "Uncertainty about technique",
          "Lack of motivation",
        ],
        correctIndex: 2,
      },
      {
        id: "q3",
        question: "How do you feel after a focused breathing practice?",
        options: [
          "Calmer and clearer",
          "About the same",
          "A bit restless",
          "Unsure",
        ],
        correctIndex: 0,
      },
    ],
  },
  work: {
    title: "Work Resilience Quiz",
    questions: [
      {
        id: "q1",
        question: "When a deadline approaches, you usually feel:",
        options: [
          "Motivated and focused",
          "Stressed but managed",
          "Overwhelmed",
          "Avoidant",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "How often do you take short breaks during busy work?",
        options: [
          "Every hour",
          "Few breaks a day",
          "Only when forced",
          "Almost never",
        ],
        correctIndex: 0,
      },
      {
        id: "q3",
        question: "What helps you reset at work?",
        options: [
          "Breathing exercises",
          "Coffee",
          "Scrolling social media",
          "Ignoring it",
        ],
        correctIndex: 0,
      },
    ],
  },
  sleep: {
    title: "Sleep Habits Quiz",
    questions: [
      {
        id: "q1",
        question: "Do you sleep at consistent times?",
        options: ["Yes", "Sometimes", "Rarely", "Never"],
        correctIndex: 0,
      },
      {
        id: "q2",
        question: "How many hours of sleep do you get on average?",
        options: ["7-9", "5-7", "3-5", "Less than 3"],
        correctIndex: 0,
      },
      {
        id: "q3",
        question: "Do you use screens right before bed?",
        options: ["No", "Sometimes", "Often", "Always"],
        correctIndex: 0,
      },
    ],
  },
  depression: {
    title: "Mood Awareness Quiz",
    questions: [
      {
        id: "q1",
        question: "How often do you feel low energy?",
        options: ["Daily", "Several times a week", "Sometimes", "Rarely"],
        correctIndex: 3,
      },
      {
        id: "q2",
        question: "Do you still enjoy small daily activities?",
        options: ["Yes", "Sometimes", "Not really", "No"],
        correctIndex: 0,
      },
      {
        id: "q3",
        question: "Do you have a trusted person to talk to?",
        options: ["Yes", "A little", "Not really", "No"],
        correctIndex: 0,
      },
    ],
  },
  anxiety: {
    title: "Anxiety Patterns Quiz",
    questions: [
      {
        id: "q1",
        question: "What most often triggers your anxiety?",
        options: ["Work", "Social situations", "Health", "Unknown"],
        correctIndex: 3,
      },
      {
        id: "q2",
        question: "How do you usually cope with anxious feelings?",
        options: ["Breathing", "Talking to someone", "Avoiding", "Rushing"],
        correctIndex: 0,
      },
      {
        id: "q3",
        question: "Do you notice physical tension in your body?",
        options: ["Yes", "Sometimes", "Rarely", "No"],
        correctIndex: 0,
      },
    ],
  },
};

export default function ToolsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(params.activeTab || "meditation");
  const { savedResources } = useContext(SavedResourcesContext);
  const [quizVisible, setQuizVisible] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleToolPress = (toolId) => {
    if (toolId === "1") {
      router.push("/mood-tracker");
    } else if (toolId === "2") {
      router.push("/journal");
    } else if (toolId === "3") {
      router.push("/cbt-record");
    }
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Cannot open this resource.");
      }
    } catch (error) {
      Alert.alert("Unable to open the link.");
    }
  };

  const handleResourcePress = (resource) => {
    if (resource.type === "Quiz") {
      const quiz = QUIZ_CONTENT[resource.quizId];
      if (!quiz) {
        Alert.alert("Quiz unavailable");
        return;
      }
      setActiveQuiz(quiz);
      setQuizIndex(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setQuizVisible(true);
      return;
    }

    router.push({
      pathname: "/resource-detail",
      params: { resourceId: resource.id, category: activeTab },
    });
  };

  const handleSelectAnswer = (index) => {
    if (!activeQuiz) return;
    if (selectedAnswer !== null) return;
    const question = activeQuiz.questions[quizIndex];
    const isCorrect = question.correctIndex === index;
    setSelectedAnswer(index);
    if (isCorrect) {
      setQuizScore((previous) => previous + 1);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert("Choose an answer first.");
      return;
    }

    const nextIndex = quizIndex + 1;
    if (nextIndex >= activeQuiz.questions.length) {
      setQuizVisible(false);
      Alert.alert(
        "Quiz completed",
        `You answered ${quizScore}/${activeQuiz.questions.length} correctly.`,
      );
      setActiveQuiz(null);
      setQuizIndex(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      return;
    }

    setQuizIndex(nextIndex);
    setSelectedAnswer(null);
  };

  const handleCloseQuiz = () => {
    setQuizVisible(false);
    setActiveQuiz(null);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Calm Corner</Text>
        <Text style={styles.subtitle}>Daily grounding and growth.</Text>

        <View style={styles.heroSection}>
          <ImageBackground
            source={require("../../assets/images/toolsBg.jpg")}
            style={styles.toolHeroImage} // Make sure this has your width/height
          >
            <View style={styles.heroInfo}>
              <Text style={styles.heroInfoTitle}>
                Mindful moments made easy
              </Text>
              <Text style={styles.heroInfoSubtitle}>
                Start your day with small practices that support your mood.
              </Text>
            </View>
          </ImageBackground>
        </View>

        <Text style={styles.categoryTitle}>Daily Tools</Text>
        <View style={styles.toolsGrid}>
          {TOOLS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.toolCard}
              activeOpacity={0.7}
              onPress={() => handleToolPress(item.id)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon} size={28} color="#444" />
              </View>
              <Text style={styles.toolTitle}>{item.title}</Text>

              <View style={styles.progressRow}>
                <Text style={styles.progressText}>{item.progress}</Text>
                {item.achieved && (
                  <Ionicons
                    name="star"
                    size={14}
                    color="#FFD700"
                    style={styles.starIcon}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.categoryTitle, { marginTop: 10 }]}>
          Saved For Later
        </Text>
        {savedResources.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.savedList}
          >
            {savedResources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.savedCard}
                onPress={() => handleResourcePress(resource)}
              >
                <View style={styles.savedBadge}>
                  <Text style={styles.savedBadgeText}>{resource.type}</Text>
                </View>
                <Text style={styles.savedTitle} numberOfLines={2}>
                  {resource.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptySaved}>
            <Ionicons
              name="bookmark-outline"
              size={32}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptySavedText}>
              No saved resources yet. Tap the bookmark icon to save.
            </Text>
          </View>
        )}

        <Text style={[styles.categoryTitle, { marginTop: 20 }]}>Resources</Text>

        <View style={styles.tabBarGrid}>
          {RESOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabItem,
                styles.tabGridItem,
                activeTab === tab.id && styles.activeTabItem,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resourceList}>
          {MOCK_RESOURCES[activeTab].map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource)}
            >
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceMeta}>{resource.subtitle}</Text>
              </View>
              <View style={styles.resourceBadge}>
                <Text style={styles.resourceBadgeText}>{resource.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Modal visible={quizVisible} transparent animationType="slide">
          <View style={styles.quizOverlay}>
            <View style={styles.quizCard}>
              {activeQuiz && (
                <>
                  <Text style={styles.quizTitle}>{activeQuiz.title}</Text>
                  <Text style={styles.quizQuestion}>
                    {activeQuiz.questions[quizIndex].question}
                  </Text>
                  {activeQuiz.questions[quizIndex].options.map(
                    (option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect =
                        selectedAnswer !== null &&
                        activeQuiz.questions[quizIndex].correctIndex === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.quizOption,
                            isSelected && styles.quizOptionSelected,
                            isCorrect && styles.quizOptionCorrect,
                          ]}
                          onPress={() => handleSelectAnswer(index)}
                        >
                          <Text style={styles.quizOptionText}>{option}</Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                  <View style={styles.quizActions}>
                    <TouchableOpacity
                      style={styles.quizActionButton}
                      onPress={handleCloseQuiz}
                    >
                      <Text style={styles.quizActionLabel}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quizActionButtonPrimary}
                      onPress={handleNextQuestion}
                    >
                      <Text style={styles.quizActionLabel}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.sageGreen,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
    marginTop: 4,
  },
  heroSection: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: COLORS.cardBg,
  },
  toolHeroImage: {
    width: "100%",
    height: 160,
  },
  heroInfo: {
    padding: 16,
  },
  heroInfoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 8,
    marginTop: 12,
  },
  heroInfoSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.brownish,
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toolCard: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: { fontSize: 11, fontWeight: "700", color: COLORS.textMuted },
  starIcon: { marginLeft: 4 },

  // Tab Bar Styles
  tabBarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabBar: { marginBottom: 16 },
  tabBarContent: { paddingRight: 20 },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 12,
  },
  tabGridItem: {
    width: "48%",
  },
  activeTabItem: {
    backgroundColor: COLORS.sageGreen,
    borderColor: COLORS.sageGreen,
  },
  tabLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: "500" },
  activeTabLabel: { color: "white", fontWeight: "600" },

  // Resource Card Styles
  resourceList: { marginBottom: 20 },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  resourceInfo: { flex: 1, marginRight: 12 },
  resourceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  resourceMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  resourceBadge: {
    backgroundColor: COLORS.bgGreen,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  resourceBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  quizOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  quizCard: {
    backgroundColor: COLORS.warmNeutral,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  quizQuestion: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 18,
    lineHeight: 22,
  },
  quizOption: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  quizOptionSelected: {
    borderColor: COLORS.sageGreen,
    backgroundColor: "rgba(163, 177, 138, 0.15)",
  },
  quizOptionCorrect: {
    borderColor: COLORS.sageGreen,
    backgroundColor: "rgba(163, 177, 138, 0.18)",
  },
  quizOptionText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  quizActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  quizActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    marginRight: 10,
  },
  quizActionButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS.sageGreen,
    alignItems: "center",
  },
  quizActionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  savedList: {
    marginBottom: 16,
  },
  savedCard: {
    width: 160,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    minHeight: 140,
  },
  savedBadge: {
    backgroundColor: COLORS.bgGreen,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  savedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    lineHeight: 20,
  },
  emptySaved: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "rgba(163, 177, 138, 0.08)",
    borderRadius: 16,
    marginBottom: 16,
  },
  emptySavedText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    maxWidth: "80%",
  },
});
