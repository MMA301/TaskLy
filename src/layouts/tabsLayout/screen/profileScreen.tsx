import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1A102F', paddingTop: 64, paddingHorizontal: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: '#2A1D45',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name="person" size={40} color="#8B5CF6" />
        </View>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Tài khoản</Text>
        <Text style={{ color: '#A78BFA', fontSize: 14, marginTop: 4 }}>
          Hồ sơ người dùng demo
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#2A1D45',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#F87171" />
        <Text style={{ color: '#F87171', fontWeight: 'bold', fontSize: 16 }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
