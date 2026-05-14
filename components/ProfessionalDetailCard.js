import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/theme";

export default function ProfessionalDetailCard({
  visible,
  professional,
  onClose,
  onMessage,
  onRequestCall,
}) {
  if (!visible || !professional) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>{professional.name}</Text>
              <Text style={styles.modalSubtitle}>
                {professional.profession}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={professional.image} style={styles.image} />
            <View style={styles.detailsRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {professional.experience} yrs
                </Text>
              </View>
              <View style={[styles.badge, styles.ratingBadge]}>
                <Text style={styles.badgeText}>
                  {professional.rating.toFixed(1)} ★
                </Text>
              </View>
            </View>
            <Text style={styles.field}>{professional.field}</Text>
            <Text style={styles.bio}>
              {professional.bio ||
                "Trusted support with a calm, thoughtful approach to mental health care."}
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onMessage(professional)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() => onRequestCall(professional)}
              >
                <Ionicons name="call-outline" size={18} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Request Call</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.warmNeutral,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "85%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalSubtitle: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 210,
    borderRadius: 20,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  ratingBadge: {
    backgroundColor: COLORS.bgGreen,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
  field: {
    color: COLORS.textDark,
    fontSize: 15,
    marginBottom: 12,
  },
  bio: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 14,
    borderRadius: 16,
  },
  callButton: {
    backgroundColor: COLORS.sos,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
