import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TrendingUp, Users, Briefcase, Check, Eye } from 'lucide-react-native';

export type SystemAlert = {
  id: string;
  type: 'report' | 'verify';
  title: string;
  description: string;
  targetId: string;
};

type SystemOverviewProps = {
  alerts: SystemAlert[];
  onApproveAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
  onViewTask: (taskCode: string) => void;
  gvmTotal: string;
  activeWorkers: number;
  totalJobs: number;
};

export function SystemOverview({
  alerts,
  onApproveAlert,
  onDismissAlert,
  onViewTask,
  gvmTotal,
  activeWorkers,
  totalJobs,
}: SystemOverviewProps) {
  // Mock data for weekly revenue (T2 to CN)
  const revenueData = [
    { day: 'T2', amount: 150 },
    { day: 'T3', amount: 230 },
    { day: 'T4', amount: 180 },
    { day: 'T5', amount: 320 },
    { day: 'T6', amount: 280 },
    { day: 'T7', amount: 450 },
    { day: 'CN', amount: 380 },
  ];

  const maxAmount = Math.max(...revenueData.map((d) => d.amount));

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10 gap-5"
    >
      {/* System Overview Header Stats */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[17px] font-bold text-slate-800">Tổng quan hệ thống</Text>
          <View className="bg-purple-50 px-3 py-1 rounded-full">
            <Text className="text-[12px] font-semibold text-purple-700">Hôm nay</Text>
          </View>
        </View>

        {/* Total GMV Card */}
        <View className="bg-purple-600 rounded-xl p-4 mb-4 relative overflow-hidden">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-purple-200 text-xs font-medium">Tổng GMV</Text>
              <Text className="text-white text-3xl font-extrabold mt-1">{gvmTotal} VNĐ</Text>
            </View>
            <View className="bg-white/10 px-2 py-0.5 rounded flex-row items-center gap-1">
              <TrendingUp size={12} color="#FFF" />
              <Text className="text-white text-[11px] font-bold">-12%</Text>
            </View>
          </View>
        </View>

        {/* Small stats grid */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-emerald-50 items-center justify-center">
              <Users size={20} color="#10B981" />
            </View>
            <View>
              <Text className="text-slate-400 text-[11px] font-semibold">Người làm</Text>
              <Text className="text-slate-800 text-lg font-bold">{activeWorkers.toLocaleString()}</Text>
            </View>
          </View>

          <View className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center">
              <Briefcase size={20} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-slate-400 text-[11px] font-semibold">Công việc</Text>
              <Text className="text-slate-800 text-lg font-bold">{totalJobs.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Completion Rate Card */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[15px] font-bold text-slate-800">Tỷ lệ hoàn thành</Text>
          <Text className="text-purple-600 text-lg font-extrabold">94.2%</Text>
        </View>
        <View className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <View className="h-full bg-purple-600 rounded-full" style={{ width: '94.2%' }} />
        </View>
      </View>

      {/* Revenue growth bar chart */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-[15px] font-bold text-slate-800">Tăng trưởng doanh thu</Text>
          <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Text className="text-[12px] text-slate-600 font-medium">7 ngày qua</Text>
          </View>
        </View>

        {/* Simple visual bar chart using Views */}
        <View className="flex-row justify-between items-end h-[120px] px-2">
          {revenueData.map((item, index) => {
            const barHeight = (item.amount / maxAmount) * 90; // percentage height (max 90%)
            return (
              <View key={index} className="items-center gap-2" style={{ width: '10%' }}>
                <Text className="text-[9px] text-slate-400 font-semibold">{item.amount}k</Text>
                <View 
                  className="w-full bg-purple-600 rounded-t-md" 
                  style={{ height: `${barHeight}%` }} 
                />
                <Text className="text-xs text-slate-500 font-medium">{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Urgent alerts section */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row items-center gap-2 mb-4">
          <Text className="text-[15px] font-bold text-slate-800">Thông báo khẩn</Text>
          {alerts.length > 0 && (
            <View className="bg-red-500 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">{alerts.length}</Text>
            </View>
          )}
        </View>

        {alerts.length === 0 ? (
          <View className="items-center py-6">
            <Check size={32} color="#10B981" />
            <Text className="text-slate-400 text-sm mt-2 font-medium">Không có cảnh báo khẩn cấp nào!</Text>
          </View>
        ) : (
          <View className="gap-4">
            {alerts.map((alert) => (
              <View 
                key={alert.id} 
                className={`p-4 rounded-xl border ${
                  alert.type === 'report' 
                    ? 'bg-rose-50/50 border-rose-100' 
                    : 'bg-indigo-50/50 border-indigo-100'
                }`}
              >
                <View className="flex-row items-start justify-between gap-2 mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className={`w-2 h-2 rounded-full ${alert.type === 'report' ? 'bg-red-500' : 'bg-indigo-600'}`} />
                    <Text className="text-[14px] font-bold text-slate-800">{alert.title}</Text>
                  </View>
                  <Text className="text-[11px] font-medium text-slate-400">{alert.targetId}</Text>
                </View>
                
                <Text className="text-[13px] text-slate-600 leading-relaxed mb-3">
                  {alert.description}
                </Text>

                {/* Actions */}
                <View className="flex-row gap-2">
                  {alert.type === 'report' ? (
                    <>
                      <TouchableOpacity 
                        onPress={() => onViewTask(alert.targetId)}
                        className="bg-rose-600 px-4 py-2 rounded-lg flex-row items-center gap-1.5 shadow-sm shadow-rose-600/10"
                      >
                        <Eye size={14} color="#FFF" />
                        <Text className="text-white text-xs font-bold">Xem ngay</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => onDismissAlert(alert.id)}
                        className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-slate-600 text-xs font-bold">Bỏ qua</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity 
                        onPress={() => onApproveAlert(alert.id)}
                        className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-1.5 shadow-sm shadow-purple-600/10"
                      >
                        <Check size={14} color="#FFF" />
                        <Text className="text-white text-xs font-bold">Phê duyệt</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => onDismissAlert(alert.id)}
                        className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-slate-600 text-xs font-bold">Bỏ qua</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity className="mt-4 py-2 items-center">
          <Text className="text-purple-600 font-bold text-xs">Xem tất cả thông báo &gt;</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
