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
    <View className="flex-1 bg-[#FFF7ED]">
      <ScrollView contentContainerClassName="p-6 pt-16 gap-4">
        <View>
          <Text className="text-[#EA580C] text-[16px]">Cổng khách hàng</Text>
          <Text className="text-[#111827] text-3xl font-bold">
            {account.companyName || 'Taskly Client'}
          </Text>
          <Text className="text-[#6B7280] text-sm mt-1">
            Người liên hệ: {account.contactName || account.email}
          </Text>
        </View>

        <View className="bg-white rounded-xl p-5 gap-2 border border-[#FED7AA]">
          <View className="flex-row items-center gap-3">
            <View className="mr-1">
              <Briefcase size={24} color="#EA580C" />
            </View>
            <Text className="text-[#111827] text-lg font-bold">
              Không gian dự án
            </Text>
          </View>
          <Text className="text-[#4B5563] text-sm">
            Xem tiến độ đơn hàng, yêu cầu hỗ trợ và thông báo dành riêng cho doanh nghiệp.
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-[#0EA5E9] rounded-xl p-4">
            <Receipt size={22} color="#E0F2FE" />
            <Text className="text-white text-2xl font-bold mt-3">
              {account.totalOrders ?? 0}
            </Text>
            <Text className="text-[#E0F2FE] text-[13px]">Tổng đơn hàng</Text>
          </View>

          <View className="flex-1 bg-[#F97316] rounded-xl p-4">
            <Star size={22} color="#FFEDD5" />
            <Text className="text-white text-2xl font-bold mt-3">
              {account.tier || 'Demo'}
            </Text>
            <Text className="text-[#FFEDD5] text-[13px]">Gói dịch vụ</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-5 flex-row items-center gap-4 border border-[#FED7AA]">
          <View className="w-12 h-12 rounded-full bg-[#FFEDD5] items-center justify-center">
            <Bell size={24} color="#EA580C" />
          </View>
          <View className="flex-1">
            <Text className="text-[#111827] text-[16px] font-semibold">
              Thông báo khách hàng
            </Text>
            <Text className="text-[#6B7280] text-[13px] mt-1">
              Chưa có thông báo mới trong tài khoản demo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
