import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function CustomButton({ title, onPress, type = 'primary' }) {
  const getStyle = () => {
    if (type === 'sos') return styles.sos;
    if (type === 'outline') return styles.outline;
    return styles.primary;
  };

  return (
    <TouchableOpacity style={[styles.btn, getStyle()]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 15, width: '100%' },
  primary: { backgroundColor: COLORS.primary },
  outline: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: COLORS.border },
  sos: { backgroundColor: COLORS.error },
  text: { color: 'white', fontSize: 16, fontWeight: '400' }
});