import { CheckCircle2, ListChecks, MapPinned, MessageCircle, Navigation } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerScreenProps } from '../../types';

export function AcceptTaskScreen({ onBack, onNavigate }: TaskerScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader title="Xác nhận nhận việc" onBack={onBack} />
      <ScrollView contentContainerClassName="px-4 py-8 pb-28">
        <TaskerCard className="overflow-hidden">
          <View className="h-44 bg-[#DEE8FF] items-center justify-center">
            <View className="w-24 h-24 rounded-full bg-[#E2DFFF] items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-[#4F46E5] items-center justify-center">
                <CheckCircle2 size={36} color="#FFFFFF" />
              </View>
            </View>
          </View>
          <View className="px-6 pb-8 pt-4 items-center">
            <Text className="text-[#111C2D] text-[24px] font-extrabold">Chúc mừng!</Text>
            <Text className="text-[#464555] text-center mt-2 mb-5">Bạn đã được bàn giao công việc này.</Text>
            <View className="bg-[#F0F3FF] rounded-lg p-4 w-full border border-[#C7C4D8] mb-6">
              <View className="flex-row justify-between items-start mb-3">
                <TaskerPill>Sửa chữa điện gia dụng</TaskerPill>
                <Text className="text-[#3525CD] text-[20px] font-extrabold">500.000đ</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MapPinned size={16} color="#464555" />
                <Text className="text-[#464555] text-[13px]">Quận 7, TP. Hồ Chí Minh</Text>
              </View>
            </View>
            <View className="w-full mb-7">
              <View className="flex-row items-center gap-2 mb-4">
                <ListChecks size={18} color="#3525CD" />
                <Text className="text-[#111C2D] font-bold">Các bước tiếp theo</Text>
              </View>
              <Step number="1" title="Liên hệ với khách hàng" text="Xác nhận lại thời gian và yêu cầu cụ thể." active />
              <Step number="2" title="Di chuyển đến địa điểm" text="Sử dụng bản đồ để tìm đường đi ngắn nhất." active />
              <Step number="3" title="Bắt đầu công việc" text="Chụp ảnh trước và sau khi hoàn thành." />
            </View>
            <GradientButton onPress={() => onNavigate('nearby')} className="w-full">
              <View className="flex-row items-center gap-2">
                <Navigation size={18} color="#FFFFFF" />
                <Text className="text-white font-extrabold">Bắt đầu chỉ đường</Text>
              </View>
            </GradientButton>
            <TouchableOpacity onPress={() => onNavigate('messages')} className="h-12 flex-row items-center justify-center gap-2 mt-3 w-full rounded-xl">
              <MessageCircle size={18} color="#3525CD" />
              <Text className="text-[#3525CD] font-bold">Nhắn tin cho khách</Text>
            </TouchableOpacity>
          </View>
        </TaskerCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ number, title, text, active }: { number: string; title: string; text: string; active?: boolean }) {
  return (
    <View className="flex-row items-start gap-3 mb-4">
      <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${active ? 'border-[#3525CD]' : 'border-[#777587]'}`}>
        <Text className={`text-[11px] font-extrabold ${active ? 'text-[#3525CD]' : 'text-[#777587]'}`}>{number}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[#111C2D] font-bold">{title}</Text>
        <Text className="text-[#464555] text-[12px] mt-1">{text}</Text>
      </View>
    </View>
  );
}
