import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react-native';

export type JobItem = {
  code: string;
  service: string;
  serviceColor: string;
  clientName: string;
  status: 'Hoàn thành' | 'Đang thực hiện' | 'Đã hủy';
  price: string;
};

type JobAnalyticsProps = {
  jobs: JobItem[];
  onViewJobDetail: (job: JobItem) => void;
};

export function JobAnalytics({ jobs, onViewJobDetail }: JobAnalyticsProps) {
  const [filter, setFilter] = useState<'All' | 'Hoàn thành' | 'Đang thực hiện' | 'Đã hủy'>('All');

  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter(j => j.status === filter);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10 gap-5"
    >
      {/* Sức khỏe Thị trường Card */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="mb-4">
          <Text className="text-[17px] font-bold text-slate-800">Sức khỏe Thị trường</Text>
          <Text className="text-[12px] text-slate-400 mt-0.5">Dữ liệu phân tích thời gian thực cho quản trị viên.</Text>
        </View>

        {/* 2x2 Grid of Metrics */}
        <View className="flex-row gap-3 mb-3">
          {/* Item 1 */}
          <View className="flex-1 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[11px] font-semibold text-slate-500">Tổng Công Việc</Text>
              <View className="bg-emerald-50 px-1.5 py-0.5 rounded flex-row items-center">
                <ArrowUpRight size={10} color="#10B981" />
                <Text className="text-[10px] text-emerald-600 font-bold ml-0.5">+12%</Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold text-slate-800">1,284</Text>
          </View>

          {/* Item 2 */}
          <View className="flex-1 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[11px] font-semibold text-slate-500">Giá Trị TB</Text>
              <View className="bg-emerald-50 px-1.5 py-0.5 rounded flex-row items-center">
                <ArrowUpRight size={10} color="#10B981" />
                <Text className="text-[10px] text-emerald-600 font-bold ml-0.5">+5.4%</Text>
              </View>
            </View>
            <Text className="text-[19px] font-extrabold text-slate-800">450.000đ</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          {/* Item 3 */}
          <View className="flex-1 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[11px] font-semibold text-slate-500">Người Dùng Mới</Text>
              <View className="bg-emerald-50 px-1.5 py-0.5 rounded flex-row items-center">
                <ArrowUpRight size={10} color="#10B981" />
                <Text className="text-[10px] text-emerald-600 font-bold ml-0.5">+8%</Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold text-slate-800">342</Text>
          </View>

          {/* Item 4 */}
          <View className="flex-1 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[11px] font-semibold text-slate-500">Tỷ Lệ Hủy</Text>
              <View className="bg-rose-50 px-1.5 py-0.5 rounded flex-row items-center">
                <ArrowDownRight size={10} color="#EF4444" />
                <Text className="text-[10px] text-rose-600 font-bold ml-0.5">-2%</Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold text-slate-800">4.1%</Text>
          </View>
        </View>
      </View>

      {/* Regional breakdown map of Vietnam */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50 flex-row gap-4 items-center">
        {/* Geographic Info (Left) */}
        <View className="flex-1 gap-3">
          <Text className="text-[15px] font-bold text-slate-800 mb-1">Phân bố địa lý</Text>
          
          {/* HCM */}
          <View>
            <View className="flex-row justify-between text-xs font-semibold mb-1">
              <Text className="text-slate-600 text-xs font-semibold">TP. Hồ Chí Minh</Text>
              <Text className="text-purple-600 text-xs font-extrabold">64%</Text>
            </View>
            <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-purple-600 rounded-full" style={{ width: '64%' }} />
            </View>
          </View>

          {/* HN */}
          <View>
            <View className="flex-row justify-between text-xs font-semibold mb-1">
              <Text className="text-slate-600 text-xs font-semibold">Hà Nội</Text>
              <Text className="text-purple-500 text-xs font-extrabold">28%</Text>
            </View>
            <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-purple-500 rounded-full" style={{ width: '28%' }} />
            </View>
          </View>

          {/* DN */}
          <View>
            <View className="flex-row justify-between text-xs font-semibold mb-1">
              <Text className="text-slate-600 text-xs font-semibold">Đà Nẵng</Text>
              <Text className="text-purple-400 text-xs font-extrabold">8%</Text>
            </View>
            <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-purple-400 rounded-full" style={{ width: '8%' }} />
            </View>
          </View>
        </View>

        {/* Vietnam Map Image (Right) */}
        <View className="w-[110px] h-[150px] bg-slate-50 rounded-xl overflow-hidden items-center justify-center p-1 border border-slate-100">
          <Image 
            source={require('../../../../assets/images/vietnam_map.png')} 
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Jobs/Orders List Table */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[15px] font-bold text-slate-800">Danh sách công việc</Text>
          <View className="bg-slate-50 border border-slate-100 rounded-full p-1.5">
            <RefreshCw size={13} color="#64748B" />
          </View>
        </View>

        {/* Filter Quick Pills */}
        <View className="flex-row gap-1.5 mb-4">
          {(['All', 'Hoàn thành', 'Đang thực hiện', 'Đã hủy'] as const).map((t) => (
            <TouchableOpacity 
              key={t}
              onPress={() => setFilter(t)}
              className={`px-3 py-1 rounded-full border ${
                filter === t 
                  ? 'bg-purple-600 border-purple-600' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-[11px] font-bold ${
                filter === t ? 'text-white' : 'text-slate-600'
              }`}>
                {t === 'All' ? 'Tất cả' : t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table representation */}
        <View className="border border-slate-100 rounded-xl overflow-hidden">
          {/* Header Row */}
          <View className="flex-row bg-slate-50 py-3 px-3 border-b border-b-slate-100">
            <Text className="text-[10px] font-extrabold text-slate-400 w-[18%]">MÃ ĐƠN</Text>
            <Text className="text-[10px] font-extrabold text-slate-400 w-[24%]">DỊCH VỤ</Text>
            <Text className="text-[10px] font-extrabold text-slate-400 w-[22%]">NGƯỜI THUÊ</Text>
            <Text className="text-[10px] font-extrabold text-slate-400 w-[20%]">TRẠNG THÁI</Text>
            <Text className="text-[10px] font-extrabold text-slate-400 w-[16%] text-right">GIÁ</Text>
          </View>

          {/* Data Rows */}
          {filteredJobs.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-slate-400 text-xs">Không có dữ liệu phù hợp.</Text>
            </View>
          ) : (
            filteredJobs.map((job, index) => (
              <TouchableOpacity 
                key={job.code} 
                onPress={() => onViewJobDetail(job)}
                className={`flex-row py-3.5 px-3 items-center border-b border-b-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                }`}
              >
                {/* code */}
                <Text className="text-[11px] font-bold text-slate-500 w-[18%]">{job.code}</Text>

                {/* service */}
                <View className="w-[24%] pr-1 flex-row">
                  <View 
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${job.serviceColor}15` }}
                  >
                    <Text 
                      className="text-[10px] font-bold"
                      style={{ color: job.serviceColor }}
                      numberOfLines={1}
                    >
                      {job.service}
                    </Text>
                  </View>
                </View>

                {/* client */}
                <Text className="text-[11px] font-medium text-slate-700 w-[22%] pr-1" numberOfLines={1}>
                  {job.clientName}
                </Text>

                {/* status */}
                <Text 
                  className={`text-[11px] font-bold w-[20%] ${
                    job.status === 'Hoàn thành' 
                      ? 'text-emerald-500' 
                      : job.status === 'Đang thực hiện'
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                >
                  {job.status}
                </Text>

                {/* price */}
                <Text className="text-[11px] font-extrabold text-slate-800 w-[16%] text-right">
                  {job.price}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
