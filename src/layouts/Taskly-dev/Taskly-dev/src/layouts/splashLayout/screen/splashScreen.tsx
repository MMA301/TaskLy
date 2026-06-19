import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển trang sang Onboarding sau 2.5 giây
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={['#5B21B6', '#2E1065']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Brand Logo Container */}
        <View style={styles.logoWrapper}>
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.logoBox}
          >
            <Text style={styles.logoText}>M</Text>
            {/* Upper right dot inside logo */}
            <View style={styles.logoDot} />
          </LinearGradient>
        </View>

        {/* Brand Name */}
        <Text style={styles.brandTitle}>Taskly</Text>
      </View>

      {/* Footer Element */}
      <View style={styles.footer}>
        <View style={styles.boltCircle}>
          <Zap size={20} color="#FFF" />
        </View>
        <Text style={styles.footerText}>Kết nối việc nhanh, làm ngay tại chỗ</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFF',
  },
  logoDot: {
    position: 'absolute',
    top: 22,
    right: 22,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#818CF8',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 18,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  boltCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});