import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';

export default function TermsOfUse() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/bgphoto.webp')}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Privacy</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Terms of Use</Text>
            <Text style={styles.sectionText}>
              Welcome to TUKONAWE. These terms of use apply to your use of our application and services. By accessing and using TUKONAWE, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>

            <Text style={styles.subsectionTitle}>Use License</Text>
            <Text style={styles.sectionText}>
              Permission is granted to temporarily download one copy of the materials (information or software) on TUKONAWE for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </Text>
            <Text style={styles.listItem}>• Modifying or copying the materials</Text>
            <Text style={styles.listItem}>• Using the materials for any commercial purpose</Text>
            <Text style={styles.listItem}>• Attempting to decompile or reverse engineering any software</Text>
            <Text style={styles.listItem}>• Removing any copyright or other proprietary notations</Text>
            <Text style={styles.listItem}>• Transferring the materials to another person or "mirroring" the materials</Text>

            <Text style={styles.subsectionTitle}>Disclaimer</Text>
            <Text style={styles.sectionText}>
              The materials on TUKONAWE are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Text>

            <Text style={styles.sectionTitle}>Privacy Policy</Text>
            <Text style={styles.sectionText}>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our application.
            </Text>

            <Text style={styles.subsectionTitle}>Information We Collect</Text>
            <Text style={styles.sectionText}>
              We may collect information about you in a variety of ways. The information we may collect on the application includes:
            </Text>
            <Text style={styles.listItem}>• Personal data such as name, email address, and phone number</Text>
            <Text style={styles.listItem}>• Device information and usage data</Text>
            <Text style={styles.listItem}>• Location information (with your permission)</Text>
            <Text style={styles.listItem}>• Health and wellness information you voluntarily provide</Text>

            <Text style={styles.subsectionTitle}>How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to personalize your experience, deliver the services you request, send periodic emails, and improve our app based on your feedback.
            </Text>

            <Text style={styles.subsectionTitle}>Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </Text>

            <Text style={styles.subsectionTitle}>Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Use or Privacy Policy, please contact us at support@tukonawe.com
            </Text>

            <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { color: COLORS.secondaryColor, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: COLORS.mainColor, fontSize: 20, fontWeight: '700' },
  scrollContainer: { flex: 1, paddingHorizontal: 20 },
  content: { paddingBottom: 30 },
  sectionTitle: { color: COLORS.mainColor, fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  subsectionTitle: { color: COLORS.secondaryColor, fontSize: 14, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  sectionText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  listItem: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 11, lineHeight: 16, marginLeft: 10, marginBottom: 5 },
  lastUpdated: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, textAlign: 'center', marginTop: 30, marginBottom: 10 }
});
