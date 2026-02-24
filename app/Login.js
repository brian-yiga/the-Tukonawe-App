import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import CustomButton from '../components/CustomButton';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: wire up real auth
    router.push('/goals');
  };

  return (
    <ImageBackground source={require('../assets/images/bgphoto.webp')} style={styles.backgroundImage} blurRadius={2}>
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Log In</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity onPress={() => router.push('/ForgotPassword')} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>

            <CustomButton title="Log In" onPress={handleLogin} />

            <TouchableOpacity onPress={() => router.push('/TermsOfUse')} style={{ marginTop: 8 }}>
              <Text style={styles.smallLink}>Terms & Privacy</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backText: { color: COLORS.secondaryColor, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: COLORS.mainColor, fontSize: 20, fontWeight: '700' },
  form: { marginTop: 150 },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, color: 'white' },
  smallLink: { color: COLORS.secondaryColor, fontSize: 12, textAlign: 'center' },
  forgotLink: { color: COLORS.secondaryColor, fontSize: 12, fontWeight: '600', marginBottom: 20 }
});
