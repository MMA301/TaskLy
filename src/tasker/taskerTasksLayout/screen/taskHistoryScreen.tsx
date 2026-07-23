import { Banknote, CalendarDays, Package, ShoppingBasket, Wrench, Briefcase, Star, X, MessageSquare } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerScreenProps } from '../../types';
import { taskApplicationApi, userApi } from '../../../../service/api';
import { setSelectedTaskId } from '../../../session';

const iconMap = { cleaning: Briefcase, delivery: Package, repair: Wrench, shopping: ShoppingBasket };

export function TaskHistoryScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const [ratingModalVisible, setRatingModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [stars, setStars] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('Khách hàng rất thân thiện, chuẩn bị sẵn đồ nghề và thanh toán đúng hạn!');

  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    userApi.getProfile()
      .then((userRes: any) => {
        const user = userRes.data || userRes;
        return taskApplicationApi.getApplications({ taskerId: user._id });
      })
      .then((appRes: any) => {
        const apps = Array.isArray(appRes) ? appRes : (appRes.data || []);
        setApplications(apps);
      })
      .catch((err) => {
        console.error("Lỗi khi tải lịch sử ứng tuyển:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleOpenRating = (item: any) => {
    setSelectedTask(item);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = () => {
    Alert.alert('Thành công', `Đã gửi đánh giá ${stars} sao cho Khách hàng!`);
    setRatingModalVisible(false);
  };

  // Computations
  const completedApps = applications.filter(app => {
    const task = app.taskId || {};
    return task.status === 'completed';
  });

  const totalEarnings = completedApps.reduce((acc, app) => {
    const price = app.bidPrice || app.taskId?.price || 0;
    return acc + price;
  }, 0);

  const completedCount = completedApps.length;

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Lịch sử ứng tuyển" subtitle="Theo dõi các công việc đã nộp đơn và thu nhập" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        
        {/* Earnings Card */}
        <TaskerCard className="p-5 mb-4">
          <Text className="text-[#464555] text-[12px] font-bold uppercase">Tổng thu nhập tích lũy</Text>
          <View className="flex-row items-baseline mt-2">
            <Text className="text-[#3525CD] text-[34px] font-extrabold">{totalEarnings.toLocaleString("vi-VN")}</Text>
            <Text className="text-[#464555] text-[20px] font-bold">đ</Text>
          </View>
          <View className="flex-row items-center gap-2 mt-4">
            <TaskerPill tone="success">Thực tế</TaskerPill>
            <Text className="text-[#464555]">Đã nghiệm thu và hoàn thành</Text>
          </View>
        </TaskerCard>

        {/* Stats Card */}
        <TaskerCard className="p-5 mb-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[#464555] text-[12px] font-bold uppercase">Công việc hoàn thành</Text>
              <Text className="text-[#831ADA] text-[32px] font-extrabold mt-1">{completedCount}</Text>
            </View>
            <IconTile icon={Banknote} tone="secondary" />
          </View>
          <View className="h-2 bg-[#DEE8FF] rounded-full mt-4 overflow-hidden">
            <View className="h-full bg-[#831ADA] rounded-full" style={{ width: `${Math.min(100, (completedCount / 10) * 100)}%` }} />
          </View>
          <Text className="text-[#464555] text-[11px] text-right mt-1">Mục tiêu tháng: 10</Text>
        </TaskerCard>

        {/* Header Title */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#111C2D] text-[18px] font-bold">Các việc đã ứng tuyển ({applications.length})</Text>
        </View>

        {/* History List */}
        <View className="gap-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#3525CD" style={{ marginTop: 24 }} />
          ) : applications.length === 0 ? (
            <View className="items-center justify-center py-10 bg-white rounded-2xl border border-slate-100 p-6">
              <Briefcase size={36} color="#94A3B8" />
              <Text className="text-gray-400 text-center mt-3 text-xs">Bạn chưa ứng tuyển công việc nào.</Text>
            </View>
          ) : (
            applications.map((app: any) => {
              const task = app.taskId || {};
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

              // Map status
              let statusText = "Đang ứng tuyển";
              let tone: 'success' | 'error' | 'tertiary' = 'tertiary';
              
              if (app.status === 'accepted') {
                if (task.status === 'completed') {
                  statusText = "Đã hoàn thành";
                  tone = 'success';
                } else if (task.status === 'in_progress') {
                  statusText = "Đang làm việc";
                  tone = 'success';
                } else {
                  statusText = "Đã được chọn";
                  tone = 'success';
                }
              } else if (app.status === 'rejected') {
                statusText = "Bị từ chối";
                tone = 'error';
              } else if (app.status === 'cancelled') {
                statusText = "Đã hủy";
                tone = 'error';
              }

              const formattedPrice = typeof app.bidPrice === 'number' 
                ? app.bidPrice.toLocaleString("vi-VN") + "đ" 
                : (typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : "0đ");

              const dateText = app.createdAt 
                ? new Date(app.createdAt).toLocaleDateString("vi-VN") 
                : (task.date || "Vừa xong");

              return (
                <TouchableOpacity
                  key={app._id || app.id}
                  onPress={() => {
                    if (task._id || task.id) {
                      setSelectedTaskId(task._id || task.id);
                      onNavigate('detail');
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <TaskerCard className="p-4 border-l-4">
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-row items-center gap-3 flex-1">
                        <IconTile icon={Icon} tone={tone} />
                        <View className="flex-1">
                          <Text className="text-[#111C2D] font-bold text-[15px]" numberOfLines={1}>{task.title || "Công việc đã xóa"}</Text>
                          <View className="flex-row items-center gap-2 mt-1 flex-wrap">
                            <CalendarDays size={13} color="#464555" />
                            <Text className="text-[#464555] text-[11px]">{dateText}</Text>
                            <TaskerPill tone={tone}>{statusText}</TaskerPill>
                          </View>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className={`font-extrabold text-[15px] ${tone === 'success' ? 'text-[#3525CD]' : 'text-[#464555]'}`}>{formattedPrice}</Text>
                        {app.status === 'accepted' && task.status === 'completed' && (
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleOpenRating(app);
                            }}
                            className="flex-row items-center gap-1 mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                          >
                            <Star size={13} color="#FBBF24" fill="#FBBF24" />
                            <Text className="text-[10px] text-amber-700 font-bold">Đánh giá</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </TaskerCard>
                </TouchableOpacity>
              );
            })
          )}
        </View>
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

            <Text className="text-gray-800 font-bold text-base mb-1">{selectedTask?.taskId?.title || "Đánh giá Khách hàng"}</Text>
            <Text className="text-gray-500 text-xs mb-4">Mã ứng tuyển: {selectedTask?._id}</Text>

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
