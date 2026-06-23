import { SlidersHorizontal, Star } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerScreenProps } from '../../types';

export function ReviewsRatingsScreen({ onBack }: TaskerScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Đánh giá & Nhận xét" subtitle="Uy tín từ khách hàng" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        <TaskerCard className="p-5 mb-4">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Đánh giá chung</Text>
          <View className="flex-row items-end gap-3 mb-5">
            <Text className="text-[#3525CD] text-[54px] font-extrabold leading-none">4.9</Text>
            <View className="mb-1">
              <Stars count={5} />
              <Text className="text-[#464555] text-[12px] mt-1">Dựa trên 124 đánh giá</Text>
            </View>
          </View>
          <RatingRow label="Đúng giờ" value="4.9" percent="98%" />
          <RatingRow label="Chất lượng" value="4.8" percent="96%" />
          <RatingRow label="Thái độ" value="5.0" percent="100%" />
        </TaskerCard>
        <View className="bg-[#4F46E5] rounded-xl p-5 mb-6">
          <Text className="text-white text-[20px] font-extrabold">Cộng đồng tin cậy</Text>
          <Text className="text-white/90 mt-2 leading-5">Hơn 95% khách hàng đã quay lại sử dụng dịch vụ của người thực hiện này.</Text>
          <TouchableOpacity className="bg-white rounded-lg py-3 items-center mt-4">
            <Text className="text-[#3525CD] font-extrabold">Đặt ngay</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#111C2D] text-[20px] font-extrabold">Nhận xét từ khách hàng</Text>
          <View className="flex-row items-center gap-2 bg-white border border-[#C7C4D8] px-3 py-2 rounded-full">
            <SlidersHorizontal size={16} color="#464555" />
            <Text className="text-[#111C2D] text-[12px] font-bold">Mới nhất</Text>
          </View>
        </View>
        <View className="gap-4">
          {mockTaskerData.reviews.map((review) => (
            <TaskerCard key={review.id} className="p-5">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-[#F0DBFF] items-center justify-center">
                    <Text className="text-[#831ADA] font-extrabold">{review.name.split(' ').slice(-1)[0].slice(0, 1)}</Text>
                  </View>
                  <View>
                    <Text className="text-[#111C2D] font-bold">{review.name}</Text>
                    <Stars count={review.rating} />
                  </View>
                </View>
                <Text className="text-[#777587] text-[12px]">{review.time}</Text>
              </View>
              <Text className="text-[#111C2D] leading-6 mb-3">{review.text}</Text>
              <View className="flex-row flex-wrap gap-2">
                {review.tags.map((tag) => <TaskerPill key={tag} tone="neutral">{tag}</TaskerPill>)}
              </View>
            </TaskerCard>
          ))}
          <TouchableOpacity className="py-4 border-2 border-dashed border-[#C7C4D8] rounded-xl items-center">
            <Text className="text-[#464555] font-bold">Xem thêm đánh giá</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={17} color={index < count ? '#FBBF24' : '#C7C4D8'} fill={index < count ? '#FBBF24' : 'transparent'} />
      ))}
    </View>
  );
}

function RatingRow({ label, value, percent }: { label: string; value: string; percent: `${number}%` }) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-[#111C2D] font-semibold">{label}</Text>
        <Text className="text-[#3525CD] font-extrabold">{value}</Text>
      </View>
      <View className="h-2 bg-[#DEE8FF] rounded-full overflow-hidden">
        <View className="h-full bg-[#3525CD] rounded-full" style={{ width: percent }} />
      </View>
    </View>
  );
}
