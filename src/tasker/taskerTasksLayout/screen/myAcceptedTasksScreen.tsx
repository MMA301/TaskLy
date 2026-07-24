import { MessageCircle, Phone, Plus, Star, Play, CheckCircle2 } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTasks, subscribe, startWork, Task } from '../../../session';
import { GradientButton, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerScreenProps } from '../../types';

export function MyAcceptedTasksScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const [acceptedTasksList, setAcceptedTasksList] = useState<Task[]>([]);

  useEffect(() => {
    const fetchAcceptedTasks = () => {
      const allTasks = getTasks();
      const matched = allTasks.filter(
        (t: Task) => (t.status === 'ACCEPTED' || t.status === 'IN_PROGRESS' || t.status === 'COMPLETED') && t.assignedTasker === 'Nguyễn Minh Đức'
      );
      setAcceptedTasksList(matched);
    };

    fetchAcceptedTasks();
    const unsubscribe = subscribe(fetchAcceptedTasks);
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader title="Công việc của tôi" subtitle="Quản lý yêu cầu đã chấp nhận" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-28">
        <Text className="text-[#111C2D] text-[30px] font-extrabold mb-2">Công việc của tôi</Text>
        <Text className="text-[#464555] mb-6">Quản lý các yêu cầu dịch vụ bạn đã chấp nhận.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 mb-5">
          <TaskerPill>Tất cả ({acceptedTasksList.length})</TaskerPill>
          <TaskerPill tone="neutral">Đang thực hiện ({acceptedTasksList.filter(t => t.status === 'IN_PROGRESS').length})</TaskerPill>
          <TaskerPill tone="neutral">Sắp tới ({acceptedTasksList.filter(t => t.status === 'ACCEPTED').length})</TaskerPill>
        </ScrollView>
        <View className="gap-4">
          {acceptedTasksList.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <CheckCircle2 size={36} color={TASKER_COLORS.muted} />
              <Text className="text-[#464555] mt-3">Chưa có công việc nào được nhận.</Text>
            </View>
          ) : (
            acceptedTasksList.map((task) => (
              <TaskerCard key={task.id} className="p-4">
                <View className="flex-row justify-between items-start mb-3">
                  <TaskerPill tone={task.status === 'COMPLETED' ? 'primary' : task.status === 'IN_PROGRESS' ? 'secondary' : 'tertiary'}>
                    {task.status === 'ACCEPTED' ? 'Đã nhận' : task.status === 'IN_PROGRESS' ? 'Đang làm' : 'Hoàn thành'}
                  </TaskerPill>
                  <Text className="text-[#3525CD] text-[18px] font-extrabold">{task.price}</Text>
                </View>
                <Text className="text-[#111C2D] text-[20px] font-extrabold mb-2">{task.title}</Text>
                <Text className="text-[#464555]">{task.address}</Text>

                {task.status === 'ACCEPTED' && (
                  <TouchableOpacity
                    onPress={() => {
                      startWork(task.id);
                      Alert.alert("Thành công", "Công việc đã chính thức bắt đầu (IN_PROGRESS)!");
                    }}
                    style={{ backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                  >
                    <Play size={16} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>Bắt đầu làm việc (Start Work)</Text>
                  </TouchableOpacity>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <View className="mt-5 pt-4 border-t border-[#E7EEFF]">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-[#464555] text-[12px]">Tiến độ công việc</Text>
                      <Text className="text-[#3525CD] text-[12px] font-bold">50%</Text>
                    </View>
                    <View className="h-2 bg-[#DEE8FF] rounded-full overflow-hidden">
                      <View className="h-full rounded-full bg-[#3525CD]" style={{ width: `50%` }} />
                    </View>
                  </View>
                )}

                <View className="flex-row items-center justify-between mt-5">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#E2DFFF] items-center justify-center">
                      <Text className="text-[#3525CD] font-bold">{task.customer.slice(0, 1)}</Text>
                    </View>
                    <View>
                      <Text className="text-[#111C2D] font-bold">{task.customer}</Text>
                      <Text className="text-[#464555] text-[12px]">Thời gian: {task.time}</Text>
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
            ))
          )}
          <GradientButton>
            <View className="flex-row items-center gap-2">
              <Plus size={18} color="#FFFFFF" />
              <Text className="text-white font-extrabold">Đăng ký tăng thu nhập cuối tuần</Text>
              <Star size={18} color="#FFFFFF" />
            </View>
          </GradientButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
