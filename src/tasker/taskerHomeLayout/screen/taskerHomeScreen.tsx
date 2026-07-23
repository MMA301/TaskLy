import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Banknote, Bell, BriefcaseBusiness, CheckCircle2, ChevronRight, Clock, History, MapPin, MessageCircle, Play, Search, Star, TrendingUp, UserRound, WalletCards, X,} from "lucide-react-native";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskerBottomNav } from "../../components/TaskerBottomNav";
import { MessagesScreen } from "../../taskerMessagesLayout/screen/messagesScreen";
import { NotificationsScreen } from "../../taskerMessagesLayout/screen/notificationsScreen";
import { EarningsDashboardScreen } from "../../taskerProfileLayout/screen/earningsDashboardScreen";
import { ReviewsRatingsScreen } from "../../taskerProfileLayout/screen/reviewsRatingsScreen";
import { ScheduleCalendarScreen } from "../../taskerProfileLayout/screen/scheduleCalendarScreen";
import { TaskerProfileScreen } from "../../taskerProfileLayout/screen/taskerProfileScreen";
import { AcceptTaskScreen } from "../../taskerTasksLayout/screen/acceptTaskScreen";
import { MyAcceptedTasksScreen } from "../../taskerTasksLayout/screen/myAcceptedTasksScreen";
import { NearbyTasksScreen } from "../../taskerTasksLayout/screen/nearbyTasksScreen";
import { TaskDetailScreen } from "../../taskerTasksLayout/screen/taskDetailScreen";
import { TaskHistoryScreen } from "../../taskerTasksLayout/screen/taskHistoryScreen";
import { TASKER_COLORS, taskerShadow } from "../../taskerTheme";
import type { TaskerBottomTabKey, TaskerIcon, TaskerScreenKey } from "../../types";

import { taskApplicationApi, userApi } from "../../../../service/api";
import { setSelectedTaskId } from "../../../session";

