import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Calendar 
} from 'lucide-react-native';

type AIPricingScreenProps = {
  route: any;
  navigation: any;
};

export default function AIPricingScreen({ route, navigation }: AIPricingScreenProps) {
  // Nhận dữ liệu truyền qua từ tham số Route của Navigation
  const { priceData } = route.params || {};

  const {
    recommendedPrice = 250000,
    rangeMin = 200000,
    rangeMax = 300000,
    complexity = 'Medium',
    complexityDesc = 'Độ phức tạp tiêu chuẩn cho công việc của bạn.',
    complexityPercent = 50,
    demand = 'High',
    demandDesc = 'Nhu cầu cao đối với loại hình công việc này.',
    distance = 3.2,
    distanceDesc = 'Khoảng cách thợ di chuyển trong khu vực.',
    marketTrend = [],
    jobTitle = 'Sửa máy lạnh',
    location = 'Quận 7'
  } = priceData || {};

  const maxTrendPrice = marketTrend.length > 0 ? Math.max(...marketTrend.map((t: any) => t.price)) : recommendedPrice;

  return (
    <View className="flex-1 bg-[#FFF7ED]">
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-white border-b border-[#FED7AA] flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={24} color="#EA580C" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1.5">
          <Sparkles size={18} color="#EA580C" fill="#EA580C" />
          <Text className="text-base font-bold text-[#111827]">Kết quả phân tích giá AI</Text>
        </View>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerClassName="p-4 pb-12 gap-4">
        {/* Banner tóm tắt công việc */}
        <View className="bg-gradient-to-r from-[#EA580C] to-[#F97316] rounded-xl p-4 shadow-sm">
          <Text className="text-[10px] text-white/80 font-bold uppercase tracking-wider">CÔNG VIỆC CỦA BẠN</Text>
          <Text className="text-sm font-bold text-white mt-1">{jobTitle}</Text>
          <Text className="text-[11px] text-white/90 mt-0.5">{location}</Text>
        </View>

        {/* Thẻ Giá khuyến nghị */}
        <View className="bg-white rounded-xl p-5 border border-[#FED7AA] items-center">
          <Text className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Mức giá khuyến nghị tối ưu nhất</Text>
          <Text className="text-3xl font-extrabold text-[#EA580C] mt-2">
            {recommendedPrice.toLocaleString('vi-VN')}đ
          </Text>
          <View className="bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mt-3 flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <Text className="text-[10px] text-emerald-700 font-bold">~94% thợ sẽ nhận việc ngay lập tức</Text>
          </View>

          {/* Range Slider Bar */}
          <View className="w-full mt-6">
            <View className="flex-row justify-between text-[11px] font-bold text-[#4B5563] mb-2">
              <Text>Thấp nhất: {rangeMin.toLocaleString('vi-VN')}đ</Text>
              <Text>Cao nhất: {rangeMax.toLocaleString('vi-VN')}đ</Text>
            </View>
            {/* Thanh đồ họa trượt giả lập trong React Native */}
            <View className="w-full h-3 bg-[#F3F4F6] rounded-full relative overflow-hidden border border-[#E5E7EB]">
              <View 
                className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full"
                style={{ width: '65%', marginLeft: '17%' }}
              />
            </View>
            <Text className="text-[10px] text-[#6B7280] text-center mt-3 font-medium leading-4">
              *Tăng giá trong khung đề xuất sẽ định vị công việc của bạn ưu tiên trên điện thoại của các thợ 5 sao gần nhất.
            </Text>
          </View>
        </View>

        {/* Các yếu tố phân tích chi tiết */}
        <View className="flex-row gap-3">
          {/* Cột trái: Độ phức tạp */}
          <View className="flex-1 bg-white rounded-xl p-4 border border-[#FED7AA] justify-between">
            <View>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[10px] font-bold text-[#6B7280] uppercase">Độ phức tạp</Text>
                <Text className="text-[11px] font-bold text-[#EA580C]">{complexity}</Text>
              </View>
              <Text className="text-[10px] text-[#4B5563] leading-4" numberOfLines={3}>
                {complexityDesc}
              </Text>
            </View>
            <View className="h-1.5 w-full bg-[#FFF7ED] rounded-full overflow-hidden mt-3">
              <View className="h-full bg-[#EA580C] rounded-full" style={{ width: `${complexityPercent}%` }} />
            </View>
          </View>

          {/* Cột phải: Mật độ nhu cầu */}
          <View className="flex-1 bg-white rounded-xl p-4 border border-[#FED7AA] justify-between">
            <View>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[10px] font-bold text-[#6B7280] uppercase">Nhu cầu thợ</Text>
                <Text className="text-[11px] font-bold text-[#EA580C]">{demand}</Text>
              </View>
              <Text className="text-[10px] text-[#4B5563] leading-4" numberOfLines={3}>
                {demandDesc}
              </Text>
            </View>
            <View className="h-1.5 w-full bg-[#FFF7ED] rounded-full overflow-hidden mt-3">
              <View className="h-full bg-[#EA580C] rounded-full" style={{ width: '85%' }} />
            </View>
          </View>
        </View>

        {/* Khoảng cách */}
        <View className="bg-white rounded-xl p-4 border border-[#FED7AA] flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-full bg-[#FFF7ED] items-center justify-center">
            <Compass size={18} color="#EA580C" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-[#111827]">Khoảng cách thợ gần nhất: {distance} km</Text>
            <Text className="text-[10px] text-[#6B7280] mt-0.5">{distanceDesc}</Text>
          </View>
        </View>

        {/* Biểu đồ xu hướng giá 7 ngày (Vẽ bằng View tự nhiên siêu nhẹ và chuẩn cho Mobile) */}
        <View className="bg-white rounded-xl p-4 border border-[#FED7AA]">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-1.5">
              <TrendingUp size={16} color="#EA580C" />
              <Text className="text-xs font-bold text-[#111827]">Biến động giá thị trường 7 ngày</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={12} color="#6B7280" />
              <Text className="text-[10px] text-[#6B7280] font-semibold">Tuần này</Text>
            </View>
          </View>

          {/* Trục biểu đồ */}
          <View className="flex-row justify-between items-end h-28 pt-2">
            {marketTrend.map((item: any, idx: number) => {
              const heightPercent = maxTrendPrice > 0 ? Math.max(25, Math.round((item.price / maxTrendPrice) * 100)) : 50;
              return (
                <View key={idx} className="items-center flex-1">
                  <Text className="text-[8px] font-bold text-[#6B7280] mb-1">
                    {Math.round(item.price / 1000)}k
                  </Text>
                  <View 
                    className={`w-3.5 rounded-t-sm ${
                      item.isToday 
                        ? 'bg-[#EA580C]' 
                        : 'bg-[#FED7AA]'
                    }`}
                    style={{ height: `${heightPercent * 0.6}%` }}
                  />
                  <Text className={`text-[9px] font-bold mt-2 ${item.isToday ? 'text-[#EA580C]' : 'text-[#6B7280]'}`}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Áp dụng giá trị đề xuất */}
        <TouchableOpacity 
          onPress={() => {
            // Quay lại trang tạo việc và điền giá gợi ý vào ngân sách tự động
            navigation.navigate('CreateJob', { applyPrice: recommendedPrice });
          }}
          className="w-full h-12 bg-[#EA580C] rounded-xl justify-center items-center shadow-md active:opacity-95 mt-2"
        >
          <Text className="text-white text-sm font-bold">Áp dụng giá AI này & Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}