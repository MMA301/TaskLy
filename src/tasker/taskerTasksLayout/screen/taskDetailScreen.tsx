import { Bolt, CheckCircle2, Clock, Home, MapPin, Shield, Star, Utensils, ShieldAlert, DollarSign, Camera, X, Upload, Play } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSelectedTaskId } from '../../../session';
import { GradientButton, IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';
import { taskApi, taskApplicationApi, userApi } from '../../../../service/api';

export function TaskDetailScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const activeTaskId = getSelectedTaskId();
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const handleReload = () => {
    setIsLoading(true);
    setReloadTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!activeTaskId) return;

    userApi.getProfile()
      .then((res: any) => {
        setCurrentUser(res.data || res);
      })
      .catch(console.error);

    taskApi.getTaskById(activeTaskId)
      .then((res: any) => {
        setCurrentTask(res.data || res);
      })
      .catch((err) => {
        console.error("Lỗi khi tải chi tiết task:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    taskApplicationApi.getApplications({ taskId: activeTaskId })
      .then((res: any) => {
        setApplications(Array.isArray(res) ? res : (res.data || []));
      })
      .catch(console.error);
  }, [activeTaskId, reloadTrigger]);

  const [counterModalVisible, setCounterModalVisible] = useState<boolean>(false);
  const [counterPrice, setCounterPrice] = useState<string>('600000');
  const [counterNote, setCounterNote] = useState<string>('Tôi mang đầy đủ máy hút bụi công nghiệp & dụng cụ lau kính chuyên dụng.');
  const [proofModalVisible, setProofModalVisible] = useState<boolean>(false);
  const [proofUploaded, setProofUploaded] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);

  const handleSendCounterOffer = () => {
    const customerName = currentTask?.customerId?.fullName || "Khách hàng";
    Alert.alert('Đã gửi thương lượng', `Đã đề xuất mức giá ${parseInt(counterPrice).toLocaleString('vi-VN')}đ cho khách hàng ${customerName}!`);
    setCounterModalVisible(false);
  };

  const handleSos = () => {
    Alert.alert(
      '🔴 CẢNH BÁO SOS KHẨN CẤP',
      `Đã phát tín hiệu SOS khẩn cấp kèm vị trí GPS (${currentTask?.address}) tới Đội hỗ trợ Taskly và Công an khu vực lân cận!`,
      [{ text: 'Đóng' }]
    );
    setSosActive(true);
  };

  if (isLoading || !currentTask) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9FF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3525CD" />
        <Text style={{ marginTop: 12, color: '#464555', fontWeight: '600' }}>Đang tải chi tiết công việc...</Text>
      </View>
    );
  }

  const customerName = currentTask?.customerId?.fullName || "Khách hàng";
  const priceVal = typeof currentTask.price === 'number' ? currentTask.price : (Number(currentTask.price) || 0);
  const formattedPrice = priceVal.toLocaleString('vi-VN') + "đ";
  const formattedServiceFee = (Math.round(priceVal * 0.9)).toLocaleString('vi-VN') + "đ";
  const formattedTravelFee = (Math.round(priceVal * 0.1)).toLocaleString('vi-VN') + "đ";

  const myApplication = applications.find((app: any) => {
    const taskerId = app.taskerId?._id || app.taskerId;
    const myId = currentUser?._id || currentUser?.id;
    return taskerId && myId && taskerId === myId;
  });
  const hasApplied = !!myApplication;

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader title="Chi tiết công việc" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-5 pb-28 gap-5">
        
        {/* SOS Emergency Banner (Chỉ hiện khi chưa hoàn thành) */}
        {currentTask.status !== "completed" && (
          <TouchableOpacity
            onPress={handleSos}
            className={`p-3 rounded-xl flex-row items-center justify-between ${sosActive ? 'bg-red-600' : 'bg-red-100 border border-red-300'}`}
          >
            <View className="flex-row items-center gap-2">
              <ShieldAlert size={22} color={sosActive ? '#FFFFFF' : '#DC2626'} />
              <View>
                <Text className={`font-extrabold text-sm ${sosActive ? 'text-white' : 'text-red-700'}`}>
                  {sosActive ? '🔴 Đã bật chế độ bảo vệ SOS Khẩn cấp' : 'Nút An Toàn Khẩn Cấp (SOS)'}
                </Text>
                <Text className={`text-xs ${sosActive ? 'text-red-100' : 'text-red-600'}`}>Chạm để gửi tọa độ GPS cấp cứu tới Admin & Đồn công an</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <TaskerCard className="p-5">
          <View className="flex-row flex-wrap gap-2 mb-3">
            <TaskerPill>{currentTask.categoryId?.name || "Dịch vụ"}</TaskerPill>
            <TaskerPill tone="tertiary">Khẩn cấp</TaskerPill>
            <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-emerald-800 text-[11px] font-extrabold">🛡️ Ví Escrow Tạm Giữ</Text>
            </View>
          </View>
          <Text className="text-[#111C2D] text-[26px] font-extrabold leading-8">{currentTask.title}</Text>
          <View className="flex-row items-center gap-2 mt-3">
            <Clock size={16} color={TASKER_COLORS.muted} />
            <Text className="text-[#464555]">
              {currentTask.createdAt ? new Date(currentTask.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
            </Text>
          </View>
          <View className="mt-5 items-end">
            <Text className="text-[#3525CD] text-[30px] font-extrabold">{formattedPrice}</Text>
            <Text className="text-[#464555] text-[13px]">Dự kiến {currentTask.duration || "3 giờ"} làm việc</Text>
          </View>
        </TaskerCard>

        <TaskerCard className="p-4">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Khách hàng</Text>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-14 h-14 rounded-full bg-[#F0DBFF] items-center justify-center">
                <Text className="text-[#831ADA] font-extrabold">{customerName.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#111C2D] font-bold">{customerName}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Star size={15} color="#FBBF24" fill="#FBBF24" />
                  <Text className="text-[#7E3000] font-bold">4.9</Text>
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
          <Requirement icon={CheckCircle2} title="Mô tả công việc" text={currentTask.description || "Không có mô tả chi tiết."} />
          {currentTask.address && <Requirement icon={MapPin} title="Địa chỉ thực hiện" text={currentTask.address} />}
        </TaskerCard>

        {/* Proof of work Card */}
        <TaskerCard className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Bằng chứng nghiệm thu</Text>
            <View className={`px-2.5 py-1 rounded-full ${(currentTask.completedImage || proofUploaded) ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-bold ${(currentTask.completedImage || proofUploaded) ? 'text-green-700' : 'text-gray-600'}`}>
                {(currentTask.completedImage || proofUploaded) ? '✓ Đã gửi ảnh nghiệm thu' : 'Chưa tải ảnh'}
              </Text>
            </View>
          </View>
 
          <TouchableOpacity
            onPress={() => setProofModalVisible(true)}
            className="w-full border-2 border-dashed border-[#3525CD] bg-[#F0F3FF] py-3.5 rounded-xl items-center flex-row justify-center gap-2 mb-2"
          >
            <Camera size={20} color="#3525CD" />
            <Text className="text-[#3525CD] font-bold text-sm">
              {(currentTask.completedImage || proofUploaded) ? 'Xem / Cập nhật ảnh nghiệm thu' : 'Chụp / Tải lên ảnh hoàn thành'}
            </Text>
          </TouchableOpacity>
        </TaskerCard>

        <TaskerCard className="p-4 overflow-hidden">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-3">Địa điểm & Check-in GPS</Text>
          <View className="flex-row items-start gap-2 mb-4">
            <MapPin size={18} color={TASKER_COLORS.error} />
            <Text className="text-[#111C2D] flex-1">{currentTask.address}</Text>
          </View>
          <View className="h-44 rounded-lg bg-[#DEE8FF] items-center justify-center overflow-hidden">
            <View className="w-24 h-24 rounded-full bg-[#3525CD]/20 items-center justify-center">
              <View className="w-5 h-5 rounded-full bg-[#3525CD] border-2 border-white" />
            </View>
          </View>
        </TaskerCard>

        <TaskerCard className="p-5">
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-[#464555] text-[12px]">Thời gian bắt đầu</Text>
              <Text className="text-[#111C2D] font-bold mt-1">
                {currentTask.time || "Hôm nay, 14:00"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[#464555] text-[12px]">Thời gian làm</Text>
              <Text className="text-[#111C2D] font-bold mt-1">{currentTask.duration || "3 giờ"}</Text>
            </View>
          </View>
          <PriceRow label="Phí dịch vụ" value={formattedServiceFee} />
          <PriceRow label="Phụ phí di chuyển" value={formattedTravelFee} />
          <View className="flex-row justify-between py-3">
            <Text className="text-[#111C2D] text-[17px] font-extrabold">Tổng cộng</Text>
            <Text className="text-[#3525CD] text-[17px] font-extrabold">{formattedPrice}</Text>
          </View>

          {currentTask.status === 'open' && (
            <>
              {hasApplied ? (
                <TouchableOpacity
                  disabled
                  className="h-12 rounded-xl bg-slate-200 items-center justify-center mt-3"
                >
                  <Text className="text-slate-400 font-extrabold text-[16px]">Đã ứng tuyển • Đang chờ duyệt</Text>
                </TouchableOpacity>
              ) : (
                <GradientButton
                  onPress={() => {
                    taskApplicationApi.applyTask({ taskId: currentTask._id || currentTask.id, bidPrice: priceVal })
                      .then(() => {
                        Alert.alert("Thành công", "Bạn đã ứng tuyển thành công! Vui lòng chờ khách hàng duyệt.");
                        handleReload();
                      })
                      .catch((err: any) => {
                        console.error(err);
                        Alert.alert("Thất bại", err.message || "Ứng tuyển thất bại.");
                      });
                  }}
                  className="mt-3"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white font-extrabold text-[16px]">Ứng tuyển ngay (Apply)</Text>
                    <Bolt size={18} color="#FFFFFF" />
                  </View>
                </GradientButton>
              )}

              <TouchableOpacity onPress={() => setCounterModalVisible(true)} className="h-12 rounded-xl border border-[#3525CD] items-center justify-center mt-3">
                <Text className="text-[#3525CD] font-extrabold">Gửi Đề Nghị Giá Khác (Bidding)</Text>
              </TouchableOpacity>
            </>
          )}

          {currentTask.status === 'assigned' && (currentTask.taskerId?._id === currentUser?._id || currentTask.taskerId === currentUser?._id) && (
            <TouchableOpacity
              onPress={() => {
                taskApi.startTask(currentTask._id || currentTask.id)
                  .then(() => {
                    Alert.alert("Thành công", "Công việc đã chính thức bắt đầu (IN_PROGRESS)!");
                    handleReload();
                  })
                  .catch((err: any) => {
                    console.error(err);
                    Alert.alert("Thất bại", err.message || "Không thể bắt đầu công việc.");
                  });
              }}
              style={{ backgroundColor: '#10B981', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }}
            >
              <Play size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Bắt đầu làm việc (Start Work)</Text>
            </TouchableOpacity>
          )}

          {currentTask.status === 'in_progress' && (
            <TouchableOpacity
              disabled
              style={{ backgroundColor: '#3B82F6', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12, opacity: 0.8 }}
            >
              <Clock size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Trạng thái: Đang thực hiện (IN_PROGRESS)</Text>
            </TouchableOpacity>
          )}

          {currentTask.status === 'completed' && (
            <TouchableOpacity
              disabled
              style={{ backgroundColor: '#10B981', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }}
            >
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Trạng thái: Đã hoàn thành (COMPLETED)</Text>
            </TouchableOpacity>
          )}

          <View className="flex-row gap-3 bg-[#DEE8FF] rounded-xl p-4 mt-4">
            <Shield size={28} color={TASKER_COLORS.primary} />
            <View className="flex-1">
              <Text className="text-[#111C2D] font-bold">Bảo hiểm & Tiền Escrow Taskly</Text>
              <Text className="text-[#464555] text-[12px] mt-1">Khoản thanh toán được bảo vệ bởi Escrow. Tiền chuyển về ví ngay sau nghiệm thu.</Text>
            </View>
          </View>
        </TaskerCard>
      </ScrollView>

      {/* Counter-Offer / Bidding Modal */}
      <Modal visible={counterModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <DollarSign size={22} color="#3525CD" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Thương lượng giá mới (Bidding)</Text>
              </View>
              <TouchableOpacity onPress={() => setCounterModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 text-xs mb-1">Mức giá ban đầu của khách: <Text className="font-bold text-gray-800">{formattedPrice}</Text></Text>
            <Text className="text-gray-600 text-xs mb-3">Nhập mức giá bạn đề xuất (VNĐ):</Text>
            <View className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mb-4 flex-row items-center">
              <TextInput
                value={counterPrice}
                onChangeText={setCounterPrice}
                keyboardType="numeric"
                className="flex-1 text-base font-bold text-gray-800"
              />
              <Text className="text-gray-500 font-bold">VNĐ</Text>
            </View>

            <Text className="text-gray-600 text-xs mb-1">Ghi chú cho khách hàng:</Text>
            <TextInput
              value={counterNote}
              onChangeText={setCounterNote}
              multiline
              numberOfLines={3}
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-5"
            />

            <TouchableOpacity
              onPress={handleSendCounterOffer}
              className="bg-[#3525CD] py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-base">Gửi đề xuất giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Proof of Work Modal */}
      <Modal visible={proofModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <Camera size={22} color="#3525CD" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Ảnh bằng chứng nghiệm thu</Text>
              </View>
              <TouchableOpacity onPress={() => setProofModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 text-xs mb-4">
              Tải lên hình ảnh phòng/thiết bị sau khi dọn dẹp để Khách hàng xác nhận giải ngân tiền Escrow.
            </Text>

            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            <TouchableOpacity
              disabled={isLoading}
              onPress={() => {
                const mockImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop';
                setIsLoading(true);
                taskApi.submitProof(currentTask._id || currentTask.id, mockImage)
                  .then((res: any) => {
                    const updatedTask = res.data || res;
                    setCurrentTask(updatedTask);
                    setProofUploaded(true);
                    Alert.alert('Thành công', 'Đã gửi ảnh bằng chứng nghiệm thu đến khách hàng để xác nhận!');
                    setProofModalVisible(false);
                  })
                  .catch((err) => {
                    console.error("Lỗi khi tải lên ảnh nghiệm thu:", err);
                    Alert.alert('Lỗi', 'Không thể gửi ảnh nghiệm thu. Vui lòng thử lại.');
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
              className="bg-[#3525CD] py-3.5 rounded-xl items-center flex-row justify-center gap-2"
              style={isLoading ? { opacity: 0.5 } : null}
            >
              <Upload size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">{isLoading ? 'Đang gửi...' : 'Xác nhận tải lên'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
