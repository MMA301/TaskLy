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
    <View className="items-center mb-8">
      <View className="w-[88px] h-[88px] rounded-full bg-[#FFEDD5] items-center justify-center mb-4 border border-[#FED7AA]">
        <Building2 size={40} color="#EA580C" />
      </View>
      <Text className="text-[#111827] text-xl font-bold">
        {account.companyName || 'Khách hàng'}
      </Text>
      <Text className="text-[#4B5563] text-sm mt-1">
        {account.contactName || 'Người liên hệ'}
      </Text>
      <Text className="text-[#6B7280] text-[13px] mt-1.5">{account.email}</Text>
    </View>
  );
}
