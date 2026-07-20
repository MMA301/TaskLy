import { LinearGradient } from "expo-linear-gradient";
import {
  Banknote,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
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
  X,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockTaskerData } from "../../../../mockdata";
import { TaskerBottomNav } from "../../components/TaskerBottomNav";
import {
  MessagesScreen,
  NotificationsScreen,
} from "../../taskerMessagesLayout";
import {
  EarningsDashboardScreen,
  ReviewsRatingsScreen,
  ScheduleCalendarScreen,
  TaskerProfileScreen,
} from "../../taskerProfileLayout";
import {
  AcceptTaskScreen,
  MyAcceptedTasksScreen,
  NearbyTasksScreen,
  TaskDetailScreen,
  TaskHistoryScreen,
} from "../../taskerTasksLayout";
import { TASKER_COLORS, taskerShadow } from "../../taskerTheme";
import type {
  TaskerBottomTabKey,
  TaskerIcon,
  TaskerScreenKey,
} from "../../types";
import {
  MiniBarChart,
  SectionTitle,
  TaskerCard,
  TaskerHeader,
  TaskerPill,
} from "../components/TaskerPrimitives";

const taskerData = mockTaskerData;

const chartValues = [
  { label: "Th 2", value: 400 },
  { label: "Th 3", value: 650 },
  { label: "Th 4", value: 500 },
  { label: "Th 5", value: 300 },
  { label: "Hôm nay", value: 850, active: true },
  { label: "Th 7", value: 200 },
  { label: "CN", value: 150 },
];

const menuItems: {
  icon: TaskerIcon;
  label: string;
  sublabel: string;
  screen: TaskerScreenKey;
}[] = [
  {
    icon: Search,
    label: "Việc gần đây",
    sublabel: "Tìm công việc quanh bạn",
    screen: "nearby",
  },
  {
    icon: ShieldCheck,
    label: "Nhận việc",
    sublabel: "Xác nhận và nhận công việc",
    screen: "accept",
  },
  {
    icon: ListChecks,
    label: "Việc đã nhận",
    sublabel: "Quản lý các công việc hiện tại",
    screen: "accepted",
  },
  {
    icon: History,
    label: "Lịch sử",
    sublabel: "Xem lịch sử công việc",
    screen: "history",
  },
  {
    icon: MessageCircle,
    label: "Tin nhắn",
    sublabel: "Trò chuyện với khách hàng",
    screen: "messages",
  },
  {
    icon: Bell,
    label: "Thông báo",
    sublabel: "Cập nhật hoạt động mới nhất",
    screen: "notifications",
  },
  {
    icon: WalletCards,
    label: "Thu nhập",
    sublabel: "Theo dõi và rút tiền",
    screen: "earnings",
  },
  {
    icon: Star,
    label: "Đánh giá",
    sublabel: "Xem uy tín từ khách hàng",
    screen: "reviews",
  },
  {
    icon: CalendarDays,
    label: "Lịch trình",
    sublabel: "Quản lý lịch rảnh của bạn",
    screen: "schedule",
  },
];

