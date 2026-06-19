import React from 'react';
import { Text, View } from 'react-native';
import { Shield, Key, Clock, Award } from 'lucide-react-native';
import type { AuthSession } from '../../../session';

type AdminProfileScreenProps = {
  session: AuthSession;
};

export function AdminProfileScreen({ session }: AdminProfileScreenProps) {
  const account = session.account;
  const displayName = account.name || account.username || 'Admin';
  
  // Format role label
  const roleLabel = session.role === 'staff' ? 'Nhân viên vận hành' : 'Quản trị hệ thống';
  
  // Format permission list
  const permissions = account.permissions || ['all'];

  return (
    <View className="gap-5 mb-6">
      {/* Profile Card */}
      <View className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-100/50 items-center">
        <View className="w-[90px] h-[90px] rounded-full bg-purple-50 items-center justify-center mb-4 border border-purple-100">
          <Shield size={44} color="#7C3AED" />
        </View>
        <Text className="text-slate-800 text-xl font-bold">{displayName}</Text>
        <Text className="text-purple-600 text-sm font-semibold mt-1">
          {roleLabel}
        </Text>
        <Text className="text-slate-400 text-xs mt-1.5">{account.email}</Text>
      </View>

      {/* Admin Details Section */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50 gap-4">
        <Text className="text-[15px] font-bold text-slate-800 pb-2 border-b border-b-slate-100">
          Thông tin bảo mật
        </Text>

        {/* Admin ID */}
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center border border-slate-100">
            <Key size={16} color="#64748B" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-[10px] font-bold">MÃ QUẢN TRỊ</Text>
            <Text className="text-slate-700 text-sm font-bold mt-0.5">{account.id || 'N/A'}</Text>
          </View>
        </View>

        {/* Login Time */}
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center border border-slate-100">
            <Clock size={16} color="#64748B" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-[10px] font-bold">ĐĂNG NHẬP LẦN CUỐI</Text>
            <Text className="text-slate-700 text-sm font-semibold mt-0.5">20/10/2023 15:30 (Vương Quốc Anh)</Text>
          </View>
        </View>

        {/* Permissions */}
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center border border-slate-100">
            <Award size={16} color="#64748B" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-[10px] font-bold">QUYỀN TRUY CẬP</Text>
            <View className="flex-row flex-wrap gap-1 mt-1">
              {permissions.map((perm: string) => (
                <View key={perm} className="bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  <Text className="text-[10px] font-bold text-purple-700">{perm}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
