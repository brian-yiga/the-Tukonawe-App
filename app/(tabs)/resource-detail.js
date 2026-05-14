import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { COLORS } from "../../constants/theme";
import { SavedResourcesContext } from "../../context/SavedResourcesContext";

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
  ],
};

export default function ResourceDetailScreen() {
  const router = useRouter();
  const { resourceId, category } = useLocalSearchParams();
  const [resource, setResource] = useState(null);
  const { toggleSaveResource, isSaved } = useContext(SavedResourcesContext);
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  useEffect(() => {
    const allResources = Object.values(MOCK_RESOURCES).flat();
    const found = allResources.find((r) => r.id === resourceId);
    setResource(found);
    if (found) {
      setIsSavedLocal(isSaved(resourceId));
    }
  }, [resourceId, isSaved]);

  if (!resource) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.sageGreen} />
          </TouchableOpacity>
          <Text style={styles.errorText}>Resource not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenUrl = async () => {
    if (!resource.url) return;
    try {
      const supported = await Linking.canOpenURL(resource.url);
      if (supported) {
        Linking.openURL(resource.url);
      } else {
        Alert.alert("Cannot open this resource.");
      }
    } catch (error) {
      Alert.alert("Unable to open the link.");
    }
  };

  const handleSaveResource = () => {
    if (!resource) return;
    toggleSaveResource(resource);
    setIsSavedLocal(!isSavedLocal);
    Alert.alert(
      isSavedLocal ? "Removed from Saved" : "Added to Saved",
      isSavedLocal
        ? "This resource has been removed from your saved collection."
        : "This resource has been saved for later.",
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.bgGreen }]}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveResource}
          >
            <Ionicons
              name={isSavedLocal ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSavedLocal ? COLORS.sos : COLORS.sageGreen}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{resource.type}</Text>
            </View>
            {category && (
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={styles.categoryBadgeText}>{category}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{resource.title}</Text>
          <Text style={styles.subtitle}>{resource.subtitle}</Text>

          {resource.type !== "Quiz" && resource.url && (
            <TouchableOpacity style={styles.playButton} onPress={handleOpenUrl}>
              <Ionicons name="play-circle" size={48} color={COLORS.sageGreen} />
              <Text style={styles.playText}>
                {resource.type === "Article" ? "Read on YouTube" : "Play"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={COLORS.sageGreen}
            />
            <Text style={styles.infoText}>
              {resource.type === "Video"
                ? "Tap the play button to watch this guided content."
                : resource.type === "Audio"
                  ? "Listen to this audio to support your wellbeing."
                  : "Read the full article on the linked page."}
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgGreen },
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: COLORS.bgGreen,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  categoryBadge: {
    backgroundColor: "rgba(163, 177, 138, 0.15)",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    marginBottom: 24,
  },
  playButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    backgroundColor: COLORS.bgGreen,
    borderRadius: 20,
    marginBottom: 24,
  },
  playText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(163, 177, 138, 0.08)",
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  spacer: { height: 40 },
  errorText: { fontSize: 16, color: COLORS.textMuted, marginTop: 20 },
});
