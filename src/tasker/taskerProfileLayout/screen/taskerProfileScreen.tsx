import { Bell, CheckCircle2, ChevronRight, Headphones, Lock, UserRound, WalletCards, Wrench } from 'lucide-react-native';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { TaskerBottomNav } from '../../components/TaskerBottomNav';
import { GradientButton, IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerBottomTabKey, TaskerIcon, TaskerScreenKey } from '../../types';
import { AcceptTaskScreen, NearbyTasksScreen, TaskHistoryScreen } from '../../taskerTasksLayout';
import { EarningsDashboardScreen } from './earningsDashboardScreen';
import { ReviewsRatingsScreen } from './reviewsRatingsScreen';
import { ScheduleCalendarScreen } from './scheduleCalendarScreen';

type TaskerProfileScreenProps = {
  embedded?: boolean;
};

type ProfileLocalScreen = 'profile' | 'earnings' | 'reviews' | 'schedule' | 'nearby' | 'accept' | 'history';

export function TaskerProfileScreen({ embedded = false }: TaskerProfileScreenProps) {
  const [screen, setScreen] = useState<ProfileLocalScreen>('profile');
  const back = () => setScreen('profile');
  const navigate = (next: TaskerScreenKey) => {
    if (next === 'earnings' || next === 'reviews' || next === 'schedule' || next === 'nearby' || next === 'accept' || next === 'history') {
      setScreen(next);
    }
  };
  const handleBottomSelect = (tab: TaskerBottomTabKey) => {
    setScreen(tab === 'dashboard' ? 'profile' : tab === 'nearby' ? 'nearby' : tab === 'accept' ? 'accept' : tab === 'history' ? 'history' : 'profile');
  };
  const renderWithNav = (content: ReactNode) => (
    embedded ? content : (
      <TaskerProfileFrame active={getProfileBottomTab(screen)} onSelect={handleBottomSelect}>
        {content}
      </TaskerProfileFrame>
    )
  );

  if (screen === 'nearby') return renderWithNav(<NearbyTasksScreen onBack={back} onNavigate={navigate} />);
  if (screen === 'accept') return renderWithNav(<AcceptTaskScreen onBack={back} onNavigate={navigate} />);
  if (screen === 'history') return renderWithNav(<TaskHistoryScreen onBack={back} onNavigate={navigate} />);
  if (screen === 'earnings') return renderWithNav(<EarningsDashboardScreen onBack={back} onNavigate={navigate} />);
  if (screen === 'reviews') return renderWithNav(<ReviewsRatingsScreen onBack={back} onNavigate={navigate} />);
  if (screen === 'schedule') return renderWithNav(<ScheduleCalendarScreen onBack={back} onNavigate={navigate} />);

  const profile = mockTaskerData.profile;

  return renderWithNav(
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

        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity onPress={() => setScreen('earnings')} activeOpacity={0.88} className="flex-1">
            <GradientButton>
              <View className="items-start w-full">
                <Text className="text-white text-[18px] font-extrabold">Ví tiền</Text>
                <Text className="text-white/80 text-[12px] mt-1">Rút tiền và giao dịch</Text>
              </View>
            </GradientButton>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('schedule')} activeOpacity={0.88} className="flex-1">
            <TaskerCard className="p-4 bg-[#DEE8FF]">
              <Text className="text-[#111C2D] text-[18px] font-extrabold">Trạng thái rảnh</Text>
              <Text className="text-[#464555] text-[12px] mt-1">Đang nhận việc mới</Text>
              <View className="w-14 h-8 bg-[#3525CD] rounded-full p-1 items-end mt-4">
                <View className="w-6 h-6 rounded-full bg-white" />
              </View>
            </TaskerCard>
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
      </ScrollView>
    </View>
  );
}

function getProfileBottomTab(screen: ProfileLocalScreen): TaskerBottomTabKey {
  if (screen === 'nearby') return 'nearby';
  if (screen === 'accept') return 'accept';
  if (screen === 'history') return 'history';
  return 'profile';
}

function TaskerProfileFrame({
  active,
  onSelect,
  children,
}: {
  active: TaskerBottomTabKey;
  onSelect: (tab: TaskerBottomTabKey) => void;
  children: ReactNode;
}) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <View className="flex-1">{children}</View>
      <TaskerBottomNav active={active} onSelect={onSelect} />
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
