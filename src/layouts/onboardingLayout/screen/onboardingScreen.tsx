import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A0B2E', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 10 }}>
        Kết nối thông minh bằng AI
      </Text>
      <Text style={{ fontSize: 16, color: '#A78BFA', textAlign: 'center', marginBottom: 40 }}>
        Quản lý công việc và tối ưu hiệu suất hàng ngày của bạn cùng Taskly.
      </Text>
      <TouchableOpacity 
        onPress={() => router.replace('/login')}
        style={{ backgroundColor: '#8B5CF6', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 }}
      >
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Bắt đầu ngay</Text>
      </TouchableOpacity>
    </View>
  );
}