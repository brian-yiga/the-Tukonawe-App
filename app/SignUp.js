import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { COLORS } from '../constants/colors';
import CustomButton from '../components/CustomButton';
import { auth } from '../config/firebaseConfig';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      Alert.alert(
        'Sign Up Successful',
        'Please check your email to verify your account before logging in.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/Login'),
          },
        ]
      );
    } catch (err) {
      let errorMessage = 'Sign up failed';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 50 }} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
              editable={!loading}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <CustomButton title={loading ? 'Creating Account...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />

            <View style={styles.signInPrompt}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/Login')}>
                <Text style={[styles.signInText, { color: COLORS.secondaryColor, fontWeight: '600' }]}>Log In</Text>
              </TouchableOpacity>
            </View>
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
  form: { marginTop: 100 },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, color: 'white', marginBottom: 4 },
  errorText: { color: '#ff6b6b', fontSize: 12, marginBottom: 16, paddingHorizontal: 4 },
  signInPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  signInText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
});
