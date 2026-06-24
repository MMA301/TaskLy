import { LinearGradient } from 'expo-linear-gradient';
import {
  Banknote,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  History,
  ListChecks,
  MapPinned,
  MessageCircle,
  Navigation,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  UserRound,
  WalletCards,
} from 'lucide-react-native';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockTaskerData } from '../../../../mockdata';
import { TaskerBottomNav } from '../../components/TaskerBottomNav';
import {
  AcceptTaskScreen,
  MyAcceptedTasksScreen,
  NearbyTasksScreen,
  TaskDetailScreen,
  TaskHistoryScreen,
} from '../../taskerTasksLayout';
import { MessagesScreen, NotificationsScreen } from '../../taskerMessagesLayout';
import { EarningsDashboardScreen, ReviewsRatingsScreen, ScheduleCalendarScreen, TaskerProfileScreen } from '../../taskerProfileLayout';
import {
  IconTile,
  MiniBarChart,
  SectionTitle,
  TaskerCard,
  TaskerHeader,
  TaskerPill,
} from '../components/TaskerPrimitives';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerBottomTabKey, TaskerIcon, TaskerScreenKey } from '../../types';

const taskerData = mockTaskerData;

const chartValues = [
  { label: 'Th 2', value: 400 },
  { label: 'Th 3', value: 650 },
  { label: 'Th 4', value: 500 },
  { label: 'Th 5', value: 300 },
  { label: 'Hôm nay', value: 850, active: true },
  { label: 'Th 7', value: 200 },
  { label: 'CN', value: 150 },
];

