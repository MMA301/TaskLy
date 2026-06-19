import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Sparkles, TrendingUp, Clock, Compass, ArrowRight } from 'lucide-react-native';

export function AIPerformance() {
  const predictions = [
    { day: 'T2', amount: 350 },
    { day: 'T3', amount: 480 },
    { day: 'T4', amount: 620 },
    { day: 'T5', amount: 500 },
    { day: 'T6', amount: 720 },
    { day: 'T7', amount: 950 },
    { day: 'CN', amount: 880 },
  ];

  const maxPredict = Math.max(...predictions.map(p => p.amount));

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10 gap-5"
    >
      {/* Header Sparkles */}
      <View className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex-row items-center gap-3">
        <View className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center">
          <Sparkles size={20} color="#FFF" />
        </View>
        <View className="flex-1">
          <Text className="text-slate-800 text-[14px] font-bold">Trợ lý AI Taskly</Text>
          <Text className="text-slate-500 text-[12px] leading-relaxed">
            AI của chúng tôi đã phân tích hiệu suất hệ thống và hoạt động tuần qua.
          </Text>
        </View>
      </View>

      {/* Income prediction card */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-slate-400 text-[11px] font-semibold">DỰ BÁO THU NHẬP</Text>
            <Text className="text-slate-800 text-xl font-extrabold mt-0.5">Tuần tới: ~4.500.000đ</Text>
          </View>
          <View className="bg-indigo-50 p-2.5 rounded-full">
            <TrendingUp size={18} color="#4F46E5" />
          </View>
        </View>
        <Text className="text-[12px] text-slate-500 leading-relaxed mb-5">
          Dựa trên xu hướng thị trường và lịch sử đơn hàng của bạn, thu nhập có thể tăng 15% so với tuần trước.
        </Text>

        {/* Prediction trend chart line simulation */}
        <View className="flex-row justify-between items-end h-[80px] px-2 mb-2">
          {predictions.map((p, index) => {
            const hPercentage = (p.amount / maxPredict) * 100;
            return (
              <View key={index} className="items-center gap-1.5" style={{ width: '10%' }}>
                <View className="w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white absolute shadow shadow-black" style={{ bottom: hPercentage * 0.7 }} />
                <View className="w-[1.5px] bg-indigo-100 h-full" />
                <Text className="text-[10px] text-slate-400 font-medium">{p.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Point Efficiency Card */}
      <View className="bg-purple-700 rounded-2xl p-6 items-center shadow-lg shadow-purple-900/10">
        <Text className="text-purple-100 text-xs font-bold tracking-wider mb-4">ĐIỂM HIỆU QUẢ</Text>
        
        {/* Big circular score */}
        <View className="w-[100px] h-[100px] rounded-full border-4 border-purple-500 items-center justify-center bg-purple-800 mb-4 shadow">
          <Text className="text-white text-[38px] font-extrabold">92</Text>
        </View>
        
        <Text className="text-white text-[16px] font-bold">Xuất sắc</Text>
        <Text className="text-purple-100 text-xs text-center mt-2 px-4 leading-relaxed">
          Hệ thống ghi nhận bạn nhanh hơn 12% so với các Tasker khác trong khu vực.
        </Text>
      </View>

      {/* Top categories breakdown */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <Text className="text-[15px] font-bold text-slate-800 mb-4">Danh mục hàng đầu</Text>
        
        <View className="flex-row items-center gap-6">
          {/* Visual Donut representation */}
          <View className="w-[110px] h-[110px] items-center justify-center relative">
            {/* Simple simulated rings stacked */}
            <View className="w-full h-full rounded-full border-[10px] border-slate-100 items-center justify-center">
              <View className="w-[85%] h-[85%] rounded-full border-[10px] border-purple-600 items-center justify-center absolute">
                <View className="w-[80%] h-[80%] rounded-full border-[10px] border-blue-500 items-center justify-center absolute">
                  <Text className="text-slate-800 text-lg font-bold">65%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Legend breakdown list */}
          <View className="flex-1 gap-2.5">
            {/* Category 1 */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <Text className="text-slate-600 text-xs font-bold">Dọn dẹp</Text>
              </View>
              <Text className="text-slate-800 font-extrabold text-xs">2.8M</Text>
            </View>

            {/* Category 2 */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <Text className="text-slate-600 text-xs font-bold">Giao hàng</Text>
              </View>
              <Text className="text-slate-800 font-extrabold text-xs">1.2M</Text>
            </View>

            {/* Category 3 */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <Text className="text-slate-600 text-xs font-bold">Sửa chữa</Text>
              </View>
              <Text className="text-slate-800 font-extrabold text-xs">0.5M</Text>
            </View>
          </View>
        </View>
      </View>

      {/* AI Recommendations */}
      <View className="gap-3">
        <Text className="text-[15px] font-bold text-slate-800 px-1">Gợi ý từ AI</Text>

        {/* Suggestion Card 1 */}
        <View className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex-row gap-3.5">
          <View className="w-10 h-10 bg-indigo-500 rounded-xl items-center justify-center shadow shadow-indigo-200">
            <Clock size={20} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 text-sm font-bold">Giờ cao điểm sắp tới</Text>
            <Text className="text-slate-500 text-xs mt-1 leading-relaxed">
              Nhu cầu dọn dẹp tại Quận 1 tăng cao vào 9:00 sáng Thứ Bảy.
            </Text>
          </View>
        </View>

        {/* Suggestion Card 2 */}
        <View className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex-row gap-3.5">
          <View className="w-10 h-10 bg-purple-500 rounded-xl items-center justify-center shadow shadow-purple-200">
            <Compass size={20} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 text-sm font-bold">Tăng thu nhập</Text>
            <Text className="text-slate-500 text-xs mt-1 leading-relaxed">
              Nhận thêm 2 đơn giao hàng ngắn để tối ưu quãng đường di chuyển.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Banner */}
      <View className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden flex-row justify-between items-center">
        <View className="flex-1 pr-3">
          <Text className="text-white text-base font-bold">Sẵn sàng làm việc?</Text>
          <Text className="text-slate-400 text-xs mt-1">
            Có 15 công việc mới phù hợp với kỹ năng của bạn.
          </Text>
        </View>
        <TouchableOpacity className="bg-white px-4 py-2.5 rounded-xl flex-row items-center gap-1.5">
          <Text className="text-slate-950 text-xs font-bold">Xem ngay</Text>
          <ArrowRight size={14} color="#000" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
