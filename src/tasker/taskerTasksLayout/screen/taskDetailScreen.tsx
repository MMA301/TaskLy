import { Bolt, CheckCircle2, Clock, Home, MapPin, Shield, Star, Utensils, ShieldAlert, DollarSign, Camera, X, Upload } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert, Image } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { GradientButton, IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

export function TaskDetailScreen({ onBack, onNavigate }: TaskerScreenProps) {
  const task = mockTaskerData.nearbyTasks[0];
  const [counterModalVisible, setCounterModalVisible] = useState<boolean>(false);
  const [counterPrice, setCounterPrice] = useState<string>('600000');
  const [counterNote, setCounterNote] = useState<string>('Tôi mang đầy đủ máy hút bụi công nghiệp & dụng cụ lau kính chuyên dụng.');
  const [proofModalVisible, setProofModalVisible] = useState<boolean>(false);
  const [proofUploaded, setProofUploaded] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);

  const handleSendCounterOffer = () => {
    Alert.alert('Đã gửi thương lượng', `Đã đề xuất mức giá ${parseInt(counterPrice).toLocaleString('vi-VN')}đ cho khách hàng ${task.customer}!`);
    setCounterModalVisible(false);
  };

  const handleSos = () => {
    Alert.alert(
      '🔴 CẢNH BÁO SOS KHẨN CẤP',
      `Đã phát tín hiệu SOS khẩn cấp kèm vị trí GPS (${task.address}) tới Đội hỗ trợ Taskly và Công an khu vực lân cận!`,
      [{ text: 'Đóng' }]
    );
    setSosActive(true);
  };

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Chi tiết công việc" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        
        {/* SOS Emergency Banner */}
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

        <TaskerCard className="p-5">
          <View className="flex-row flex-wrap gap-2 mb-3">
            <TaskerPill>Dọn dẹp nhà cửa</TaskerPill>
            <TaskerPill tone="tertiary">Khẩn cấp</TaskerPill>
            <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-emerald-800 text-[11px] font-extrabold">🛡️ Ví Escrow Tạm Giữ</Text>
            </View>
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

        {/* Proof of work Card */}
        <TaskerCard className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Bằng chứng nghiệm thu</Text>
            <View className={`px-2.5 py-1 rounded-full ${proofUploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-bold ${proofUploaded ? 'text-green-700' : 'text-gray-600'}`}>
                {proofUploaded ? '✓ Đã tải 2 ảnh' : 'Chưa tải ảnh'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setProofModalVisible(true)}
            className="w-full border-2 border-dashed border-[#3525CD] bg-[#F0F3FF] py-3.5 rounded-xl items-center flex-row justify-center gap-2 mb-2"
          >
            <Camera size={20} color="#3525CD" />
            <Text className="text-[#3525CD] font-bold text-sm">
              {proofUploaded ? 'Xem / Cập nhật ảnh nghiệm thu' : 'Chụp / Tải lên ảnh hoàn thành'}
            </Text>
          </TouchableOpacity>
        </TaskerCard>

        <TaskerCard className="p-4 overflow-hidden">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-3">Địa điểm & Check-in GPS</Text>
          <View className="flex-row items-start gap-2 mb-4">
            <MapPin size={18} color={TASKER_COLORS.error} />
            <Text className="text-[#111C2D] flex-1">{task.address}</Text>
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
          <TouchableOpacity onPress={() => setCounterModalVisible(true)} className="h-12 rounded-xl border border-[#3525CD] items-center justify-center mt-3">
            <Text className="text-[#3525CD] font-extrabold">Gửi Đề Nghị Giá Khác (Bidding)</Text>
          </TouchableOpacity>
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

            <Text className="text-gray-600 text-xs mb-1">Mức giá ban đầu của khách: <Text className="font-bold text-gray-800">{task.price}</Text></Text>
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
              onPress={() => {
                setProofUploaded(true);
                Alert.alert('Thành công', 'Đã lưu 2 ảnh bằng chứng nghiệm thu!');
                setProofModalVisible(false);
              }}
              className="bg-[#3525CD] py-3.5 rounded-xl items-center flex-row justify-center gap-2"
            >
              <Upload size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">Xác nhận tải lên</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