export function TaskerHomeScreen() {
  const [screen, setScreen] = useState<TaskerScreenKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const goDashboard = () => setScreen("dashboard");
  const navigate = (next: TaskerScreenKey) => {
    setMenuOpen(false);
    setScreen(next);
  };
  const handleBottomSelect = (tab: TaskerBottomTabKey) => {
    setScreen(
      tab === "dashboard"
        ? "dashboard"
        : tab === "nearby"
          ? "nearby"
          : tab === "history"
            ? "history"
            : "profile",
    );
  };
  const activeBottomTab = getBottomTab(screen);

  if (screen === "nearby") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <NearbyTasksScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "detail") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <TaskDetailScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "accept") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <AcceptTaskScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "accepted") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <MyAcceptedTasksScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "history") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <TaskHistoryScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "messages") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <MessagesScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "notifications") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <NotificationsScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "earnings") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <EarningsDashboardScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "reviews") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <ReviewsRatingsScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "schedule") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <ScheduleCalendarScreen onBack={goDashboard} onNavigate={navigate} />
      </TaskerScreenFrame>
    );
  }
  if (screen === "profile") {
    return (
      <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
        <TaskerProfileScreen embedded />
      </TaskerScreenFrame>
    );
  }

  const profile = taskerData.profile;
  const upcoming = taskerData.nearbyTasks.slice(0, 3);

  return (
    <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
      <View className="flex-1 bg-[#F9F9FF]">
        <TaskerHeader
          onMenuPress={() => setMenuOpen(true)}
          right={
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => navigate("notifications")}
                className="w-10 h-10 rounded-full bg-white border border-[#D8E3FB] items-center justify-center"
              >
                <Bell size={18} color={TASKER_COLORS.muted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate("profile")}>
                <View className="w-10 h-10 rounded-full bg-[#E2DFFF] border-2 border-[#4F46E5] items-center justify-center">
                  <UserRound size={18} color={TASKER_COLORS.primary} />
                </View>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Hamburger Nav Modal */}
        <Modal
          visible={menuOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setMenuOpen(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                className="bg-white rounded-b-3xl overflow-hidden"
                style={taskerShadow}
              >
                {/* Modal Header */}
                <View className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-[#E7EEFF]">
                  <View>
                    <Text className="text-[#3525CD] text-[22px] font-extrabold">
                      Taskly
                    </Text>
                    <Text className="text-[#464555] text-[12px] mt-0.5">
                      Điều hướng nhanh
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-[#F0F3FF] items-center justify-center"
                  >
                    <X size={18} color={TASKER_COLORS.primary} />
                  </TouchableOpacity>
                </View>
                {/* Menu Items */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="pb-4"
                >
                  {menuItems.map((item, index) => (
                    <MenuRow
                      key={item.screen}
                      item={item}
                      onPress={() => navigate(item.screen)}
                      isLast={index === menuItems.length - 1}
                    />
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pt-6 pb-10"
        >
          {/* Greeting */}
          <View className="mb-6">
            <Text className="text-[#111C2D] text-[28px] font-extrabold">
              {/* Chào buổi sáng, {profile.displayName}! */}
            </Text>
            <Text className="text-[#464555] text-[15px] mt-1">
              Hôm nay bạn có 3 công việc mới cần hoàn thành.
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="gap-4 mb-8">
            <TouchableOpacity
              onPress={() => navigate("earnings")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[TASKER_COLORS.primary, TASKER_COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  taskerShadow,
                  {
                    borderRadius: 20,
                    minHeight: 152,
                    padding: 24,
                    overflow: "hidden",
                  },
                ]}
              >
                {/* Decorative background icon */}
                <View
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    opacity: 0.12,
                  }}
                >
                  <Banknote size={110} color="#FFFFFF" />
                </View>

                {/* Label */}
                <Text
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Thu nhập hôm nay
                </Text>

                {/* Amount + trend */}
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 38,
                      fontWeight: "800",
                      lineHeight: 44,
                    }}
                  >
                    {profile.todayIncome}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        borderRadius: 99,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <TrendingUp size={12} color="#FFFFFF" />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: "700",
                        }}
                      >
                        +15%
                      </Text>
                    </View>
                    <Text
                      style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                    >
                      so với hôm qua
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TaskerCard className="flex-1 p-4">
                <View className="gap-2">
                  <CheckCircle2 size={22} color={TASKER_COLORS.primary} />
                  <Text className="text-[#464555] text-[12px] font-semibold">
                    Đã hoàn thành
                  </Text>
                  <Text className="text-[#111C2D] text-[28px] font-extrabold">
                    24
                  </Text>
                </View>
              </TaskerCard>
              <TaskerCard className="flex-1 p-4">
                <View className="gap-2">
                  <Star size={22} color={TASKER_COLORS.secondary} />
                  <Text className="text-[#464555] text-[12px] font-semibold">
                    Tỷ lệ thành công
                  </Text>
                  <Text className="text-[#111C2D] text-[28px] font-extrabold">
                    {profile.successRate}
                  </Text>
                </View>
              </TaskerCard>
            </View>

            {/* Online Toggle */}
            <TaskerCard className="p-4 bg-[#DEE8FF]">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <View>
                    <Text className="text-[#111C2D] font-extrabold">
                      Trực tuyến
                    </Text>
                    <Text className="text-[#464555] text-[12px] mt-0.5">
                      Đang nhận việc mới
                    </Text>
                  </View>
                </View>
                <View className="w-14 h-8 rounded-full bg-[#3525CD] p-1 items-end">
                  <View className="w-6 h-6 rounded-full bg-white" />
                </View>
              </View>
            </TaskerCard>
          </View>

          {/* Performance Chart */}
          <View className="mb-8">
            <View className="flex-row items-end justify-between mb-4">
              <Text className="text-[#111C2D] text-[20px] font-extrabold">
                Biểu đồ hiệu suất
              </Text>
              <View className="flex-row gap-2">
                <TaskerPill>Tuần này</TaskerPill>
                <TaskerPill tone="neutral">Tháng này</TaskerPill>
              </View>
            </View>
            <MiniBarChart values={chartValues} />
          </View>

          {/* Upcoming Tasks */}
          <SectionTitle title="Công việc sắp tới" action="Xem tất cả" />
          <View className="gap-4">
            {upcoming.map((task, index) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => navigate(index === 0 ? "detail" : "nearby")}
                activeOpacity={0.86}
              >
                <TaskerCard className="p-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <TaskerPill
                      tone={
                        index === 0
                          ? "secondary"
                          : index === 1
                            ? "primary"
                            : "tertiary"
                      }
                    >
                      {task.category}
                    </TaskerPill>
                    <Text className="text-[#3525CD] font-extrabold">
                      {task.price}
                    </Text>
                  </View>
                  <Text className="text-[#111C2D] font-bold text-[15px] mb-2">
                    {task.title}
                  </Text>
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Clock size={14} color={TASKER_COLORS.muted} />
                      <Text className="text-[#464555] text-[12px]">
                        {task.time}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MapPinned size={14} color={TASKER_COLORS.muted} />
                      <Text className="text-[#464555] text-[12px]">
                        {task.distance}
                      </Text>
                    </View>
                  </View>
                </TaskerCard>
              </TouchableOpacity>
            ))}
          </View>

          {/* Find Nearby CTA */}
          <TouchableOpacity
            onPress={() => navigate("nearby")}
            activeOpacity={0.9}
            className="mt-6"
          >
            <TaskerCard className="p-5 bg-[#E7EEFF] border-dashed">
              <View className="items-center gap-2">
                <View className="w-12 h-12 rounded-full bg-[#E2DFFF] items-center justify-center">
                  <Navigation size={22} color={TASKER_COLORS.primary} />
                </View>
                <Text className="text-[#111C2D] font-bold">
                  Tìm việc mới quanh bạn
                </Text>
                <Text className="text-[#464555] text-[12px] text-center">
                  Mở bản đồ công việc gần đây và các bộ lọc.
                </Text>
              </View>
            </TaskerCard>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TaskerScreenFrame>
  );
}

