import { Banknote, Briefcase, MoreHorizontal, Package, WalletCards, Wrench } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, MiniBarChart, TaskerCard, TaskerHeader } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

const txIcons: Record<string, TaskerIcon> = {
  cleaning: Briefcase,
  delivery: Package,
  repair: Wrench,
  bank: Banknote,
};

const weekly = [
  { label: 'T2', value: 450 },
  { label: 'T3', value: 720 },
  { label: 'T4', value: 1200, active: true },
  { label: 'T5', value: 380 },
  { label: 'T6', value: 600 },
  { label: 'T7', value: 950 },
  { label: 'CN', value: 210 },
];

export function EarningsDashboardScreen({ onBack }: TaskerScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Bảng điều khiển thu nhập" subtitle="Chào, Minh Anh" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        <View className="rounded-xl bg-[#3525CD] p-6 mb-4 overflow-hidden">
          <View className="absolute -right-5 -top-3 opacity-20">
            <WalletCards size={120} color="#FFFFFF" />
          </View>
          <Text className="text-white/80 text-[12px] font-bold uppercase">Tổng số dư</Text>
          <Text className="text-white text-[38px] font-extrabold mt-2">{mockTaskerData.profile.balance}</Text>
          <View className="flex-row gap-2 mt-5">
            <TouchableOpacity className="bg-white px-4 py-3 rounded-lg flex-row items-center gap-2">
              <Banknote size={18} color={TASKER_COLORS.primary} />
              <Text className="text-[#3525CD] font-bold">Rút tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/20 px-4 py-3 rounded-lg">
              <MoreHorizontal size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-4 mb-5">
          <TaskerCard className="flex-1 p-4">
            <Text className="text-[#464555] text-[12px]">Thu nhập tháng này</Text>
            <Text className="text-[#3525CD] text-[22px] font-extrabold mt-1">+4.2tr</Text>
          </TaskerCard>
          <TaskerCard className="flex-1 p-4">
            <Text className="text-[#464555] text-[12px]">Số việc đã làm</Text>
            <Text className="text-[#831ADA] text-[22px] font-extrabold mt-1">24</Text>
          </TaskerCard>
        </View>

        <View className="mb-5">
          <View className="mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Tổng quan thu nhập tuần</Text>
            <Text className="text-[#464555]">01 Thg 5 - 07 Thg 5, 2024</Text>
          </View>
          <MiniBarChart values={weekly} />
        </View>

        <TaskerCard className="p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Giao dịch gần đây</Text>
            <Text className="text-[#3525CD] font-bold">Xem tất cả</Text>
          </View>
          {mockTaskerData.transactions.map((tx) => {
            const Icon = txIcons[tx.icon] ?? Briefcase;
            const tone = tx.type === 'outflow' ? 'error' : tx.icon === 'delivery' ? 'secondary' : 'primary';
            return (
              <View key={tx.id} className="flex-row items-center justify-between py-4 border-b border-[#E7EEFF]">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <IconTile icon={Icon} tone={tone} />
                  <View className="flex-1">
                    <Text className="text-[#111C2D] font-bold" numberOfLines={1}>{tx.title}</Text>
                    <Text className="text-[#464555] text-[12px] mt-1" numberOfLines={1}>{tx.subtitle}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`font-extrabold ${tx.type === 'inflow' ? 'text-[#3525CD]' : 'text-[#111C2D]'}`}>{tx.amount}</Text>
                  <Text className={`text-[10px] px-2 py-0.5 rounded mt-1 font-bold ${tx.status === 'Thành công' ? 'text-green-700 bg-green-50' : 'text-[#464555] bg-[#E7EEFF]'}`}>{tx.status}</Text>
                </View>
              </View>
            );
          })}
        </TaskerCard>
      </ScrollView>
    </View>
  );
}
