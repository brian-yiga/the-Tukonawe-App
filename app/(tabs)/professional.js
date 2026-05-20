import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ProfessionalDetailCard from "../../components/ProfessionalDetailCard";
import { COLORS } from "../../constants/theme";
import professionals from "../../data/professionals";

const COMMON_WHATSAPP_NUMBER = "+2560709203470";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

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

export default function ProfessionalScreen() {
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [search, setSearch] = useState("");
  const [requestFormVisible, setRequestFormVisible] = useState(false);
  const [requestProfessional, setRequestProfessional] = useState(null);
  const [requestForm, setRequestForm] = useState({
    name: "",
    phone: "",
    preferredTime: "",
    notes: "",
  });
  const [listFormVisible, setListFormVisible] = useState(false);
  const [listForm, setListForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    field: "",
    experience: "",
    website: "",
    message: "",
  });
  const [listSubmitting, setListSubmitting] = useState(false);

  const filteredProfessionals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return professionals;
    return professionals.filter(({ name, profession, field }) => {
      return (
        name.toLowerCase().includes(query) ||
        profession.toLowerCase().includes(query) ||
        (field || "").toLowerCase().includes(query)
      );
    });
  }, [search]);

  const handleQuickCheckIn = () => {
    openWhatsApp(
      COMMON_WHATSAPP_NUMBER,
      "Hi, I would like a quick 5-minute check-in.",
    );
  };

  const handleMessage = (professional) => {
    const message = `Hi, I am reaching out about ${professional.name}. I would like to connect with a professional.`;
    openWhatsApp(COMMON_WHATSAPP_NUMBER, message);
  };

  const handleRequestCall = (professional) => {
    setRequestProfessional(professional);
    setRequestFormVisible(true);
  };

  const handleRequestFormChange = (key, value) => {
    setRequestForm((current) => ({ ...current, [key]: value }));
  };

  const handleCancelRequest = () => {
    setRequestFormVisible(false);
    setRequestProfessional(null);
    setRequestForm({ name: "", phone: "", preferredTime: "", notes: "" });
  };

  const handleOpenJoinForm = () => {
    setListFormVisible(true);
  };

  const handleListFormChange = (key, value) => {
    setListForm((current) => ({ ...current, [key]: value }));
  };

  const handleCancelJoin = () => {
    setListFormVisible(false);
    setListForm({
      name: "",
      email: "",
      phone: "",
      profession: "",
      field: "",
      experience: "",
      website: "",
      message: "",
    });
    setListSubmitting(false);
  };

  const handleSubmitJoin = async () => {
    const {
      name,
      email,
      phone,
      profession,
      field,
      experience,
      website,
      message,
    } = listForm;
    if (!name.trim() || !email.trim() || !phone.trim() || !profession.trim()) {
      if (Platform.OS === "web") {
        alert("Name, email, phone and profession are required to join.");
        return;
      }
      Alert.alert(
        "Please fill all required fields",
        "Name, email, phone and profession are required to join.",
      );
      return;
    }

    setListSubmitting(true);
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Professional Listing Request",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          profession: profession.trim(),
          field: field.trim(),
          experience: experience.trim(),
          website: website.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        if (Platform.OS === "web") {
          alert(
            "Thank you! Your listing request has been submitted successfully.",
          );
        } else {
          Alert.alert(
            "Request sent",
            "Thank you! Your listing request has been submitted successfully.",
          );
        }
        handleCancelJoin();
      } else {
        throw new Error(result.message || "Unable to send listing request.");
      }
    } catch (error) {
      if (Platform.OS === "web") {
        alert(
          error.message ||
            "Could not submit your request. Please try again later.",
        );
      } else {
        Alert.alert(
          "Submission failed",
          error.message ||
            "Could not submit your request. Please try again later.",
        );
      }
    } finally {
      setListSubmitting(false);
    }
  };

  const handleSubmitRequest = () => {
    const { name, phone, preferredTime, notes } = requestForm;
    if (!name.trim() || !phone.trim()) {
      if (Platform.OS === "web") {
        alert("Please complete your name and phone number.");
        return;
      }
      Alert.alert("Please complete your name and phone number.");
      return;
    }

    const message = `Hello, I would like to request a callback from ${requestProfessional?.name || "a professional"}.\n\nName: ${name.trim()}\nPhone: ${phone.trim()}\nPreferred time: ${preferredTime.trim() || "Anytime"}\nNotes: ${notes.trim() || "No additional notes."}`;
    openWhatsApp(COMMON_WHATSAPP_NUMBER, message);
    handleCancelRequest();
  };

  const renderProfessional = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.avatar} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rating}>{item.rating.toFixed(1)} ⭐</Text>
        </View>
        <Text style={styles.profession}>{item.profession}</Text>
        <Text style={styles.field}>{item.field}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>{item.experience} yrs exp</Text>
          <Text style={styles.metaText}>{item.rating.toFixed(1)} rating</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => setSelectedProfessional(item)}
          >
            <Text style={styles.profileBtnText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => handleMessage(item)}
          >
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.callBtn}
        onPress={() => handleRequestCall(item)}
      >
        <Ionicons name="call-outline" size={18} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Professional Support</Text>
            <Text style={styles.subtitle}>
              Therapists, counselors, and trusted care partners.
            </Text>
          </View>
        </View>

        <Image
          source={require("../../assets/images/bgphoto.webp")}
          style={styles.professionalHero}
        />

        <TouchableOpacity
          style={styles.checkInCard}
          onPress={handleQuickCheckIn}
        >
          <View>
            <Text style={styles.checkInLabel}>Quick 5 Minute Check-In</Text>
            <Text style={styles.checkInCopy}>
              Instant support through WhatsApp.
            </Text>
          </View>
          <Ionicons name="logo-whatsapp" size={28} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.joinCard} onPress={handleOpenJoinForm}>
          <View>
            <Text style={styles.joinLabel}>Get Listed as a Professional</Text>
            <Text style={styles.joinCopy}>
              Join our care network and get matched with clients.
            </Text>
          </View>
          <Ionicons
            name="person-add-outline"
            size={28}
            color={COLORS.sageGreen}
          />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialty, or field"
            placeholderTextColor="#9EA3AB"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.resultLabel}>
          {filteredProfessionals.length} specialists available
        </Text>

        <FlatList
          data={filteredProfessionals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfessional}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No professionals matched your search.
              </Text>
            </View>
          }
        />
      </View>

      <ProfessionalDetailCard
        visible={Boolean(selectedProfessional)}
        professional={selectedProfessional}
        onClose={() => setSelectedProfessional(null)}
        onMessage={handleMessage}
        onRequestCall={handleRequestCall}
      />

      <Modal
        visible={requestFormVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelRequest}
      >
        <View style={styles.formOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}
          >
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View>
                  <Text style={styles.formTitle}>Request a callback</Text>
                  <Text style={styles.formSubtitle}>
                    {requestProfessional
                      ? `from ${requestProfessional.name}`
                      : "Let us contact you shortly."}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.formClose}
                  onPress={handleCancelRequest}
                >
                  <Ionicons name="close" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#9EA3AB"
                value={requestForm.name}
                onChangeText={(value) => handleRequestFormChange("name", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#9EA3AB"
                keyboardType="phone-pad"
                value={requestForm.phone}
                onChangeText={(value) =>
                  handleRequestFormChange("phone", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Preferred callback time"
                placeholderTextColor="#9EA3AB"
                value={requestForm.preferredTime}
                onChangeText={(value) =>
                  handleRequestFormChange("preferredTime", value)
                }
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us what you need help with"
                placeholderTextColor="#9EA3AB"
                value={requestForm.notes}
                onChangeText={(value) =>
                  handleRequestFormChange("notes", value)
                }
                multiline
                numberOfLines={4}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={handleCancelRequest}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.submitButton]}
                  onPress={handleSubmitRequest}
                >
                  <Text style={styles.submitButtonText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        visible={listFormVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelJoin}
      >
        <View style={styles.formOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}
          >
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View>
                  <Text style={styles.formTitle}>Get Listed</Text>
                  <Text style={styles.formSubtitle}>
                    Submit your details to join our professional network.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.formClose}
                  onPress={handleCancelJoin}
                >
                  <Ionicons name="close" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#9EA3AB"
                value={listForm.name}
                onChangeText={(value) => handleListFormChange("name", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9EA3AB"
                keyboardType="email-address"
                autoCapitalize="none"
                value={listForm.email}
                onChangeText={(value) => handleListFormChange("email", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#9EA3AB"
                keyboardType="phone-pad"
                value={listForm.phone}
                onChangeText={(value) => handleListFormChange("phone", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Profession / title"
                placeholderTextColor="#9EA3AB"
                value={listForm.profession}
                onChangeText={(value) =>
                  handleListFormChange("profession", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Specialty / field"
                placeholderTextColor="#9EA3AB"
                value={listForm.field}
                onChangeText={(value) => handleListFormChange("field", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Years of experience"
                placeholderTextColor="#9EA3AB"
                keyboardType="numeric"
                value={listForm.experience}
                onChangeText={(value) =>
                  handleListFormChange("experience", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Website or profile link"
                placeholderTextColor="#9EA3AB"
                value={listForm.website}
                onChangeText={(value) => handleListFormChange("website", value)}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your practice"
                placeholderTextColor="#9EA3AB"
                value={listForm.message}
                onChangeText={(value) => handleListFormChange("message", value)}
                multiline
                numberOfLines={4}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={handleCancelJoin}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.submitButton]}
                  onPress={handleSubmitJoin}
                  disabled={listSubmitting}
                >
                  <Text style={styles.submitButtonText}>
                    {listSubmitting ? "Sending..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgGreen },
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  professionalHero: {
    width: "100%",
    height: 160,
    borderRadius: 24,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.sageGreen,
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "82%",
  },
  checkInCard: {
    backgroundColor: COLORS.sageGreen,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  checkInLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 6,
  },
  checkInCopy: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  joinCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E6EDE0",
  },
  joinLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.mainTextColor,
    marginBottom: 6,
  },
  joinCopy: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: "75%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: COLORS.textDark,
    fontSize: 16,
  },
  resultLabel: {
    marginBottom: 12,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  listContent: { paddingBottom: 32 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    flex: 1,
    marginRight: 10,
  },
  rating: { color: COLORS.sageGreen, fontWeight: "700" },
  profession: { color: COLORS.textMuted, fontSize: 14, marginBottom: 4 },
  field: { color: COLORS.textDark, fontSize: 13, marginBottom: 10 },
  cardMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaText: { color: COLORS.textMuted, fontSize: 12 },
  actionRow: { flexDirection: "row", marginTop: 12 },
  profileBtn: {
    backgroundColor: COLORS.bgGreen,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 10,
  },
  profileBtnText: { color: COLORS.sageGreen, fontWeight: "700" },
  messageBtn: {
    backgroundColor: COLORS.sageGreen,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  messageBtnText: { color: COLORS.white, fontWeight: "700" },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.sageGreen,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  emptyState: { paddingTop: 40, alignItems: "center" },
  emptyText: { color: COLORS.textMuted, fontSize: 15 },
  formOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  formCard: {
    backgroundColor: COLORS.warmNeutral,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  formSubtitle: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  formClose: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D9E2D6",
    marginBottom: 12,
    color: COLORS.textDark,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: COLORS.sageGreen,
  },
  cancelButtonText: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
