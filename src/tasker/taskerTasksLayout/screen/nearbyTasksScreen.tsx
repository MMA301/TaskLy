import { Briefcase, MapPin, Package, ShoppingBasket, SlidersHorizontal, Wrench } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { setSelectedTaskId } from '../../../session';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';
import { taskApi, taskApplicationApi, userApi } from '../../../../service/api';

const iconMap = {
  cleaning: Briefcase,
  delivery: Package,
  repair: Wrench,
  shopping: ShoppingBasket,
};

export function NearbyTasksScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [appliedTaskIds, setAppliedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    userApi.getProfile()
      .then((userRes: any) => {
        const currentUser = userRes.data || userRes;
        const currentUserId = currentUser._id;

        return taskApplicationApi.getApplications({ taskerId: currentUserId })
          .then((appRes: any) => {
            const apps = Array.isArray(appRes) ? appRes : (appRes.data || []);
            const ids = apps.map((a: any) => {
              const tId = a.taskId?._id || a.taskId?.id || a.taskId;
              return typeof tId === 'string' ? tId : tId?.toString();
            }).filter(Boolean);
            setAppliedTaskIds(ids);

            return taskApi.getTasks({ status: 'open' });
          });
      })
      .then((res: any) => {
        const tasks = Array.isArray(res) ? res : (res.data || []);
        setTasksList(tasks);
      })
      .catch((err) => {
        console.error("Lỗi khi tải công việc gần đây:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredTasks = tasksList.filter((task) => {
    const taskId = task._id || task.id;
    if (appliedTaskIds.includes(taskId)) return false;

    if (!selectedCategory) return true;
    const catName = (task.categoryId?.name || "").toLowerCase();
    if (selectedCategory === 'cleaning') return catName.includes("dọn") || catName.includes("sạch");
    if (selectedCategory === 'delivery') return catName.includes("chuyển") || catName.includes("đồ") || catName.includes("giao");
    if (selectedCategory === 'repair') return catName.includes("sửa") || catName.includes("lắp") || catName.includes("setup");
    if (selectedCategory === 'shopping') return catName.includes("chợ") || catName.includes("mua");
    return true;
  });

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Tìm công việc" subtitle="Các công việc mới đang tuyển quanh bạn" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        
        {/* Simple decorative header banner */}
        <View className="bg-[#3525CD] px-5 py-6">
          <Text className="text-white font-extrabold text-[20px] leading-tight">Nhận việc ngay, tăng thu nhập</Text>
          <Text className="text-[#DEE8FF] text-xs mt-1">Lọc công việc theo chuyên môn của bạn và ứng tuyển nhanh chóng.</Text>
        </View>

        {/* Dynamic Category Chips Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 py-4 gap-2">
          <FilterChip active={selectedCategory === null} icon={SlidersHorizontal} label="Tất cả" onPress={() => setSelectedCategory(null)} />
          <FilterChip active={selectedCategory === 'cleaning'} icon={Briefcase} label="Dọn dẹp" onPress={() => setSelectedCategory('cleaning')} />
          <FilterChip active={selectedCategory === 'delivery'} icon={Package} label="Giao đồ" onPress={() => setSelectedCategory('delivery')} />
          <FilterChip active={selectedCategory === 'repair'} icon={Wrench} label="Sửa chữa" onPress={() => setSelectedCategory('repair')} />
          <FilterChip active={selectedCategory === 'shopping'} icon={ShoppingBasket} label="Mua hộ" onPress={() => setSelectedCategory('shopping')} />
        </ScrollView>

        {/* Tasks List */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">
              Công việc gần bạn <Text className="text-[#3525CD]">({filteredTasks.length})</Text>
            </Text>
          </View>

          <View className="gap-4">
            {isLoading ? (
              <ActivityIndicator size="large" color="#3525CD" style={{ marginTop: 24 }} />
            ) : filteredTasks.length === 0 ? (
              <View className="items-center justify-center py-8 bg-white rounded-2xl border border-slate-100 p-6">
                <Briefcase size={36} color="#94A3B8" />
                <Text className="text-gray-400 text-center mt-3 text-xs">Không có công việc nào mới quanh bạn.</Text>
              </View>
            ) : (
              filteredTasks.map((task: any) => {
                const catName = (task.categoryId?.name || "").toLowerCase();
                let iconKey = 'cleaning';
                if (catName.includes("chuyển") || catName.includes("đồ") || catName.includes("giao")) {
                  iconKey = 'delivery';
                } else if (catName.includes("sửa") || catName.includes("lắp") || catName.includes("setup")) {
                  iconKey = 'repair';
                } else if (catName.includes("chợ") || catName.includes("mua")) {
                  iconKey = 'shopping';
                }
                const Icon = iconMap[iconKey as keyof typeof iconMap] ?? Briefcase;
                const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;

                return (
                  <TouchableOpacity
                    key={task._id || task.id}
                    onPress={() => {
                      setSelectedTaskId(task._id || task.id);
                      onNavigate('detail');
                    }}
                    activeOpacity={0.86}
                  >
                    <TaskerCard className="p-4">
                      <View className="flex-row gap-4">
                        <IconTile icon={Icon} size="lg" />
                        <View className="flex-1">
                          <View className="flex-row justify-between items-start">
                            <TaskerPill tone={iconKey === 'delivery' ? 'secondary' : iconKey === 'repair' ? 'tertiary' : 'primary'}>
                              {task.categoryId?.name || "Dịch vụ"}
                            </TaskerPill>
                            <Text className="text-[#3525CD] text-[17px] font-extrabold">{formattedPrice}</Text>
                          </View>
                          <Text className="text-[#111C2D] font-bold mt-2" numberOfLines={1}>{task.title}</Text>
                          <View className="flex-row items-center gap-4 mt-2">
                            <View className="flex-row items-center gap-1 flex-1">
                              <MapPin size={14} color={TASKER_COLORS.muted} />
                              <Text className="text-[#464555] text-[12px] flex-1" numberOfLines={1}>{task.address}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TaskerCard>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FilterChip({ active, icon: Icon, label, onPress }: { active?: boolean; icon: TaskerIcon; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${active ? 'bg-[#3525CD]' : 'bg-white border border-[#C7C4D8]'}`}>
      <Icon size={16} color={active ? '#FFFFFF' : TASKER_COLORS.muted} />
      <Text className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#464555]'}`}>{label}</Text>
    </TouchableOpacity>
  );
}