export function TaskerHomeScreen() {
  const [screen, setScreen] = useState<TaskerScreenKey>('dashboard');
  const goDashboard = () => setScreen('dashboard');
  const navigate = (next: TaskerScreenKey) => setScreen(next);
  const handleBottomSelect = (tab: TaskerBottomTabKey) => {
    setScreen(tab === 'dashboard' ? 'dashboard' : tab === 'nearby' ? 'nearby' : tab === 'accept' ? 'accept' : tab === 'history' ? 'history' : 'profile');
  };
  const activeBottomTab = getBottomTab(screen);

  if (screen === 'nearby') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><NearbyTasksScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'detail') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskDetailScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'accept') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><AcceptTaskScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'accepted') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><MyAcceptedTasksScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'history') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskHistoryScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'messages') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><MessagesScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'notifications') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><NotificationsScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'earnings') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><EarningsDashboardScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'reviews') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><ReviewsRatingsScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'schedule') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><ScheduleCalendarScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  }
  if (screen === 'profile') {
    return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskerProfileScreen embedded /></TaskerScreenFrame>;
  }

  const profile = taskerData.profile;
  const upcoming = taskerData.nearbyTasks.slice(0, 3);

  return (
    <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
      <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader
        right={
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => navigate('notifications')}
              className="w-10 h-10 rounded-full bg-white border border-[#D8E3FB] items-center justify-center"
            >
              <Bell size={18} color={TASKER_COLORS.muted} />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-[#E2DFFF] border-2 border-[#4F46E5] items-center justify-center">
              <UserRound size={18} color={TASKER_COLORS.primary} />
            </View>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-10">
        <View className="mb-6">
          <Text className="text-[#111C2D] text-[28px] font-extrabold">
            Chào buổi sáng, {profile.displayName}!
          </Text>
          <Text className="text-[#464555] text-[15px] mt-1">
            Hôm nay bạn có 3 công việc mới cần hoàn thành.
          </Text>
        </View>

        <View className="gap-4 mb-8">
          <TouchableOpacity onPress={() => navigate('earnings')} activeOpacity={0.9}>
            <LinearGradient
              colors={[TASKER_COLORS.primary, TASKER_COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-xl p-6 min-h-[160px] justify-between"
              style={taskerShadow}
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-white/90 text-[12px] font-bold uppercase tracking-wider">Thu nhập hôm nay</Text>
                <Banknote size={48} color="rgba(255,255,255,0.25)" />
              </View>
              <View>
                <Text className="text-white text-[32px] font-extrabold">{profile.todayIncome}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <TrendingUp size={14} color="#FFFFFF" />
                  <Text className="text-white text-[12px] font-semibold">+15% so với hôm qua</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row gap-4">
            <TaskerCard className="flex-1 p-4">
              <View className="flex-row items-center gap-3">
                <IconTile icon={CheckCircle2} />
                <View>
                  <Text className="text-[#464555] text-[12px] font-semibold">Đã hoàn thành</Text>
                  <Text className="text-[#111C2D] text-[24px] font-extrabold">24</Text>
                </View>
              </View>
            </TaskerCard>
            <TaskerCard className="flex-1 p-4">
              <View className="flex-row items-center gap-3">
                <IconTile icon={Star} tone="tertiary" />
                <View>
                  <Text className="text-[#464555] text-[12px] font-semibold">Tỷ lệ thành công</Text>
                  <Text className="text-[#111C2D] text-[24px] font-extrabold">{profile.successRate}</Text>
                </View>
              </View>
            </TaskerCard>
          </View>

          <TaskerCard className="p-4 bg-[#DEE8FF]">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="text-[#111C2D] font-bold">Trực tuyến</Text>
              </View>
              <View className="w-12 h-7 rounded-full bg-[#3525CD] p-1 items-end">
                <View className="w-5 h-5 rounded-full bg-white" />
              </View>
            </View>
          </TaskerCard>
        </View>

        <SectionTitle title="Lối tắt kiểm thử" action="12 màn" />
        <View className="flex-row flex-wrap gap-3 mb-8">
          <QuickAction icon={Search} label="Nearby Tasks" onPress={() => navigate('nearby')} />
          <QuickAction icon={ListChecks} label="Task Detail" onPress={() => navigate('detail')} />
          <QuickAction icon={ShieldCheck} label="Accept Task" onPress={() => navigate('accept')} />
          <QuickAction icon={CheckCircle2} label="My Accepted" onPress={() => navigate('accepted')} />
          <QuickAction icon={History} label="Task History" onPress={() => navigate('history')} />
          <QuickAction icon={MessageCircle} label="Messages" onPress={() => navigate('messages')} />
          <QuickAction icon={Bell} label="Notifications" onPress={() => navigate('notifications')} />
          <QuickAction icon={WalletCards} label="Earnings" onPress={() => navigate('earnings')} />
          <QuickAction icon={Star} label="Reviews" onPress={() => navigate('reviews')} />
          <QuickAction icon={CalendarDays} label="Schedule" onPress={() => navigate('schedule')} />
        </View>

        <View className="mb-8">
          <View className="flex-row items-end justify-between mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Biểu đồ hiệu suất</Text>
            <View className="flex-row gap-2">
              <TaskerPill>Tuần này</TaskerPill>
              <TaskerPill tone="neutral">Tháng này</TaskerPill>
            </View>
          </View>
          <MiniBarChart values={chartValues} />
        </View>

        <SectionTitle title="Công việc sắp tới" action="Xem tất cả" />
        <View className="gap-4">
          {upcoming.map((task, index) => (
            <TouchableOpacity key={task.id} onPress={() => navigate(index === 0 ? 'detail' : 'nearby')} activeOpacity={0.86}>
              <TaskerCard className="p-4">
                <View className="flex-row justify-between items-start mb-3">
                  <TaskerPill tone={index === 0 ? 'secondary' : index === 1 ? 'primary' : 'tertiary'}>{task.category}</TaskerPill>
                  <Text className="text-[#3525CD] font-extrabold">{task.price}</Text>
                </View>
                <Text className="text-[#111C2D] font-bold text-[15px] mb-2">{task.title}</Text>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color={TASKER_COLORS.muted} />
                    <Text className="text-[#464555] text-[12px]">{task.time}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPinned size={14} color={TASKER_COLORS.muted} />
                    <Text className="text-[#464555] text-[12px]">{task.distance}</Text>
                  </View>
                </View>
              </TaskerCard>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => navigate('nearby')} activeOpacity={0.9} className="mt-6">
          <TaskerCard className="p-5 bg-[#E7EEFF] border-dashed">
            <View className="items-center gap-2">
              <View className="w-12 h-12 rounded-full bg-[#E2DFFF] items-center justify-center">
                <Navigation size={22} color={TASKER_COLORS.primary} />
              </View>
              <Text className="text-[#111C2D] font-bold">Tìm việc mới quanh bạn</Text>
              <Text className="text-[#464555] text-[12px] text-center">Mở bản đồ công việc gần đây và các bộ lọc giống Stitch.</Text>
            </View>
          </TaskerCard>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </TaskerScreenFrame>
  );
}

function getBottomTab(screen: TaskerScreenKey): TaskerBottomTabKey {
  if (screen === 'nearby' || screen === 'detail' || screen === 'accepted' || screen === 'messages' || screen === 'notifications') return 'nearby';
  if (screen === 'accept') return 'accept';
  if (screen === 'history') return 'history';
  if (screen === 'profile' || screen === 'earnings' || screen === 'reviews' || screen === 'schedule') return 'profile';
  return 'dashboard';
}

function TaskerScreenFrame({
  active,
  onSelect,
  children,
}: {
  active: TaskerBottomTabKey;
  onSelect: (tab: TaskerBottomTabKey) => void;
  children: ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-1">{children}</View>
      <TaskerBottomNav active={active} onSelect={onSelect} />
    </SafeAreaView>
  );
}

function QuickAction({ icon: Icon, label, onPress }: { icon: TaskerIcon; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      className="bg-white border border-[#C7C4D8] rounded-xl p-3 w-[31%] min-h-[94px] items-center justify-center"
      style={taskerShadow}
    >
      <Icon size={22} color={TASKER_COLORS.primary} />
      <Text className="text-[#111C2D] text-[11px] font-bold text-center mt-2" numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
