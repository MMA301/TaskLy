import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ClipboardList,
  FolderOpen,
  ShieldCheck,
  Star,
  MapPin,
} from "lucide-react-native";

// Services
import { taskApi } from "../../../service/api";

export default function ClientTrackingScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    let isMounted = true;

    taskApi.getTasks()
      .then((res: any) => {
        if (!isMounted) return;
        setTasks(res);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách công việc:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter tasks into active vs history
  const activeTasks = tasks.filter((t: any) => t.status === 'open' || t.status === 'assigned' || t.status === 'in_progress');
  const completedTasks = tasks.filter((t: any) => t.status === 'completed' || t.status === 'cancelled');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Top Title & Tab Navigator */}
      <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#0F172A", marginBottom: 12 }}>Hoạt động công việc</Text>
        
        {/* Segmented Control */}
        <View style={{ flexDirection: "row", backgroundColor: "#F1F5F9", padding: 4, borderRadius: 12 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: activeTab === 'active' ? "#4F46E5" : "transparent",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: activeTab === 'active' ? "#FFFFFF" : "#475569" }}>
              Đang thực hiện ({activeTasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: activeTab === 'history' ? "#4F46E5" : "transparent",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: activeTab === 'history' ? "#FFFFFF" : "#475569" }}>
              Lịch sử đã đặt ({completedTasks.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'active' ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          {isLoading && tasks.length === 0 ? (
            <ActivityIndicator size="large" color="#3525CD" style={{ marginTop: 40 }} />
          ) : activeTasks.length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80, paddingHorizontal: 16 }}>
              <ClipboardList size={56} color="#94A3B8" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1E293B", marginTop: 16 }}>Không có công việc đang chạy</Text>
              <Text style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 8, marginBottom: 24 }}>
                Bạn chưa có yêu cầu dịch vụ nào đang trong quá trình thực hiện. Hãy đăng việc mới ngay!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/create")}
                style={{ backgroundColor: "#4F46E5", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}>Đăng việc mới ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activeTasks.map((task: any) => {
              const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
              
              let statusLabel = "Đang tìm kiếm (OPEN)";
              let statusBadgeBg = "#FEF3C7";
              let statusTextColor = "#B45309";
              if (task.status === "assigned") {
                statusLabel = "Chờ Tasker bắt đầu làm việc";
                statusBadgeBg = "#EEF2FF";
                statusTextColor = "#4338CA";
              } else if (task.status === "in_progress") {
                statusLabel = "Đang thực hiện";
                statusBadgeBg = "#EFF6FF";
                statusTextColor = "#1D4ED8";
              }

              return (
                <TouchableOpacity
                  key={task._id || task.id}
                  onPress={() => router.push({
                    pathname: "/(tabs)/job-details",
                    params: { taskId: task._id || task.id }
                  })}
                  style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#F1F5F9" }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <View style={{ backgroundColor: statusBadgeBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                      <Text style={{ fontSize: 11, fontWeight: "800", color: statusTextColor }}>{statusLabel}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#4F46E5" }}>{formattedPrice}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 }}>{task.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={{ fontSize: 12, color: "#64748B", marginLeft: 4 }}>{task.address}</Text>
                  </View>

                  <View style={{ height: 1, backgroundColor: "#F1F5F9", marginBottom: 12 }} />

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <ShieldCheck size={14} color="#64748B" />
                      <Text style={{ fontSize: 12, color: "#64748B" }}>
                        {task.paymentStatus === 'paid' 
                          ? "🛡️ Đã ký quỹ" 
                          : task.paymentStatus === 'released'
                          ? "✓ Đã giải ngân"
                          : task.paymentStatus === 'refunded'
                          ? "✗ Đã hoàn tiền"
                          : "⏳ Chưa thanh toán"}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#334155" }}>Xem ứng viên & Chi tiết</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      ) : (
        /* History List Tab */
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          {isLoading && tasks.length === 0 ? (
            <ActivityIndicator size="large" color="#3525CD" style={{ marginTop: 40 }} />
          ) : completedTasks.length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80, paddingHorizontal: 16 }}>
              <FolderOpen size={56} color="#94A3B8" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#334155", marginTop: 12 }}>Chưa có lịch sử đặt việc</Text>
              <Text style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 6 }}>
                Các công việc sau khi hoàn thành và giải ngân sẽ được lưu trữ tại đây.
              </Text>
            </View>
          ) : (
            completedTasks.map((task: any) => {
              const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
              const taskerName = task.taskerId?.fullName || "Đối tác giúp việc";
              return (
                <View key={task._id || task.id} style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#F1F5F9" }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <View style={{ backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                      <Text style={{ fontSize: 11, fontWeight: "800", color: "#166534" }}>
                        {task.status === 'cancelled' ? "✗ Đã hủy" : "✓ Đã hoàn thành"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#4F46E5" }}>{formattedPrice}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 }}>{task.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={{ fontSize: 12, color: "#64748B", marginLeft: 4 }}>{task.address}</Text>
                  </View>

                  <View style={{ height: 1, backgroundColor: "#F1F5F9", marginBottom: 12 }} />

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                      <Image
                        source={{ uri: task.taskerId?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + taskerName }}
                        style={{ width: 28, height: 28, borderRadius: 14 }}
                      />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: "#334155" }}>Tasker: {taskerName}</Text>
                        {task.review ? (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text style={{ fontSize: 11, fontWeight: "700", color: "#92400E" }}>{task.review.rating}/5 sao</Text>
                            <Text style={{ fontSize: 11, color: "#64748B" }} numberOfLines={1}> - {task.review.comment}</Text>
                          </View>
                        ) : (
                          <Text style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", marginTop: 2 }}>Chưa gửi đánh giá</Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: "/(tabs)/job-details",
                        params: { taskId: task._id || task.id }
                      })}
                      style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8 }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#334155" }}>Chi tiết</Text>
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
