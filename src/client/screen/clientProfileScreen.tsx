import React from 'react';
import { Text, View } from 'react-native';
import { Building2 } from 'lucide-react-native';
import type { AuthSession } from '../../session';

type ClientProfileScreenProps = {
  session: AuthSession;
};

export function ClientProfileScreen({ session }: ClientProfileScreenProps) {
  const account = session.account;

  return (
    <View style={{ alignItems: 'center', marginBottom: 32 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: '#FFEDD5',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#FED7AA',
        }}
      >
        <Building2 size={40} color="#EA580C" />
      </View>
      <Text style={{ color: '#111827', fontSize: 20, fontWeight: 'bold' }}>
        {account.companyName || 'Khách hàng'}
      </Text>
      <Text style={{ color: '#4B5563', fontSize: 14, marginTop: 4 }}>
        {account.contactName || 'Người liên hệ'}
      </Text>
      <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 6 }}>{account.email}</Text>
    </View>
  );
}
