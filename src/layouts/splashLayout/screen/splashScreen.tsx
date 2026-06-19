import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển trang sang Onboarding sau 2.5 giây
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A0B2E' }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#FFF', marginBottom: 20 }}>TASKLY</Text>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}