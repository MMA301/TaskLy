import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AuthSession } from '../../session';

type AdminHomeScreenProps = {
  session: AuthSession;
};

export function AdminHomeScreen({ session }: AdminHomeScreenProps) {
  const account = session.account;
  const displayName = account.name || account.username || account.email || 'Admin';
  const roleLabel = session.role === 'staff' ? 'Nhân viên vận hành' : 'Quản trị hệ thống';

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64, gap: 16 }}>
        <View>
          <Text style={{ color: '#38BDF8', fontSize: 16 }}>{roleLabel}</Text>
          <Text style={{ color: '#F9FAFB', fontSize: 28, fontWeight: 'bold' }}>
            Xin chào, {displayName}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#1F2937',
            borderRadius: 12,
            padding: 20,
            gap: 8,
            borderWidth: 1,
            borderColor: '#374151',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="analytics" size={24} color="#38BDF8" />
            <Text style={{ color: '#F9FAFB', fontSize: 18, fontWeight: '700' }}>
              Bảng điều khiển
            </Text>
          </View>
          <Text style={{ color: '#CBD5E1', fontSize: 14 }}>
            Theo dõi người dùng, khách hàng, báo cáo và trạng thái vận hành Taskly.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#0F766E', borderRadius: 12, padding: 16 }}>
            <Ionicons name="people" size={22} color="#CCFBF1" />
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
              3
            </Text>
            <Text style={{ color: '#CCFBF1', fontSize: 13 }}>Nhân viên demo</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: '#7C3AED', borderRadius: 12, padding: 16 }}>
            <Ionicons name="business" size={22} color="#EDE9FE" />
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
              2
            </Text>
            <Text style={{ color: '#EDE9FE', fontSize: 13 }}>Khách hàng demo</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#1F2937',
            borderRadius: 12,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderWidth: 1,
            borderColor: '#374151',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#111827',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="shield-checkmark" size={24} color="#34D399" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#F9FAFB', fontSize: 16, fontWeight: '600' }}>
              Quyền truy cập
            </Text>
            <Text style={{ color: '#CBD5E1', fontSize: 13, marginTop: 4 }}>
              {account.role || 'admin'} đang dùng dữ liệu local demo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
