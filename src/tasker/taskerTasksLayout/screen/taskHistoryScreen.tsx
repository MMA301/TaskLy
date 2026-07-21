import { Banknote, CalendarDays, Package, Search, ShoppingBasket, Wrench, Briefcase, Star, X, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerScreenProps } from '../../types';

const iconMap = { cleaning: Briefcase, delivery: Package, repair: Wrench, shopping: ShoppingBasket };

export function TaskHistoryScreen({ onBack }: TaskerScreenProps) {
  const [ratingModalVisible, setRatingModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [stars, setStars] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('Khách hàng rất thân thiện, chuẩn bị sẵn đồ nghề và thanh toán đúng hạn!');

  const handleOpenRating = (item: any) => {
    setSelectedTask(item);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = () => {
    Alert.alert('Thành công', `Đã gửi đánh giá ${stars} sao cho Khách hàng!`);
    setRatingModalVisible(false);
  };

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Lịch sử công việc" subtitle="Theo dõi thu nhập và yêu cầu đã thực hiện" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        <TaskerCard className="p-5 mb-4">
          <Text className="text-[#464555] text-[12px] font-bold uppercase">Tổng thu nhập tháng 10</Text>
          <View className="flex-row items-baseline mt-2">
            <Text className="text-[#3525CD] text-[34px] font-extrabold">15.420.000</Text>
            <Text className="text-[#464555] text-[20px] font-bold">đ</Text>
          </View>
          <View className="flex-row items-center gap-2 mt-4">
            <TaskerPill tone="success">+12.5%</TaskerPill>
            <Text className="text-[#464555]">so với tháng trước</Text>
          </View>
        </TaskerCard>
        <TaskerCard className="p-5 mb-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[#464555] text-[12px] font-bold uppercase">Công việc hoàn thành</Text>
              <Text className="text-[#831ADA] text-[32px] font-extrabold mt-1">42</Text>
            </View>
            <IconTile icon={Banknote} tone="secondary" />
          </View>
          <View className="h-2 bg-[#DEE8FF] rounded-full mt-4 overflow-hidden">
            <View className="h-full w-[85%] bg-[#831ADA] rounded-full" />
          </View>
          <Text className="text-[#464555] text-[11px] text-right mt-1">Mục tiêu: 50</Text>
        </TaskerCard>
        <View className="flex-row items-center gap-2 mb-5">
          <TaskerPill>Tất cả</TaskerPill>
          <TaskerPill tone="neutral">Tháng 10</TaskerPill>
          <TaskerPill tone="neutral">Tháng 09</TaskerPill>
          <View className="w-10 h-10 rounded-full bg-[#E7EEFF] items-center justify-center">
            <Search size={16} color="#464555" />
          </View>
        </View>
        <View className="gap-4">
          {mockTaskerData.history.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Briefcase;
            const tone = item.tone === 'success' ? 'success' : item.tone === 'error' ? 'error' : 'tertiary';
            return (
              <TouchableOpacity key={item.id} onPress={() => handleOpenRating(item)} activeOpacity={0.85}>
                <TaskerCard className="p-4 border-l-4">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <IconTile icon={Icon} tone={tone} />
                      <View className="flex-1">
                        <Text className="text-[#111C2D] font-bold text-[16px]">{item.title}</Text>
                        <View className="flex-row items-center gap-2 mt-1 flex-wrap">
                          <CalendarDays size={13} color="#464555" />
                          <Text className="text-[#464555] text-[12px]">{item.date}</Text>
                          <TaskerPill tone={tone}>{item.status}</TaskerPill>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className={`font-extrabold ${item.tone === 'success' ? 'text-[#3525CD]' : 'text-[#464555]'}`}>{item.amount}</Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <Star size={14} color="#FBBF24" fill="#FBBF24" />
                        <Text className="text-xs text-[#3525CD] font-bold">Đánh giá khách</Text>
                      </View>
                    </View>
                  </View>
                </TaskerCard>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity className="mt-8 rounded-full border border-[#3525CD] py-3 items-center">
          <Text className="text-[#3525CD] font-extrabold">Xem thêm công việc</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Two-Way Rating Modal */}
      <Modal visible={ratingModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <Star size={22} color="#FBBF24" fill="#FBBF24" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Đánh giá Khách hàng (2 chiều)</Text>
              </View>
              <TouchableOpacity onPress={() => setRatingModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-800 font-bold text-base mb-1">{selectedTask?.title}</Text>
            <Text className="text-gray-500 text-xs mb-4">Ngày hoàn thành: {selectedTask?.date}</Text>

            <Text className="text-gray-700 font-semibold text-sm mb-2 text-center">Chấm điểm uy tín khách hàng:</Text>
            <View className="flex-row justify-center gap-3 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setStars(star)}>
                  <Star size={32} color="#FBBF24" fill={star <= stars ? '#FBBF24' : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-700 font-semibold text-xs mb-1">Nhận xét chi tiết:</Text>
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={3}
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-5"
            />

            <TouchableOpacity
              onPress={handleSubmitRating}
              className="bg-[#3525CD] py-3.5 rounded-xl items-center flex-row justify-center gap-2"
            >
              <MessageSquare size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">Gửi đánh giá 2 chiều</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
