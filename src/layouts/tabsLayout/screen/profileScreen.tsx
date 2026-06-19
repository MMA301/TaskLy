import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { AdminProfileScreen } from '../../../admin';
import { ClientProfileScreen } from '../../../client';
import { clearAuthSession, getAuthSession } from '../../../session';

export function ProfileScreen() {
  const router = useRouter();
  const session = getAuthSession();
  const isClient = session?.role === 'client';

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          clearAuthSession();
          router.replace('/login');
        },
      },
    ]);
  };

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A102F', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
          Bạn chưa đăng nhập
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          style={{
            backgroundColor: '#8B5CF6',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isClient ? '#FFF7ED' : '#111827',
        paddingTop: 64,
        paddingHorizontal: 24,
      }}
    >
      {isClient ? (
        <ClientProfileScreen session={session} />
      ) : (
        <AdminProfileScreen session={session} />
      )}

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: isClient ? '#FFFFFF' : '#1F2937',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          borderWidth: 1,
          borderColor: isClient ? '#FED7AA' : '#374151',
        }}
      >
        <LogOut size={20} color="#F87171" />
        <Text style={{ color: '#F87171', fontWeight: 'bold', fontSize: 16 }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
