// screens/JobDetailsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants & Store
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { getTasks, subscribe, acceptTasker, getAuthSession, Task } from "../../session";

export default function ClientJobDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ task?: string; taskId?: string }>();
  const initialTask = params.task ? JSON.parse(params.task as string) : null;
  const initialTaskId = params.taskId || (initialTask ? initialTask.id : null);

  const [currentTask, setCurrentTask] = useState<Task | null>(() => {
    const allTasks = getTasks();
    let matched = allTasks.find(t => t.id === initialTaskId);
    if (!matched && initialTask) {
      matched = allTasks.find(t => t.title === initialTask.title);
    }
    if (matched) return matched;
    if (initialTask) {
      return {
        id: initialTask.id || 'temp',
        category: initialTask.category || 'Cleaning',
        title: initialTask.title || 'Dọn dẹp căn hộ 2 phòng ngủ',
        description: initialTask.description || 'Mô tả công việc...',
        price: initialTask.budget || '500.000đ',
        rawBudget: 500000,
        distance: initialTask.distance || '1.2 km',
        postedAgo: 'Vừa xong',
        address: 'Sunrise City, Quận 7',
        time: 'Hôm nay',
        duration: '3 giờ',
        customer: 'Thu Hà',
        customerRating: '4.9',
        status: 'OPEN',
        escrowStatus: 'ESCROWED',
        applicants: [],
        assignedTasker: null
      };
    }
    return null;
  });

  useEffect(() => {
    const findAndSetTask = () => {
      const allTasks = getTasks();
      let matched = allTasks.find(t => t.id === initialTaskId);
      if (!matched && initialTask) {
        matched = allTasks.find(t => t.title === initialTask.title);
      }
      if (matched) {
        setCurrentTask(matched);
      }
    };

    const unsubscribe = subscribe(findAndSetTask);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTaskId, params.task]);

  const activeTask = currentTask || {
    id: "task_01",
    category: "Cleaning",
    title: "Dọn dẹp căn hộ 2 phòng ngủ",
    description: "Mình cần một bạn dọn dẹp căn hộ 2 phòng ngủ, 1 phòng khách, 2 WC tại chung cư Sunrise City. Yêu cầu làm kỹ, sạch sẽ.",
    distance: "1.2 km",
    rating: "4.9",
    budget: "200.000đ",
    price: "200.000đ",
    rawBudget: 200000,
    postedAgo: "2 giờ trước",
    address: "Sunrise City, Quận 7, TP. Hồ Chí Minh",
    time: "Hôm nay, 14:00",
    duration: "2 giờ",
    customer: "Nguyễn Thị Thu Hà",
    customerRating: "4.9",
    applicants: ["Nguyễn Minh Đức"] as string[],
    assignedTasker: null as string | null,
    status: "OPEN" as any,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
  };

  const handleApply = () => {
    router.push({
      pathname: "/(tabs)/checkout",
      params: {
        taskName: activeTask.title,
        taskDesc: activeTask.description,
        address: activeTask.address,
        time: activeTask.time,
        budget: activeTask.price
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header Overlay Toolbar */}
      <View style={styles.headerToolbar}>
        <TouchableOpacity
          style={styles.headerToolbarButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerToolbarTitle}>Chi tiết công việc</Text>
        <TouchableOpacity style={styles.headerToolbarButton}>
          <Ionicons name="share-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Image Banner */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop",
            }}
            style={styles.coverImage}
          />
          <View style={styles.coverGradient} />
          <View style={styles.coverTagContainer}>
            <Text style={styles.coverTagText}>DỌN DẸP NHÀ CỬA</Text>
          </View>
        </View>

        {/* Title Content Card */}
        <View style={styles.card}>
          <Text style={styles.jobTitle}>{activeTask.title}</Text>
          <View style={styles.jobSubRow}>
            <Ionicons name="time-outline" size={16} color={Colors.outline} />
            <Text style={styles.jobTimeText}>{activeTask.postedAgo}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.jobUrgentText}>Cần gấp</Text>
          </View>

          {/* Quick Stats Bento */}
          <View style={styles.bentoRow}>
            <View style={styles.bentoCell}>
              <View style={styles.bentoCellHeader}>
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.bentoCellLabel}>Ngân sách</Text>
              </View>
              <Text style={styles.bentoCellPrice}>{activeTask.price}</Text>
            </View>

            <View style={styles.bentoCell}>
              <View style={styles.bentoCellHeader}>
                <Ionicons
                  name="timer-outline"
                  size={16}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.bentoCellLabel}>Thời lượng</Text>
              </View>
              <Text style={styles.bentoCellDuration}>{activeTask.duration}</Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.sectionTitleText}>Mô tả công việc</Text>
          </View>

          <Text style={styles.descText}>{activeTask.description}</Text>

          <Text style={styles.bulletsHeader}>Yêu cầu công việc:</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>
              Quét và lau sàn toàn bộ căn hộ
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>
              Dọn dẹp rác, lau bụi kệ tủ, bàn ghế
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>Chà rửa 2 nhà vệ sinh sạch sẽ</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>
              Dụng cụ: Đã có sẵn chổi, cây lau nhà, nước lau sàn.
            </Text>
          </View>

          {/* Tag List */}
          <View style={styles.tagGrid}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>Kinh nghiệm &gt; 6 tháng</Text>
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>Đúng giờ</Text>
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>Cẩn thận</Text>
            </View>
          </View>
        </View>

        {/* Tasker Application List */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.onSurface }}>Danh sách ứng tuyển (Tasker Application List)</Text>
            <View style={{ backgroundColor: '#F0F3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.primary }}>{activeTask.applicants.length} Ứng viên</Text>
            </View>
          </View>

          {activeTask.status === 'OPEN' && activeTask.applicants.length === 0 && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Ionicons name="people-outline" size={32} color={Colors.outline} />
              <Text style={{ fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 8 }}>Chưa có Tasker nào ứng tuyển vào bài đăng này.</Text>
            </View>
          )}

          {activeTask.status === 'OPEN' && activeTask.applicants.map((applicantName) => (
            <View key={applicantName} style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=' + applicantName }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{applicantName}</Text>
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>★ 4.9 • Sinh viên Bách Khoa (KYC Verified)</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#2563EB' }}>{activeTask.price}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 8, fontStyle: 'italic' }}>
                &quot;Tôi sẵn sàng nhận công việc dọn dẹp này và cam kết hoàn thành đúng giờ, sạch sẽ 100%.&quot;
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    acceptTasker(activeTask.id, applicantName);
                    Alert.alert("Thành công", `Đã duyệt ứng viên ${applicantName} thực hiện công việc!`);
                    router.push("/(tabs)/tracking");
                  }}
                  style={{ flex: 1, backgroundColor: '#16A34A', paddingVertical: 10, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Duyệt (Accept Tasker)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {(activeTask.status === 'ACCEPTED' || activeTask.status === 'IN_PROGRESS' || activeTask.status === 'COMPLETED') && (
            <View style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, borderRadius: 12, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=' + activeTask.assignedTasker }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#15803D' }}>Đã giao cho: {activeTask.assignedTasker}</Text>
                  <Text style={{ fontSize: 11, color: '#166534', marginTop: 1 }}>
                    Trạng thái công việc: {activeTask.status === 'ACCEPTED' ? 'Chờ bắt đầu' : activeTask.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Đã hoàn thành'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/tracking")}
                style={{ backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>Đi đến trang Theo dõi (Tracking)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Customer Profile Card */}
        <View style={styles.card}>
          <Text style={styles.customerCardTitle}>Người đăng</Text>

          <View style={styles.customerRow}>
            <Image
              source={{ uri: activeTask.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" }}
              style={styles.customerAvatar}
            />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{activeTask.customer}</Text>
              <View style={styles.customerRatingRow}>
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text style={styles.customerRating}>{activeTask.customerRating}</Text>
                <Text style={styles.customerReviews}>(24 đánh giá)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Location Area with Map Snippet */}
          <View style={styles.locationHeaderRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.onSurfaceVariant}
            />
            <Text style={styles.locationHeaderLabel}>Khu vực</Text>
          </View>
          <Text style={styles.locationVal}>Quận 7, TP. Hồ Chí Minh</Text>

          {/* Map Image Snippet */}
          <View style={styles.mapContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop",
              }}
              style={styles.mapImage}
            />
            <View style={styles.mapMarkerPulseOuter}>
              <View style={styles.mapMarkerPulseInner} />
            </View>
          </View>
        </View>

        {/* Padding for fixed bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Sticky Bottom button */}
      {getAuthSession()?.role !== 'client' && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.8}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerToolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingTop: 30,
    paddingHorizontal: Layout.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerToolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerToolbarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverContainer: {
    height: 240,
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  coverTagContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  coverTagText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginHorizontal: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "33",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.onSurface,
    lineHeight: 28,
    marginBottom: Layout.spacing.xs,
  },
  jobSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  jobTimeText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  dot: {
    fontSize: 14,
    color: Colors.outline,
    marginHorizontal: 8,
  },
  jobUrgentText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
  bentoRow: {
    flexDirection: "row",
    gap: Layout.spacing.md,
  },
  bentoCell: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Layout.borderRadius.default,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "15",
  },
  bentoCellHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  bentoCellLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: "500",
  },
  bentoCellPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  bentoCellDuration: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  descText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Layout.spacing.md,
  },
  bulletsHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: Layout.spacing.xs,
    paddingRight: 8,
  },
  bulletSymbol: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "700",
    width: 14,
  },
  bulletText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    flex: 1,
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Layout.spacing.lg,
  },
  tagBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
  },
  tagText: {
    fontSize: 12,
    color: Colors.onSurface,
    fontWeight: "500",
  },
  customerCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: Layout.spacing.md,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Layout.spacing.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onSurface,
    marginBottom: 2,
  },
  customerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  customerRating: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  customerReviews: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "33",
    marginVertical: Layout.spacing.md,
  },
  locationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  locationHeaderLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: "500",
  },
  locationVal: {
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: Layout.spacing.md,
  },
  mapContainer: {
    height: 120,
    width: "100%",
    borderRadius: Layout.borderRadius.default,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Colors.surfaceContainerHigh,
  },
  mapImage: {
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  mapMarkerPulseOuter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  mapMarkerPulseInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  bottomSpacer: {
    height: 30,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "33",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: Layout.borderRadius.default,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
