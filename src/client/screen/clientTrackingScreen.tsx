import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { getTasks, subscribe, releaseEscrow, addReview, Task } from "../../session";

export default function ClientTrackingScreen() {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(true);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState("Tasker đến muộn và bỏ dở công việc chưa hoàn thành xong phòng ngủ.");

  // Review states
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Tab & history states
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchLatestTask = () => {
      const allTasks = getTasks();
      const latestActive = allTasks.find(t => t.status !== 'COMPLETED');
      const completed = allTasks.filter(t => t.status === 'COMPLETED');

      setActiveTask(latestActive || null);
      setCompletedTasks(completed);
    };

    fetchLatestTask();
    const unsubscribe = subscribe(fetchLatestTask);
    return unsubscribe;
  }, []);

  const toggleSheet = () => {
    setIsSheetExpanded(!isSheetExpanded);
  };

  const handleReleaseEscrow = () => {
    if (!activeTask) return;
    Alert.alert(
      "Giải ngân Escrow",
      `Bạn xác nhận đã nghiệm thu công việc thành công. Số tiền ${activeTask.price} từ Ví Escrow sẽ được chuyển ngay cho Tasker!`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận & Giải ngân",
          onPress: () => {
            releaseEscrow(activeTask.id);
            Alert.alert(
              "Thành công",
              "Đã giải ngân tiền thành công cho Tasker! Vui lòng dành chút thời gian đánh giá người giúp việc.",
              [
                {
                  text: "Đánh giá ngay",
                  onPress: () => {
                    setReviewModalVisible(true);
                  }
                }
              ]
            );
          },
        },
      ]
    );
  };

  const handleSendReview = () => {
    if (!activeTask) return;
    addReview(activeTask.id, rating, reviewComment);
    Alert.alert("Cảm ơn", "Đã gửi đánh giá của bạn thành công!");
    setReviewModalVisible(false);
    
    // Refresh states and switch to history
    const allTasks = getTasks();
    const latestActive = allTasks.find(t => t.status !== 'COMPLETED');
    const completed = allTasks.filter(t => t.status === 'COMPLETED');
    setActiveTask(latestActive || null);
    setCompletedTasks(completed);
    setActiveTab('history');
  };

  const handleSendDispute = () => {
    Alert.alert(
      "Đã gửi Khiếu nại",
      "Yêu cầu tranh chấp của bạn đã được gửi tới Admin Taskly. Bộ phận CSKH sẽ xem xét bằng chứng và liên hệ trong 15 phút!",
      [{ text: "Đóng", onPress: () => setDisputeModalVisible(false) }]
    );
  };

  const handleClientSos = () => {
    Alert.alert(
      "🔴 CẢNH BÁO SOS KHẨN CẤP",
      "Đã phát thông báo khẩn cấp tới Hotline Taskly 24/7 và đồn Công An gần nhất!",
      [{ text: "Đóng" }]
    );
  };

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
              Đang hoạt động
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
        activeTask ? (
          <View style={{ flex: 1, position: 'relative' }}>
            {/* Absolute Map Background */}
            <View style={styles.mapContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop",
                }}
                style={styles.mapBackground}
              />

              {/* Motorcycle Live Marker */}
              {activeTask.status === 'IN_PROGRESS' && (
                <View style={[styles.markerContainer, styles.taskerMarker]}>
                  <View style={styles.pulseRing} />
                  <View style={styles.markerCircle}>
                    <Ionicons name="bicycle" size={16} color={Colors.white} />
                  </View>
                </View>
              )}

              {/* Destination Location Pin */}
              <View style={[styles.markerContainer, styles.destinationMarker]}>
                <View style={styles.destinationTooltip}>
                  <Text style={styles.destinationTooltipText}>Điểm đến</Text>
                </View>
                <View style={[styles.markerCircle, styles.destinationCircle]}>
                  <Ionicons name="location" size={18} color={Colors.white} />
                </View>
              </View>
            </View>

            {/* Floating Status Badge */}
            <View style={styles.statusBadgeContainer}>
              <View style={styles.statusBadge}>
                <View style={[styles.greenPulseDot, { backgroundColor: activeTask.status === 'COMPLETED' ? '#10B981' : activeTask.status === 'IN_PROGRESS' ? '#3B82F6' : '#EF4444' }]} />
                <Text style={styles.statusBadgeText}>
                  {activeTask.status === 'IN_PROGRESS' ? "ĐANG THỰC HIỆN • VÍ ESCROW GIỮ TẠM" :
                   activeTask.status === 'ACCEPTED' ? "ĐÃ DUYỆT TASKER • CHỜ BẮT ĐẦU" :
                   "ĐANG TÌM TASKER (OPEN)"}
                </Text>
              </View>
            </View>

            {/* Floating Map Zoom/Utility Buttons & SOS */}
            <View style={styles.mapUtilityColumn}>
              <TouchableOpacity style={[styles.utilityBtn, { backgroundColor: '#FEE2E2', borderColor: '#EF4444', borderWidth: 1 }]} onPress={handleClientSos}>
                <Ionicons name="warning" size={22} color="#DC2626" />
              </TouchableOpacity>
            </View>

            {/* Bottom Sheet Modal */}
            <View style={[styles.bottomSheet, isSheetExpanded ? { height: 380 } : styles.bottomSheetCollapsed]}>
              <TouchableOpacity style={styles.dragHandleContainer} onPress={toggleSheet} activeOpacity={0.9}>
                <View style={styles.dragHandleBar} />
              </TouchableOpacity>

              <View style={styles.taskerRow}>
                <View style={styles.taskerAvatarWrapper}>
                  <Image
                    source={{
                      uri: activeTask.assignedTasker ? 'https://api.dicebear.com/7.x/avataaars/png?seed=' + activeTask.assignedTasker : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop",
                    }}
                    style={styles.taskerAvatar}
                  />
                  {activeTask.assignedTasker ? <View style={styles.taskerOnlineDot} /> : null}
                </View>

                <View style={styles.taskerTextInfo}>
                  <Text style={styles.taskerName}>
                    {activeTask.assignedTasker ? `${activeTask.assignedTasker} (Đối tác duyệt)` : "Đang chờ Tasker ứng tuyển..."}
                  </Text>
                  <View style={styles.taskerRatingRow}>
                    <Ionicons name="star" size={14} color={Colors.star} />
                    <Text style={styles.taskerRatingText}>4.9</Text>
                    <Text style={styles.statsSeparator}>•</Text>
                    <Text style={styles.taskerCompletedText}>
                      {activeTask.assignedTasker ? "128 Task • KYC Verified" : "Đang chờ..."}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                    {activeTask.assignedTasker && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>✓ Sinh viên KYC</Text>
                      </View>
                    )}
                    <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#166534' }}>🛡️ Escrow {activeTask.price}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {isSheetExpanded && (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  <View style={styles.divider} />
                  
                  {activeTask.status === 'IN_PROGRESS' && (
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                      <TouchableOpacity
                        onPress={() => setProofModalVisible(true)}
                        style={{ flex: 1, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#3B82F6', paddingVertical: 10, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                      >
                        <Ionicons name="images" size={18} color="#2563EB" />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563EB' }}>Xem ảnh Nghiệm thu</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setDisputeModalVisible(true)}
                        style={{ backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#DC2626' }}>Khiếu nại</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTask.status === 'IN_PROGRESS' ? (
                    <TouchableOpacity
                      onPress={handleReleaseEscrow}
                      style={{ backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14 }}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Nghiệm Thu & Giải Ngân Escrow</Text>
                    </TouchableOpacity>
                  ) : activeTask.status === 'ACCEPTED' ? (
                    <View style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 14 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#166534' }}>✓ Đã giao việc. Đang chờ Tasker bắt đầu.</Text>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: '#FFF7ED', borderColor: '#FFEDD5', borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 14 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#C2410C' }}>🔍 Đang tìm nhân viên giúp việc ứng tuyển...</Text>
                    </View>
                  )}

                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionIconButton}>
                      <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIconButton}>
                      <Ionicons name="call" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailBtn}
                      onPress={() => router.push({
                        pathname: "/(tabs)/job-details",
                        params: { taskId: activeTask.id }
                      })}
                    >
                      <Text style={styles.detailBtnText}>Chi tiết Task</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' }}>
            <Ionicons name="clipboard-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16 }}>Không có công việc đang chạy</Text>
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
        )
      ) : (
        /* History List Tab */
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {completedTasks.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
              <Ionicons name="folder-open-outline" size={56} color="#9CA3AF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#4B5563', marginTop: 12 }}>Chưa có lịch sử đặt việc</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6 }}>
                Các công việc sau khi hoàn thành và giải ngân sẽ được lưu trữ tại đây.
              </Text>
            </View>
          ) : (
            completedTasks.map((task) => (
              <View key={task.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#15803D' }}>✓ Đã hoàn thành</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#EA580C' }}>{task.price}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111C2D', marginBottom: 6 }}>{task.title}</Text>
                <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>📍 {task.address}</Text>

                <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image
                      source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=' + (task.assignedTasker || 'Tasker') }}
                      style={{ width: 28, height: 28, borderRadius: 14 }}
                    />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>Tasker: {task.assignedTasker || "Đã làm xong"}</Text>
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
                      params: { taskId: task.id }
                    })}
                    style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>Chi tiết</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Proof of Work Review Modal */}
      <Modal visible={proofModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Ảnh Bằng Chứng Hoàn Thành</Text>
              <TouchableOpacity onPress={() => setProofModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 14 }}>
              Tasker đã tải lên 2 ảnh sau khi vệ sinh xong căn hộ:
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop' }}
                style={{ flex: 1, height: 140, borderRadius: 12 }}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop' }}
                style={{ flex: 1, height: 140, borderRadius: 12 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setProofModalVisible(false);
                handleReleaseEscrow();
              }}
              style={{ backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Đã Xem & Đồng Ý Giải Ngân</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dispute Modal */}
      <Modal visible={disputeModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#DC2626' }}>Gửi Khiếu Nại / Báo Cáo Sự Cố</Text>
              <TouchableOpacity onPress={() => setDisputeModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 12, color: '#4B5563', marginBottom: 6 }}>Lý do khiếu nại:</Text>
            <TextInput
              value={disputeReason}
              onChangeText={setDisputeReason}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 12, fontSize: 13, color: '#111827', marginBottom: 16 }}
            />

            <TouchableOpacity
              onPress={handleSendDispute}
              style={{ backgroundColor: '#DC2626', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Gửi Yêu Cầu Tranh Chấp Cho Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Review Modal */}
      <Modal visible={reviewModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.primary }}>Đánh Giá Tasker (Review)</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 10 }}>
              Đánh giá chất lượng dịch vụ của {activeTask?.assignedTasker || "Tasker"}:
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={36}
                    color={Colors.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 12, color: '#4B5563', marginBottom: 6 }}>Nhận xét chi tiết:</Text>
            <TextInput
              value={reviewComment}
              onChangeText={setReviewComment}
              placeholder="Nhập ý kiến của bạn về thái độ làm việc, chất lượng..."
              multiline
              numberOfLines={3}
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 12, fontSize: 13, color: '#111827', marginBottom: 16 }}
            />

            <TouchableOpacity
              onPress={handleSendReview}
              style={{ backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
