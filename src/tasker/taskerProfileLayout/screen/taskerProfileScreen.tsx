import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CheckCircle2, ChevronRight, Headphones, Lock, LogOut, UserRound, WalletCards, Wrench, ShieldCheck, X, Upload } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenKey } from '../../types';
import { AcceptTaskScreen } from '../../taskerTasksLayout/screen/acceptTaskScreen';
import { NearbyTasksScreen } from '../../taskerTasksLayout/screen/nearbyTasksScreen';
import { TaskHistoryScreen } from '../../taskerTasksLayout/screen/taskHistoryScreen';
import { EarningsDashboardScreen } from './earningsDashboardScreen';
import { ReviewsRatingsScreen } from './reviewsRatingsScreen';
import { ScheduleCalendarScreen } from './scheduleCalendarScreen';
import { taskApplicationApi, userApi, walletApi } from '../../../../service/api';

type TaskerProfileScreenProps = {
  embedded?: boolean;
};

type ProfileLocalScreen = 'profile' | 'earnings' | 'reviews' | 'schedule' | 'nearby' | 'accept' | 'history';

export function TaskerProfileScreen({ embedded = false }: TaskerProfileScreenProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<ProfileLocalScreen>('profile');
  const [kycStatus, setKycStatus] = useState<string>(mockTaskerData.profile.kycStatus || 'verified');
  const [kycModalVisible, setKycModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  
  // Profile data states
  const [profileData, setProfileData] = useState<any>(null);
  const [completedJobsCount, setCompletedJobsCount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experience, setExperience] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [serviceAreasText, setServiceAreasText] = useState("");

  const back = () => setScreen('profile');
  const navigate = (next: TaskerScreenKey) => {
    setScreen(next as ProfileLocalScreen);
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const loadProfile = () => {
    userApi.getProfile()
      .then((res: any) => {
        const data = res.data || res;
        setProfileData(data);
        if (data.taskerProfile) {
          setBio(data.taskerProfile.bio || "");
          setHourlyRate(data.taskerProfile.hourlyRate ? data.taskerProfile.hourlyRate.toString() : "");
          setExperience(data.taskerProfile.experience || "");
          setSkillsText(data.taskerProfile.skills?.join(", ") || "");
          setServiceAreasText(data.taskerProfile.serviceAreas?.join(", ") || "");
        }
        if (data._id) {
          taskApplicationApi.getApplications({ taskerId: data._id })
            .then((appRes: any) => {
              const apps = Array.isArray(appRes) ? appRes : (appRes.data || []);
              const completed = apps.filter((a: any) => a.taskId?.status === "completed" || a.status === "accepted").length;
              setCompletedJobsCount(completed);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
      });

    walletApi.getWallet()
      .then((res: any) => {
        const wData = res.data || res;
        if (typeof wData?.balance === "number") {
          setWalletBalance(wData.balance);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (screen === 'nearby') return <NearbyTasksScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'accept') return <AcceptTaskScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'history') return <TaskHistoryScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'earnings') return <EarningsDashboardScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'reviews') return <ReviewsRatingsScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'schedule') return <ScheduleCalendarScreen onBack={back} onNavigate={navigate} />;

  const profile = mockTaskerData.profile;

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader title="Hồ sơ Tasker" subtitle={profile.level} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-28">
        <TaskerCard className="p-5 mb-5 bg-[#F0F3FF]">
          <View className="items-center">
            <View className="relative mb-4">
              <View className="w-32 h-32 rounded-full bg-white border-4 border-white items-center justify-center">
                <UserRound size={58} color={TASKER_COLORS.primary} />
              </View>
              <View className="absolute bottom-2 right-2 bg-[#3525CD] rounded-full p-2 border-2 border-white">
                <CheckCircle2 size={18} color="#FFFFFF" />
              </View>
            </View>
            <View className="items-center gap-2">
              <Text className="text-[#111C2D] text-[28px] font-extrabold text-center">{profileData?.fullName || profile.name}</Text>
              <TaskerPill>{profileData?.email || profile.title}</TaskerPill>
            </View>
            <Text className="text-[#464555] text-center mt-4 leading-6">{profileData?.taskerProfile?.bio || profile.bio}</Text>
            <View className="flex-row justify-between w-full mt-6">
              <ProfileStat value={`${completedJobsCount > 0 ? completedJobsCount : profile.completedJobs}`} label="Công việc" />
              <View className="w-[1px] bg-[#C7C4D8]" />
              <ProfileStat value={`${profile.rating}/5`} label="Đánh giá" />
              <View className="w-[1px] bg-[#C7C4D8]" />
              <ProfileStat value={profile.responseRate} label="Phản hồi" />
            </View>
          </View>
        </TaskerCard>

        {/* Wallet & Schedule Cards — equal height */}
        <View className="flex-row gap-3 mb-5">
          {/* Ví tiền */}
          <TouchableOpacity
            onPress={() => setScreen('earnings')}
            activeOpacity={0.88}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={[TASKER_COLORS.primary, TASKER_COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                taskerShadow,
                { borderRadius: 12, padding: 16, minHeight: 120 },
              ]}
            >
              <View
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <WalletCards size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white text-[16px] font-extrabold">Ví tiền</Text>
              <Text className="text-white/80 text-[12px] font-bold mt-1">
                {walletBalance !== null ? `${walletBalance.toLocaleString("vi-VN")}đ` : "Rút tiền và giao dịch"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Trạng thái rảnh */}
          <TouchableOpacity
            onPress={() => setScreen('schedule')}
            activeOpacity={0.88}
            style={{ flex: 1 }}
          >
            <View
              style={[
                taskerShadow,
                {
                  flex: 1, minHeight: 120, borderRadius: 12, padding: 16,
                  backgroundColor: '#DEE8FF',
                  borderWidth: 1, borderColor: 'rgba(199,196,216,0.6)',
                },
              ]}
            >
              <View
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  backgroundColor: 'rgba(199,196,216,0.4)',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#16A34A' }} />
              </View>
              <Text className="text-[#111C2D] text-[16px] font-extrabold">Trạng thái</Text>
              <Text className="text-[#464555] text-[12px] mt-1">Đang nhận việc mới</Text>
            </View>
          </TouchableOpacity>
        </View>


        <TaskerCard className="p-4 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Xác minh Danh tính (KYC)</Text>
            <View className={`px-3 py-1 rounded-full ${kycStatus === 'verified' ? 'bg-green-100' : kycStatus === 'pending' ? 'bg-amber-100' : 'bg-red-100'}`}>
              <Text className={`text-[12px] font-extrabold ${kycStatus === 'verified' ? 'text-green-700' : kycStatus === 'pending' ? 'text-amber-700' : 'text-red-700'}`}>
                {kycStatus === 'verified' ? '✓ Đã xác minh' : kycStatus === 'pending' ? '⏳ Đang chờ duyệt' : '⚠️ Chưa xác minh'}
              </Text>
            </View>
          </View>
          
          <Text className="text-[#464555] text-[13px] mb-3">
            Trường: <Text className="font-bold text-[#111C2D]">{profile.university || 'Đại học Bách Khoa TP.HCM'}</Text>
          </Text>
          <Text className="text-[#464555] text-[13px] mb-4">
            Mã sinh viên: <Text className="font-bold text-[#111C2D]">{profile.studentId || 'SV-2023884'}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => setKycModalVisible(true)}
            className="w-full bg-[#3525CD] py-3 rounded-xl items-center"
          >
            <Text className="text-white font-bold">
              {kycStatus === 'verified' ? 'Xem Hồ sơ CCCD / Thẻ SV' : kycStatus === 'pending' ? 'Xem trạng thái yêu cầu KYC' : 'Gửi ảnh CCCD & Thẻ Sinh viên'}
            </Text>
          </TouchableOpacity>
        </TaskerCard>

        <TaskerCard className="p-4 mb-5">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Kỹ năng</Text>
          <View className="flex-row flex-wrap gap-2">
            {(profileData?.taskerProfile?.skills || profile.skills).map((skill: string) => <TaskerPill key={skill}>{skill}</TaskerPill>)}
          </View>
        </TaskerCard>

        <TaskerCard className="p-4 mb-5">
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Xác thực</Text>
          {profile.verifications.map((item) => (
            <View key={item} className="flex-row items-center gap-3 mb-3">
              <CheckCircle2 size={20} color={TASKER_COLORS.primary} />
              <Text className="text-[#111C2D]">{item}</Text>
            </View>
          ))}
        </TaskerCard>

        <TaskerCard className="overflow-hidden mb-5">
          <View className="px-4 py-5 border-b border-[#E7EEFF]">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Cài đặt tài khoản</Text>
          </View>
          <SettingsRow icon={UserRound} title="Chỉnh sửa hồ sơ cá nhân" onPress={() => setEditModalVisible(true)} />
          <SettingsRow icon={Bell} title="Thông báo" subtitle="Bật/tắt thông báo đẩy và email" badge="Đang bật" />
          <SettingsRow icon={WalletCards} title="Phương thức thanh toán" subtitle="Quản lý ví và rút tiền" onPress={() => setScreen('earnings')} />
          <SettingsRow icon={Wrench} title="Đánh giá & nhận xét" subtitle="Xem uy tín từ khách hàng" onPress={() => setScreen('reviews')} />
          <SettingsRow icon={Lock} title="Bảo mật & Mật khẩu" />
        </TaskerCard>

        <TaskerCard className="p-5 bg-[#E7EEFF]">
          <View className="items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Headphones size={30} color={TASKER_COLORS.primary} />
            </View>
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Bạn cần trợ giúp?</Text>
            <Text className="text-[#464555] text-center">Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giải đáp thắc mắc của bạn.</Text>
            <TouchableOpacity className="px-6 py-3 rounded-xl border-2 border-[#3525CD] mt-2">
              <Text className="text-[#3525CD] font-extrabold">Liên hệ ngay</Text>
            </TouchableOpacity>
          </View>
        </TaskerCard>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-3 rounded-xl border-2 border-[#FFDAD6] bg-[#FFF8F7] py-4 mt-4 mb-4"
        >
          <LogOut size={20} color="#BA1A1A" />
          <Text className="text-[#BA1A1A] font-extrabold text-[15px]">Đăng xuất</Text>

        </TouchableOpacity>
      </ScrollView>

      {/* KYC Verification Modal */}
      <Modal visible={kycModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5 max-h-[85%]">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={24} color="#3525CD" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Xác minh Danh tính Sinh viên</Text>
              </View>
              <TouchableOpacity onPress={() => setKycModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
              <Text className="text-gray-600 text-sm mb-4">
                Hệ thống yêu cầu xác minh Căn cước công dân & Thẻ Sinh viên để bảo đảm uy tín cho Tasker và quyền lợi nhận task ngắn hạn.
              </Text>

              <Text className="font-bold text-gray-800 text-base mb-2">1. Mặt trước CCCD / CMND</Text>
              <View className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden border border-dashed border-gray-300 items-center justify-center mb-4">
                <Image
                  source={{ uri: profile.kycCardImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <Text className="font-bold text-gray-800 text-base mb-2">2. Thẻ Sinh viên (Đại học/Cao đẳng)</Text>
              <View className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden border border-dashed border-gray-300 items-center justify-center mb-5">
                <Image
                  source={{ uri: profile.studentCardImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {kycStatus === 'pending' ? (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <Text className="text-amber-800 font-bold text-sm">⏳ Yêu cầu KYC đang được Admin duyệt</Text>
                  <Text className="text-amber-700 text-xs mt-1">
                    Thời gian xét duyệt trung bình từ 15-30 phút. Bạn sẽ nhận được thông báo khi hoàn tất.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setKycStatus('pending');
                    Alert.alert('Thành công', 'Đã gửi ảnh CCCD & Thẻ Sinh viên tới Admin để phê duyệt!');
                    setKycModalVisible(false);
                  }}
                  className="bg-[#3525CD] py-3.5 rounded-xl items-center flex-row justify-center gap-2"
                >
                  <Upload size={18} color="#FFFFFF" />
                  <Text className="text-white font-bold text-base">Gửi duyệt KYC ngay</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5 max-h-[85%]">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <UserRound size={24} color="#3525CD" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Chỉnh sửa hồ sơ chuyên môn</Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
              <Text className="text-gray-600 text-xs mb-1 font-bold">Giới thiệu bản thân (Bio):</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Nhập giới thiệu..."
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-4"
                multiline
                numberOfLines={3}
              />

              <Text className="text-gray-600 text-xs mb-1 font-bold">Mức lương giờ (VNĐ/giờ):</Text>
              <TextInput
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="Ví dụ: 100000"
                keyboardType="numeric"
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-4"
              />

              <Text className="text-gray-600 text-xs mb-1 font-bold font-bold">Kinh nghiệm làm việc:</Text>
              <TextInput
                value={experience}
                onChangeText={setExperience}
                placeholder="Mô tả kinh nghiệm..."
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-4"
                multiline
                numberOfLines={2}
              />

              <Text className="text-gray-600 text-xs mb-1 font-bold">Kỹ năng (phân tách bằng dấu phẩy):</Text>
              <TextInput
                value={skillsText}
                onChangeText={setSkillsText}
                placeholder="VD: Dọn dẹp, Giặt ủi, Nấu ăn"
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-4"
              />

              <Text className="text-gray-600 text-xs mb-1 font-bold">Khu vực phục vụ (phân tách bằng dấu phẩy):</Text>
              <TextInput
                value={serviceAreasText}
                onChangeText={setServiceAreasText}
                placeholder="VD: Quận 1, Quận Bình Thạnh"
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 mb-5"
              />

              <TouchableOpacity
                onPress={() => {
                  const data = {
                    bio,
                    hourlyRate: Number(hourlyRate) || 0,
                    experience,
                    skills: skillsText.split(",").map(s => s.trim()).filter(Boolean),
                    serviceAreas: serviceAreasText.split(",").map(s => s.trim()).filter(Boolean)
                  };
                  userApi.updateTaskerProfile(data)
                    .then((res: any) => {
                      setProfileData(res.data || res);
                      Alert.alert("Thành công", "Đã cập nhật hồ sơ chuyên môn!");
                      setEditModalVisible(false);
                    })
                    .catch((err) => {
                      console.error(err);
                      Alert.alert("Thất bại", "Cập nhật hồ sơ thất bại.");
                    });
                }}
                className="bg-[#3525CD] py-3.5 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-base">Lưu thay đổi</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}




function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center flex-1">
      <Text className="text-[#3525CD] text-[22px] font-extrabold">{value}</Text>
      <Text className="text-[#464555] text-[11px] mt-1">{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, title, subtitle, badge, onPress }: { icon: TaskerIcon; title: string; subtitle?: string; badge?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="p-4 border-b border-[#E7EEFF] flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <IconTile icon={icon} size="sm" />
        <View className="flex-1">
          <Text className="text-[#111C2D] font-semibold">{title}</Text>
          {subtitle ? <Text className="text-[#464555] text-[12px] mt-1">{subtitle}</Text> : null}
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {badge ? <Text className="text-[#3525CD] text-[12px] font-bold">{badge}</Text> : null}
        <ChevronRight size={18} color="#777587" />
      </View>
    </TouchableOpacity>
  );
}