function getBottomTab(screen: TaskerScreenKey): TaskerBottomTabKey {
  if (
    screen === "nearby" ||
    screen === "detail" ||
    screen === "accepted" ||
    screen === "messages" ||
    screen === "notifications"
  )
    return "nearby";
  if (screen === "history") return "history";
  if (
    screen === "profile" ||
    screen === "earnings" ||
    screen === "reviews" ||
    screen === "schedule"
  )
    return "profile";
  return "dashboard";
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
    <SafeAreaView
      className="flex-1 bg-[#F9F9FF]"
      edges={["top", "bottom", "left", "right"]}
    >
      <View className="flex-1">{children}</View>
      <TaskerBottomNav active={active} onSelect={onSelect} />
    </SafeAreaView>
  );
}

function MenuRow({
  item,
  onPress,
  isLast,
}: {
  item: { icon: TaskerIcon; label: string; sublabel: string };
  onPress: () => void;
  isLast: boolean;
}) {
  const Icon = item.icon;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-5 py-3.5 gap-4 ${isLast ? "" : "border-b border-[#F0F3FF]"}`}
    >
      <View className="w-10 h-10 rounded-xl bg-[#E2DFFF] items-center justify-center">
        <Icon size={19} color={TASKER_COLORS.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-[#111C2D] font-semibold text-[14px]">
          {item.label}
        </Text>
        <Text className="text-[#777587] text-[12px] mt-0.5" numberOfLines={1}>
          {item.sublabel}
        </Text>
      </View>
      <ChevronRight size={17} color="#C7C4D8" />
    </TouchableOpacity>
  );
}
