import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";

export default function CustomButton({
  title,
  onPress,
  type = "primary",
  disabled = false,
}) {
  const getStyle = () => {
    if (disabled) return styles.disabled;
    if (type === "sos") return styles.sos;
    if (type === "outline") return styles.outline;
    return styles.primary;
  };

  return (
    <TouchableOpacity
      style={[styles.btn, getStyle()]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  primary: { backgroundColor: COLORS.primary },
  outline: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sos: { backgroundColor: COLORS.error },
  disabled: { backgroundColor: "rgba(255, 255, 255, 0.3)" },
  text: { color: "white", fontSize: 16, fontWeight: "400" },
  disabledText: { opacity: 0.6 },
});
