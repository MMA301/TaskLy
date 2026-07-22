import { Briefcase, ChevronDown, Clock, Crosshair, MapPin, Package, ShoppingBasket, SlidersHorizontal, Wrench } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { getTasks, subscribe, setSelectedTaskId, Task } from '../../../session';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

const iconMap = {
  cleaning: Briefcase,
  delivery: Package,
  repair: Wrench,
  shopping: ShoppingBasket,
};

export function NearbyTasksScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const [tasksList, setTasksList] = useState<Task[]>(() =>
    getTasks().filter((t: Task) => t.status === 'OPEN')
  );

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTasksList(getTasks().filter((t: Task) => t.status === 'OPEN'));
    });

    return unsubscribe;
  }, []);
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Công việc gần đây" subtitle="Quận 1, TP. Hồ Chí Minh" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View className="h-[330px] bg-[#E7EEFF] relative overflow-hidden">
          <View className="absolute inset-0 opacity-80">
            <View className="absolute top-8 left-6 right-6 h-[1px] bg-[#C7C4D8]" />
            <View className="absolute top-28 left-0 right-0 h-[1px] bg-[#C7C4D8]" />
            <View className="absolute top-52 left-10 right-0 h-[1px] bg-[#C7C4D8]" />
            <View className="absolute left-14 top-0 bottom-0 w-[1px] bg-[#C7C4D8]" />
            <View className="absolute left-40 top-0 bottom-0 w-[1px] bg-[#C7C4D8]" />
            <View className="absolute right-20 top-0 bottom-0 w-[1px] bg-[#C7C4D8]" />
          </View>
          <MapPinBubble className="top-[84px] left-[42%]" tone="primary" icon={Briefcase} />
          <MapPinBubble className="top-[156px] left-[66%]" tone="secondary" icon={Package} />
          <MapPinBubble className="top-[60px] left-[18%]" tone="tertiary" icon={Wrench} />
          <View className="absolute bottom-6 left-4 right-4 flex-row items-end justify-between">
            <View className="bg-white/95 rounded-xl p-4 border border-[#C7C4D8]" style={taskerShadow}>
              <Text className="text-[#3525CD] text-[11px] font-bold mb-1">Vị trí của bạn</Text>
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color={TASKER_COLORS.primary} />
                <Text className="text-[#111C2D] font-bold">Quận 1, TP. Hồ Chí Minh</Text>
              </View>
            </View>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-white/95 border border-[#C7C4D8] items-center justify-center" style={taskerShadow}>
              <Crosshair size={22} color={TASKER_COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 py-4 gap-2">
          <FilterChip active icon={SlidersHorizontal} label="Tất cả lọc" />
          <FilterChip icon={ChevronDown} label="Khoảng cách" />
          <FilterChip icon={ChevronDown} label="Giá cả" />
          <FilterChip icon={ChevronDown} label="Danh mục" />
        </ScrollView>

        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#111C2D] text-[22px] font-extrabold">
            Công việc gần bạn <Text className="text-[#3525CD]">({tasksList.length})</Text>
          </Text>
          <Text className="text-[#3525CD] font-bold text-[12px]">Xem bản đồ</Text>
        </View>
        <View className="gap-4">
          {tasksList.map((task) => {
            const Icon = iconMap[task.icon as keyof typeof iconMap] ?? Briefcase;
            return (
              <TouchableOpacity key={task.id} onPress={() => {
                setSelectedTaskId(task.id);
                onNavigate('detail');
              }} activeOpacity={0.86}>
                  <TaskerCard className="p-4">
                    <View className="flex-row gap-4">
                      <IconTile icon={Icon} size="lg" />
                      <View className="flex-1">
                        <View className="flex-row justify-between items-start">
                          <TaskerPill tone={task.icon === 'delivery' ? 'secondary' : task.icon === 'repair' ? 'tertiary' : 'primary'}>
                            {task.category}
                          </TaskerPill>
                          <Text className="text-[#3525CD] text-[17px] font-extrabold">{task.price}</Text>
                        </View>
                        <Text className="text-[#111C2D] font-bold mt-2" numberOfLines={1}>{task.title}</Text>
                        <View className="flex-row items-center gap-4 mt-2">
                          <View className="flex-row items-center gap-1">
                            <MapPin size={14} color={TASKER_COLORS.muted} />
                            <Text className="text-[#464555] text-[12px]">{task.distance}</Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Clock size={14} color={TASKER_COLORS.muted} />
                            <Text className="text-[#464555] text-[12px]">{task.postedAgo}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TaskerCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function MapPinBubble({ className, tone, icon: Icon }: { className: string; tone: 'primary' | 'secondary' | 'tertiary'; icon: TaskerIcon }) {
  const color = tone === 'primary' ? TASKER_COLORS.primary : tone === 'secondary' ? TASKER_COLORS.secondary : TASKER_COLORS.tertiary;
  return (
    <View className={`absolute ${className} items-center`}>
      <View className="w-11 h-11 rounded-full items-center justify-center shadow-lg" style={{ backgroundColor: color }}>
        <Icon size={20} color="#FFFFFF" />
      </View>
      <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color }} />
    </View>
  );
}

function FilterChip({ active, icon: Icon, label }: { active?: boolean; icon: TaskerIcon; label: string }) {
  return (
    <TouchableOpacity className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${active ? 'bg-[#3525CD]' : 'bg-white border border-[#C7C4D8]'}`}>
      <Icon size={16} color={active ? '#FFFFFF' : TASKER_COLORS.muted} />
      <Text className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#464555]'}`}>{label}</Text>
    </TouchableOpacity>
  );
}
