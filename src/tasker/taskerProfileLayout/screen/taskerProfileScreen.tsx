import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CheckCircle2, ChevronRight, Headphones, Lock, LogOut, UserRound, WalletCards, Wrench } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenKey } from '../../types';
import { AcceptTaskScreen, NearbyTasksScreen, TaskHistoryScreen } from '../../taskerTasksLayout';
import { EarningsDashboardScreen } from './earningsDashboardScreen';
import { ReviewsRatingsScreen } from './reviewsRatingsScreen';
import { ScheduleCalendarScreen } from './scheduleCalendarScreen';

type TaskerProfileScreenProps = {
  embedded?: boolean;
};

type ProfileLocalScreen = 'profile' | 'earnings' | 'reviews' | 'schedule' | 'nearby' | 'accept' | 'history';

export function TaskerProfileScreen({ embedded = false }: TaskerProfileScreenProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<ProfileLocalScreen>('profile');
  const back = () => setScreen('profile');
  const navigate = (next: TaskerScreenKey) => {
    if (next === 'earnings' || next === 'reviews' || next === 'schedule' || next === 'nearby' || next === 'accept' || next === 'history') {
      setScreen(next);
    }
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  if (screen === 'nearby') return <NearbyTasksScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'accept') return <AcceptTaskScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'history') return <TaskHistoryScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'earnings') return <EarningsDashboardScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'reviews') return <ReviewsRatingsScreen onBack={back} onNavigate={navigate} />;
  if (screen === 'schedule') return <ScheduleCalendarScreen onBack={back} onNavigate={navigate} />;

  const profile = mockTaskerData.profile;

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader title="Hồ sơ Tasker" subtitle={profile.level} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-8">
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
              <Text className="text-[#111C2D] text-[28px] font-extrabold text-center">{profile.name}</Text>
              <TaskerPill>{profile.title}</TaskerPill>
            </View>
            <Text className="text-[#464555] text-center mt-4 leading-6">{profile.bio}</Text>
            <View className="flex-row justify-between w-full mt-6">
              <ProfileStat value={`${profile.completedJobs}`} label="Công việc" />
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
              <Text className="text-white/70 text-[12px] mt-1">Rút tiền và giao dịch</Text>
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
          <Text className="text-[#111C2D] text-[20px] font-extrabold mb-4">Kỹ năng</Text>
          <View className="flex-row flex-wrap gap-2">
            {profile.skills.map((skill) => <TaskerPill key={skill}>{skill}</TaskerPill>)}
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
          <SettingsRow icon={UserRound} title="Chỉnh sửa hồ sơ cá nhân" />
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
    </View>
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
