import { Banknote, CalendarDays, ChevronRight, Package, Search, ShoppingBasket, Wrench, Briefcase } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerScreenProps } from '../../types';

const iconMap = { cleaning: Briefcase, delivery: Package, repair: Wrench, shopping: ShoppingBasket };

export function TaskHistoryScreen({ onBack }: TaskerScreenProps) {
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
              <TaskerCard key={item.id} className="p-4 border-l-4">
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
                    <ChevronRight size={18} color="#777587" />
                  </View>
                </View>
              </TaskerCard>
            );
          })}
        </View>
        <TouchableOpacity className="mt-8 rounded-full border border-[#3525CD] py-3 items-center">
          <Text className="text-[#3525CD] font-extrabold">Xem thêm công việc</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