export function TaskerHomeScreen() {
  const [screen, setScreen] = useState<TaskerScreenKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userApi.getProfile()
      .then((res: any) => {
        const user = res.data || res;
        setCurrentUser(user);
        return taskApplicationApi.getApplications({ taskerId: user._id });
      })
      .then((appRes: any) => {
        const apps = Array.isArray(appRes) ? appRes : (appRes.data || []);
        setApplications(apps);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const goDashboard = () => setScreen("dashboard");
  const navigate = (next: TaskerScreenKey) => {
    setMenuOpen(false);
    setScreen(next);
  };
  const handleBottomSelect = (tab: TaskerBottomTabKey) => {
    setScreen(
      tab === "dashboard" ? "dashboard"
        : tab === "nearby" ? "nearby"
          : tab === "history" ? "history"
            : "profile",
    );
  };
  const activeBottomTab = getBottomTab(screen);

  if (screen === "nearby") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><NearbyTasksScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "detail") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskDetailScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "accept") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><AcceptTaskScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "accepted") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><MyAcceptedTasksScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "history") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskHistoryScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "messages") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><MessagesScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "notifications") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><NotificationsScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "earnings") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><EarningsDashboardScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "reviews") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><ReviewsRatingsScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "schedule") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><ScheduleCalendarScreen onBack={goDashboard} onNavigate={navigate} /></TaskerScreenFrame>;
  if (screen === "profile") return <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}><TaskerProfileScreen embedded /></TaskerScreenFrame>;

  // ---- Computed stats from API ----
  const completedApps = applications.filter(a => a.taskId?.status === "completed");
  const inProgressApps = applications.filter(a => a.taskId?.status === "in_progress" || a.status === "accepted");
  const pendingApps = applications.filter(a => a.status === "pending");
  const totalEarnings = completedApps.reduce((acc, a) => acc + (a.bidPrice || a.taskId?.price || 0), 0);

  const displayName = currentUser?.fullName?.split(" ").pop() || "Tasker";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <TaskerScreenFrame active={activeBottomTab} onSelect={handleBottomSelect}>
      <View className="flex-1 bg-[#F5F7FF]">
        {/* ---- Header ---- */}
        <View className="bg-white border-b border-[#E7EEFF] px-4 h-16 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setMenuOpen(true)} className="w-10 h-10 rounded-full items-center justify-center">
            <View className="gap-1">
              <View className="w-5 h-0.5 bg-[#3525CD] rounded-full" />
              <View className="w-4 h-0.5 bg-[#3525CD] rounded-full" />
              <View className="w-5 h-0.5 bg-[#3525CD] rounded-full" />
            </View>
          </TouchableOpacity>
          <Text className="text-[#3525CD] text-[22px] font-extrabold tracking-tight">Taskly</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => navigate("notifications")}
              className="w-10 h-10 rounded-full bg-[#F0F3FF] items-center justify-center"
            >
              <Bell size={18} color={TASKER_COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate("profile")} className="w-9 h-9 rounded-full bg-[#E2DFFF] border-2 border-[#4F46E5] items-center justify-center">
              <UserRound size={17} color={TASKER_COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Hamburger Modal ---- */}
        <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
          <Pressable className="flex-1 bg-black/40" onPress={() => setMenuOpen(false)}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-b-3xl overflow-hidden" style={taskerShadow}>
                <View className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-[#E7EEFF]">
                  <View>
                    <Text className="text-[#3525CD] text-[22px] font-extrabold">Taskly</Text>
                    <Text className="text-[#464555] text-[12px] mt-0.5">Điều hướng nhanh</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMenuOpen(false)} className="w-9 h-9 rounded-full bg-[#F0F3FF] items-center justify-center">
                    <X size={18} color={TASKER_COLORS.primary} />
                  </TouchableOpacity>
                </View>
                {[
                  { icon: Search, label: "Tìm việc", sublabel: "Công việc mới quanh bạn", screen: "nearby" as TaskerScreenKey },
                  { icon: History, label: "Lịch sử ứng tuyển", sublabel: "Các việc đã nộp đơn", screen: "history" as TaskerScreenKey },
                  { icon: MessageCircle, label: "Tin nhắn", sublabel: "Trò chuyện với khách hàng", screen: "messages" as TaskerScreenKey },
                  { icon: WalletCards, label: "Thu nhập", sublabel: "Theo dõi và rút tiền", screen: "earnings" as TaskerScreenKey },
                  { icon: Star, label: "Đánh giá", sublabel: "Xem uy tín từ khách hàng", screen: "reviews" as TaskerScreenKey },
                ].map((item, idx, arr) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity key={item.screen} onPress={() => navigate(item.screen)} activeOpacity={0.7}
                      className={`flex-row items-center px-5 py-3.5 gap-4 ${idx < arr.length - 1 ? "border-b border-[#F0F3FF]" : ""}`}>
                      <View className="w-10 h-10 rounded-xl bg-[#E2DFFF] items-center justify-center">
                        <Icon size={19} color={TASKER_COLORS.primary} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[#111C2D] font-semibold text-[14px]">{item.label}</Text>
                        <Text className="text-[#777587] text-[12px] mt-0.5">{item.sublabel}</Text>
                      </View>
                      <ChevronRight size={17} color="#C7C4D8" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* ---- Hero Gradient Banner ---- */}
          <LinearGradient
            colors={["#3525CD", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 }}
          >
            {/* Greeting */}
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" }}>
              {greeting},
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "800", marginTop: 2, marginBottom: 20 }}>
              {isLoading ? "..." : displayName} 👋
            </Text>

            {/* Online Toggle */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 16, padding: 14, marginBottom: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: isOnline ? "#4ADE80" : "#94A3B8" }} />
                <View>
                  <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}>{isOnline ? "Đang trực tuyến" : "Ngoại tuyến"}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 1 }}>
                    {isOnline ? "Đang nhận việc mới" : "Không nhận việc"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: "#64748B", true: "#4ADE80" }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Stats Row */}
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <StatBubble label="Tổng thu nhập" value={totalEarnings.toLocaleString("vi-VN") + "đ"} />
                <StatBubble label="Đã hoàn thành" value={completedApps.length.toString()} />
                <StatBubble label="Đang làm việc" value={inProgressApps.length.toString()} />
              </View>
            )}
          </LinearGradient>

          {/* ---- Pending Badge ---- */}
          {pendingApps.length > 0 && (
            <TouchableOpacity
              onPress={() => navigate("history")}
              style={{ marginHorizontal: 16, marginTop: -12, backgroundColor: "#FEF3C7", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#FDE68A", ...taskerShadow }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ backgroundColor: "#F59E0B", width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                  <Clock size={18} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={{ color: "#92400E", fontWeight: "800", fontSize: 13 }}>Đang chờ phản hồi từ khách</Text>
                  <Text style={{ color: "#B45309", fontSize: 11, marginTop: 1 }}>{pendingApps.length} đơn ứng tuyển đang chờ duyệt</Text>
                </View>
              </View>
              <ArrowRight size={18} color="#B45309" />
            </TouchableOpacity>
          )}

          {/* ---- In-Progress Tasks ---- */}
          {inProgressApps.length > 0 && (
            <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: "#111C2D", fontSize: 18, fontWeight: "800" }}>Đang thực hiện</Text>
                <TouchableOpacity onPress={() => navigate("history")}>
                  <Text style={{ color: TASKER_COLORS.primary, fontSize: 13, fontWeight: "700" }}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: 10 }}>
                {inProgressApps.slice(0, 3).map((app: any) => {
                  const task = app.taskId || {};
                  const price = typeof app.bidPrice === "number" ? app.bidPrice.toLocaleString("vi-VN") + "đ" : (typeof task.price === "number" ? task.price.toLocaleString("vi-VN") + "đ" : "—");
                  return (
                    <TouchableOpacity
                      key={app._id}
                      onPress={() => { setSelectedTaskId(task._id || task.id); navigate("detail"); }}
                      activeOpacity={0.86}
                      style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#E2E8F0", ...taskerShadow }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <View style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
                          <Text style={{ color: "#4F46E5", fontWeight: "800", fontSize: 11 }}>
                            {app.status === "accepted" && task.status === "in_progress" ? "🔵 Đang làm" : "✅ Đã được chọn"}
                          </Text>
                        </View>
                        <Text style={{ color: TASKER_COLORS.primary, fontWeight: "800", fontSize: 15 }}>{price}</Text>
                      </View>
                      <Text style={{ color: "#111C2D", fontWeight: "700", fontSize: 14, marginBottom: 6 }} numberOfLines={1}>{task.title || "Công việc"}</Text>
                      {task.address ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <MapPin size={13} color={TASKER_COLORS.muted} />
                          <Text style={{ color: "#6B7280", fontSize: 12 }} numberOfLines={1}>{task.address}</Text>
                        </View>
                      ) : null}
                      {(app.status === "accepted" && task.status === "in_progress") && (
                        <View style={{ marginTop: 10, backgroundColor: "#EEF2FF", borderRadius: 10, padding: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Play size={13} color="#4F46E5" />
                          <Text style={{ color: "#4F46E5", fontWeight: "700", fontSize: 11 }}>Nhấn để xem chi tiết & gửi ảnh nghiệm thu</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ---- Quick Actions Grid ---- */}
          <View style={{ marginTop: 28, paddingHorizontal: 16 }}>
            <Text style={{ color: "#111C2D", fontSize: 18, fontWeight: "800", marginBottom: 14 }}>Thao tác nhanh</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <QuickCard icon={Search} label="Tìm việc" color="#3525CD" bg="#EEF2FF" onPress={() => navigate("nearby")} />
              <QuickCard icon={History} label="Lịch sử" color="#7C3AED" bg="#F5F3FF" onPress={() => navigate("history")} />
              <QuickCard icon={Banknote} label="Thu nhập" color="#059669" bg="#ECFDF5" onPress={() => navigate("earnings")} />
              <QuickCard icon={Star} label="Đánh giá" color="#D97706" bg="#FFFBEB" onPress={() => navigate("reviews")} />
            </View>
          </View>

          {/* ---- Empty state: no in-progress / pending ---- */}
          {!isLoading && inProgressApps.length === 0 && pendingApps.length === 0 && (
            <TouchableOpacity
              onPress={() => navigate("nearby")}
              activeOpacity={0.88}
              style={{ marginHorizontal: 16, marginTop: 24 }}
            >
              <LinearGradient
                colors={["#E8EAFF", "#F0F3FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 20, padding: 24, alignItems: "center", borderWidth: 1.5, borderColor: "#C7C4D8", borderStyle: "dashed" }}
              >
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#E2DFFF", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <BriefcaseBusiness size={26} color={TASKER_COLORS.primary} />
                </View>
                <Text style={{ color: "#111C2D", fontWeight: "800", fontSize: 16, textAlign: "center", marginBottom: 6 }}>Chưa có việc nào đang chạy</Text>
                <Text style={{ color: "#6B7280", fontSize: 13, textAlign: "center", marginBottom: 16 }}>Tìm và ứng tuyển ngay để bắt đầu kiếm thu nhập!</Text>
                <View style={{ backgroundColor: TASKER_COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24, flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Search size={15} color="#FFFFFF" />
                  <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}>Tìm việc ngay</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* ---- Achievement row ---- */}
          {!isLoading && completedApps.length > 0 && (
            <View style={{ marginTop: 24, marginHorizontal: 16, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", flexDirection: "row", alignItems: "center", gap: 14, ...taskerShadow }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={24} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#111C2D", fontWeight: "800", fontSize: 15 }}>Bạn đã hoàn thành {completedApps.length} công việc!</Text>
                <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>Tổng thu nhập: {totalEarnings.toLocaleString("vi-VN")}đ</Text>
              </View>
              <TouchableOpacity onPress={() => navigate("earnings")}>
                <View style={{ backgroundColor: "#FEF3C7", borderRadius: 10, padding: 8 }}>
                  <TrendingUp size={18} color="#D97706" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </TaskerScreenFrame>
  );
}

function StatBubble({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 12, alignItems: "center" }}>
      <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 18 }}>{value}</Text>
      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 3, textAlign: "center" }}>{label}</Text>
    </View>
  );
}

function QuickCard({ icon: Icon, label, color, bg, onPress }: { icon: TaskerIcon; label: string; color: string; bg: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1, backgroundColor: bg, borderRadius: 16, padding: 14, alignItems: "center", gap: 8, borderWidth: 1, borderColor: `${color}22` }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${color}22`, alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </View>
      <Text style={{ color: "#111C2D", fontWeight: "700", fontSize: 11, textAlign: "center" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function getBottomTab(screen: TaskerScreenKey): TaskerBottomTabKey {
  if (["nearby", "detail", "accepted", "messages", "notifications", "accept"].includes(screen)) return "nearby";
  if (screen === "history") return "history";
  if (["profile", "earnings", "reviews", "schedule"].includes(screen)) return "profile";
  return "dashboard";
}

function TaskerScreenFrame({ active, onSelect, children }: { active: TaskerBottomTabKey; onSelect: (tab: TaskerBottomTabKey) => void; children: ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FF]" edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1">{children}</View>
      <TaskerBottomNav active={active} onSelect={onSelect} />
    </SafeAreaView>
  );
}
