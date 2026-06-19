import React from 'react';
import { Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import type { AuthSession } from '../../session';

type AdminProfileScreenProps = {
  session: AuthSession;
};

export function AdminProfileScreen({ session }: AdminProfileScreenProps) {
  const account = session.account;
  const displayName = account.name || account.username || 'Admin';

  return (
    <View style={{ alignItems: 'center', marginBottom: 32 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: '#1F2937',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#374151',
        }}
      >
        <Shield size={40} color="#38BDF8" />
      </View>
      <Text style={{ color: '#F9FAFB', fontSize: 20, fontWeight: 'bold' }}>{displayName}</Text>
      <Text style={{ color: '#CBD5E1', fontSize: 14, marginTop: 4 }}>
        {session.role === 'staff' ? 'Tài khoản nhân viên' : 'Tài khoản quản trị'}
      </Text>
      <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 6 }}>{account.email}</Text>
    </View>
  );
}
