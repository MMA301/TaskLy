import { Bolt, CheckCircle2, Clock, Home, MapPin, Shield, Star, Utensils } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { GradientButton, IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

export function TaskDetailScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const task = mockTaskerData.nearbyTasks[0];

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Chi tiết công việc" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        <TaskerCard className="p-5">
          <View className="flex-row flex-wrap gap-2 mb-3">
            <TaskerPill>Dọn dẹp nhà cửa</TaskerPill>
            <TaskerPill tone="tertiary">Khẩn cấp</TaskerPill>
          </View>
          <Text className="text-[#111C2D] text-[26px] font-extrabold leading-8">{task.title} tại Vinhomes Central Park</Text>
          <View className="flex-row items-center gap-2 mt-3">
            <Clock size={16} color={TASKER_COLORS.muted} />
            <Text className="text-[#464555]">Đăng cách đây 15 phút</Text>
          </View>
          <View className="mt-5 items-end">
            <Text className="text-[#3525CD] text-[30px] font-extrabold">{task.price}</Text>
            <Text className="text-[#464555] text-[13px]">Dự kiến {task.duration} làm việc</Text>
          </View>
        </TaskerCard>

        <TaskerCard className="p-4">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Khách hàng</Text>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-14 h-14 rounded-full bg-[#F0DBFF] items-center justify-center">
                <Text className="text-[#831ADA] font-extrabold">MA</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#111C2D] font-bold">{task.customer}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Star size={15} color="#FBBF24" fill="#FBBF24" />
                  <Text className="text-[#7E3000] font-bold">{task.customerRating}</Text>
                  <Text className="text-[#464555] text-[12px]">(124 đánh giá)</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="border border-[#3525CD] px-3 py-2 rounded-lg">
              <Text className="text-[#3525CD] font-bold text-[12px]">Xem hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </TaskerCard>

        <TaskerCard className="p-4">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Yêu cầu chi tiết</Text>
          <Requirement icon={CheckCircle2} title="Dọn dẹp tổng thể" text="Quét dọn, lau sàn, hút bụi toàn bộ các phòng và ban công." />
          <Requirement icon={Utensils} title="Vệ sinh bếp và tủ lạnh" text="Làm sạch bề mặt bếp, bồn rửa và sắp xếp lại thực phẩm trong tủ lạnh." />
          <Requirement icon={Home} title="Lưu ý đặc biệt" text="Chủ nhà có nuôi thú cưng nhỏ, vui lòng cẩn thận khi mở cửa ban công." />
        </TaskerCard>

        <TaskerCard className="p-4 overflow-hidden">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-3">Địa điểm</Text>
          <View className="flex-row items-start gap-2 mb-4">
            <MapPin size={18} color={TASKER_COLORS.error} />
            <Text className="text-[#111C2D] flex-1">{task.address}</Text>
          </View>
          <View className="h-56 rounded-lg bg-[#DEE8FF] items-center justify-center overflow-hidden">
            <View className="absolute inset-0">
              <View className="absolute top-10 left-0 right-0 h-[1px] bg-[#C7C4D8]" />
              <View className="absolute top-28 left-0 right-0 h-[1px] bg-[#C7C4D8]" />
              <View className="absolute left-20 top-0 bottom-0 w-[1px] bg-[#C7C4D8]" />
              <View className="absolute right-24 top-0 bottom-0 w-[1px] bg-[#C7C4D8]" />
            </View>
            <View className="w-24 h-24 rounded-full bg-[#3525CD]/20 items-center justify-center">
              <View className="w-5 h-5 rounded-full bg-[#3525CD] border-2 border-white" />
            </View>
          </View>
        </TaskerCard>

        <TaskerCard className="p-5">
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-[#464555] text-[12px]">Thời gian bắt đầu</Text>
              <Text className="text-[#111C2D] font-bold mt-1">{task.time}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[#464555] text-[12px]">Thời gian làm</Text>
              <Text className="text-[#111C2D] font-bold mt-1">{task.duration}</Text>
            </View>
          </View>
          <PriceRow label="Phí dịch vụ" value="450.000đ" />
          <PriceRow label="Phụ phí khẩn cấp" value="50.000đ" />
          <View className="flex-row justify-between py-3">
            <Text className="text-[#111C2D] text-[17px] font-extrabold">Tổng cộng</Text>
            <Text className="text-[#3525CD] text-[17px] font-extrabold">{task.price}</Text>
          </View>
          <GradientButton onPress={() => onNavigate('accept')} className="mt-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-extrabold text-[16px]">Nhận Việc Ngay</Text>
              <Bolt size={18} color="#FFFFFF" />
            </View>
          </GradientButton>
          <TouchableOpacity className="h-12 rounded-xl border border-[#3525CD] items-center justify-center mt-3">
            <Text className="text-[#3525CD] font-extrabold">Gửi Đề Nghị Khác</Text>
          </TouchableOpacity>
          <View className="flex-row gap-3 bg-[#DEE8FF] rounded-xl p-4 mt-4">
            <Shield size={28} color={TASKER_COLORS.primary} />
            <View className="flex-1">
              <Text className="text-[#111C2D] font-bold">Bảo hiểm Taskly</Text>
              <Text className="text-[#464555] text-[12px] mt-1">Công việc này được bảo hiểm lên đến 10.000.000đ.</Text>
            </View>
          </View>
        </TaskerCard>
      </ScrollView>
    </View>
  );
}

function Requirement({ icon, title, text }: { icon: TaskerIcon; title: string; text: string }) {
  return (
    <View className="flex-row items-start gap-3 mb-4">
      <IconTile icon={icon} size="sm" />
      <View className="flex-1">
        <Text className="text-[#111C2D] font-bold">{title}</Text>
        <Text className="text-[#464555] text-[13px] mt-1 leading-5">{text}</Text>
      </View>
    </View>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-[#E7EEFF]">
      <Text className="text-[#464555]">{label}</Text>
      <Text className="text-[#111C2D] font-semibold">{value}</Text>
    </View>
  );
}
