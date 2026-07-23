import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants & Store
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { getAuthSession } from "../../session";
import { taskApi } from "../../../service/api";
import { ActivityIndicator } from "react-native";

export default function ClientTrackingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const loadTasks = () => {
    taskApi.getTasks()
      .then((res: any) => {
        setTasks(res);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách công việc:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);

  // Filter tasks based on status
  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'cancelled');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Tabs Navigation */}
      <View style={{ backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingTop: 10, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#111C2D' }}>Quản lý hoạt động</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          </TouchableOpacity>
        </View>

        {/* Tab Buttons */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: activeTab === 'active' ? '#EA580C' : '#F3F4F6',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: activeTab === 'active' ? '#FFFFFF' : '#EA580C' }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'active' ? '#FFFFFF' : '#4B5563' }}>
              Đang hoạt động ({activeTasks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: activeTab === 'history' ? '#EA580C' : '#F3F4F6'
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'history' ? '#FFFFFF' : '#4B5563' }}>
              Lịch sử đã đặt ({completedTasks.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'active' ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {isLoading && tasks.length === 0 ? (
            <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 40 }} />
          ) : activeTasks.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
              <Ionicons name="clipboard-outline" size={56} color="#9CA3AF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151', marginTop: 16 }}>Không có công việc đang chạy</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
                Bạn chưa có yêu cầu dịch vụ nào đang trong quá trình thực hiện. Hãy đăng việc mới ngay!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/create")}
                style={{ backgroundColor: '#EA580C', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Đăng việc mới ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activeTasks.map((task: any) => {
              const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
              
              // Status mapping
              let statusLabel = "Đang tìm kiếm (OPEN)";
              let statusColor = "#C2410C";
              let statusBg = "#FFF7ED";
              if (task.status === "assigned") {
                statusLabel = "Chờ Tasker bắt đầu làm việc";
                statusColor = "#4F46E5";
                statusBg = "#EEF2FF";
              } else if (task.status === "in_progress") {
                statusLabel = "Đang thực hiện";
                statusColor = "#2563EB";
                statusBg = "#EFF6FF";
              }

              return (
                <TouchableOpacity
                  key={task._id || task.id}
                  onPress={() => router.push({
                    pathname: "/(tabs)/job-details",
                    params: { taskId: task._id || task.id }
                  })}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: statusColor }}>{statusLabel}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#EA580C' }}>{formattedPrice}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111C2D', marginBottom: 6 }}>{task.title}</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>📍 {task.address}</Text>

                  <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 }} />

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="shield-checkmark" size={14} color="#6B7280" />
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {task.paymentStatus === 'paid' 
                          ? "🛡️ Đã ký quỹ" 
                          : task.paymentStatus === 'released'
                          ? "✓ Đã giải ngân"
                          : task.paymentStatus === 'refunded'
                          ? "✗ Đã hoàn tiền"
                          : "⏳ Chưa thanh toán"}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>Xem ứng viên & Chi tiết</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      ) : (
        /* History List Tab */
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {isLoading && tasks.length === 0 ? (
            <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 40 }} />
          ) : completedTasks.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
              <Ionicons name="folder-open-outline" size={56} color="#9CA3AF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#4B5563', marginTop: 12 }}>Chưa có lịch sử đặt việc</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6 }}>
                Các công việc sau khi hoàn thành và giải ngân sẽ được lưu trữ tại đây.
              </Text>
            </View>
          ) : (
            completedTasks.map((task: any) => {
              const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
              const taskerName = task.taskerId?.fullName || "Đối tác giúp việc";
              return (
                <View key={task._id || task.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#15803D' }}>
                        {task.status === 'cancelled' ? "✗ Đã hủy" : "✓ Đã hoàn thành"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#EA580C' }}>{formattedPrice}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111C2D', marginBottom: 6 }}>{task.title}</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>📍 {task.address}</Text>

                  <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 }} />

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <Image
                        source={{ uri: task.taskerId?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + taskerName }}
                        style={{ width: 28, height: 28, borderRadius: 14 }}
                      />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>Tasker: {taskerName}</Text>
                        {task.review ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
                            <Ionicons name="star" size={12} color="#FBBF24" />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#7E3000' }}>{task.review.rating}/5 sao</Text>
                            <Text style={{ fontSize: 11, color: '#6B7280' }}> - {task.review.comment}</Text>
                          </View>
                        ) : (
                          <Text style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 2 }}>Chưa gửi đánh giá</Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: "/(tabs)/job-details",
                        params: { taskId: task._id || task.id }
                      })}
                      style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>Chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    opacity: 0.55,
  },
  markerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  taskerMarker: {
    top: "40%",
    left: "30%",
  },
  pulseRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "33",
    position: "absolute",
  },
  markerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  destinationMarker: {
    top: "30%",
    left: "70%",
  },
  destinationCircle: {
    backgroundColor: Colors.secondary,
  },
  destinationTooltip: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.full,
    marginBottom: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationTooltipText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  floatingHeader: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    overflow: "hidden",
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileAvatar: {
    width: "100%",
    height: "100%",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: 88,
    alignSelf: "center",
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  mapUtilityColumn: {
    position: "absolute",
    right: 16,
    top: "30%",
    zIndex: 10,
    gap: 8,
  },
  utilityBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  myLocationBtn: {
    marginTop: 16,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 90, // Pad bottom so tab bar doesn't overlay sheet content
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 15,
    zIndex: 20,
  },
  bottomSheetExpanded: {
    height: 400,
  },
  bottomSheetCollapsed: {
    height: 120,
  },
  dragHandleContainer: {
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  dragHandleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant + "77",
  },
  taskerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskerAvatarWrapper: {
    position: "relative",
    marginRight: Layout.spacing.md,
  },
  taskerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  taskerOnlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  taskerTextInfo: {
    flex: 1,
  },
  taskerName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  taskerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  taskerRatingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F59E0B",
    marginLeft: 2,
  },
  statsSeparator: {
    fontSize: 12,
    color: Colors.outline,
    marginHorizontal: 6,
  },
  taskerCompletedText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  verifiedBadge: {
    backgroundColor: Colors.primary + "15",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
    marginTop: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "22",
    marginVertical: Layout.spacing.md,
  },
  etaPanel: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.xs,
  },
  etaLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  etaTimer: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    lineHeight: 38,
    marginTop: 4,
  },
  etaUnit: {
    fontSize: 16,
    fontWeight: "700",
  },
  etaSubText: {
    fontSize: 12,
    color: Colors.outline,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  actionIconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "15",
  },
  detailBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  detailBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  serviceSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Layout.spacing.xs,
  },
  serviceLabel: {
    fontSize: 10,
    color: Colors.outline,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  serviceVal: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  alignEnd: {
    alignItems: "flex-end",
  },
});
