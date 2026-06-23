import { MessageCircle, Phone, Plus, Star } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { GradientButton, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerScreenProps } from '../../types';

export function MyAcceptedTasksScreen({ onBack }: TaskerScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Công việc của tôi" subtitle="Quản lý yêu cầu đã chấp nhận" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        <Text className="text-[#111C2D] text-[30px] font-extrabold mb-2">Công việc của tôi</Text>
        <Text className="text-[#464555] mb-6">Quản lý các yêu cầu dịch vụ bạn đã chấp nhận.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 mb-5">
          <TaskerPill>Tất cả (8)</TaskerPill>
          <TaskerPill tone="neutral">Đang thực hiện (3)</TaskerPill>
          <TaskerPill tone="neutral">Sắp tới (5)</TaskerPill>
        </ScrollView>
        <View className="gap-4">
          {mockTaskerData.acceptedTasks.map((task, index) => (
            <TaskerCard key={task.id} className={`p-4 ${index === 2 ? 'bg-[#F0F3FF] border-dashed' : ''}`}>
              <View className="flex-row justify-between items-start mb-3">
                <TaskerPill tone={index === 2 ? 'tertiary' : 'secondary'}>{task.status}</TaskerPill>
                <Text className="text-[#3525CD] text-[18px] font-extrabold">{task.price}</Text>
              </View>
              <Text className="text-[#111C2D] text-[20px] font-extrabold mb-2">{task.title}</Text>
              <Text className="text-[#464555]">{task.location}</Text>
              {task.progress > 0 ? (
                <View className="mt-5 pt-4 border-t border-[#E7EEFF]">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-[#464555] text-[12px]">Tiến độ công việc</Text>
                    <Text className="text-[#3525CD] text-[12px] font-bold">{task.progress}%</Text>
                  </View>
                  <View className="h-2 bg-[#DEE8FF] rounded-full overflow-hidden">
                    <View className="h-full rounded-full bg-[#3525CD]" style={{ width: `${task.progress}%` }} />
                  </View>
                </View>
              ) : null}
              <View className="flex-row items-center justify-between mt-5">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-[#E2DFFF] items-center justify-center">
                    <Text className="text-[#3525CD] font-bold">{task.customer.slice(0, 1)}</Text>
                  </View>
                  <View>
                    <Text className="text-[#111C2D] font-bold">{task.customer}</Text>
                    <Text className="text-[#464555] text-[12px]">{task.note}</Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F0F3FF] items-center justify-center">
                    <MessageCircle size={18} color={TASKER_COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F0F3FF] items-center justify-center">
                    <Phone size={18} color={TASKER_COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TaskerCard>
          ))}
          <GradientButton>
            <View className="flex-row items-center gap-2">
              <Plus size={18} color="#FFFFFF" />
              <Text className="text-white font-extrabold">Đăng ký tăng thu nhập cuối tuần</Text>
              <Star size={18} color="#FFFFFF" />
            </View>
          </GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}
