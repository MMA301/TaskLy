import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Briefcase, Receipt, Star, Bell } from 'lucide-react-native';
import type { AuthSession } from '../../session';

type ClientHomeScreenProps = {
  session: AuthSession;
};

export function ClientHomeScreen({ session }: ClientHomeScreenProps) {
  const account = session.account;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64, gap: 16 }}>
        <View>
          <Text style={{ color: '#EA580C', fontSize: 16 }}>Cổng khách hàng</Text>
          <Text style={{ color: '#111827', fontSize: 28, fontWeight: 'bold' }}>
            {account.companyName || 'Taskly Client'}
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
            Người liên hệ: {account.contactName || account.email}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            gap: 8,
            borderWidth: 1,
            borderColor: '#FED7AA',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Briefcase size={24} color="#EA580C" />
            <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700' }}>
              Không gian dự án
            </Text>
          </View>
          <Text style={{ color: '#4B5563', fontSize: 14 }}>
            Xem tiến độ đơn hàng, yêu cầu hỗ trợ và thông báo dành riêng cho doanh nghiệp.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#0EA5E9', borderRadius: 12, padding: 16 }}>
            <Receipt size={22} color="#E0F2FE" />
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
              {account.totalOrders ?? 0}
            </Text>
            <Text style={{ color: '#E0F2FE', fontSize: 13 }}>Tổng đơn hàng</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: '#F97316', borderRadius: 12, padding: 16 }}>
            <Star size={22} color="#FFEDD5" />
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
              {account.tier || 'Demo'}
            </Text>
            <Text style={{ color: '#FFEDD5', fontSize: 13 }}>Gói dịch vụ</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderWidth: 1,
            borderColor: '#FED7AA',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#FFEDD5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={24} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>
              Thông báo khách hàng
            </Text>
            <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>
              Chưa có thông báo mới trong tài khoản demo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
