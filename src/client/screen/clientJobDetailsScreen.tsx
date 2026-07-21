// screens/JobDetailsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function ClientJobDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ task?: string }>();
  const task = params.task
    ? JSON.parse(params.task as string)
    : {
        category: "Cleaning",
        title: "Dọn dẹp căn hộ 2 phòng ngủ",
        description:
          "Mình cần một bạn dọn dẹp căn hộ 2 phòng ngủ, 1 phòng khách, 2 WC tại chung cư Sunrise City. Yêu cầu làm kỹ, sạch sẽ.",
        distance: "1.2 km",
        rating: "4.9",
        budget: "200.000đ",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
      };

  const handleApply = () => {
    router.push("/(tabs)/checkout");
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
          <Text style={styles.jobTitle}>{task.title}</Text>
          <View style={styles.jobSubRow}>
            <Ionicons name="time-outline" size={16} color={Colors.outline} />
            <Text style={styles.jobTimeText}>Đăng 2 giờ trước</Text>
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
              <Text style={styles.bentoCellPrice}>{task.budget}</Text>
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
              <Text style={styles.bentoCellDuration}>2 giờ</Text>
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

          <Text style={styles.descText}>{task.description}</Text>

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

        {/* Counter Offers / Bidding Section */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.onSurface }}>Đề Xuất Giá Từ Tasker (Bidding)</Text>
            <View style={{ backgroundColor: '#F0F3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.primary }}>2 Đề xuất mới</Text>
            </View>
          </View>

          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=TaskerMinhDuc' }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>Nguyễn Minh Đức</Text>
                  <Text style={{ fontSize: 11, color: '#6B7280' }}>★ 4.9 • Sinh viên Bách Khoa</Text>
                </View>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#2563EB' }}>600.000đ</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 8, fontStyle: 'italic' }}>
              &quot;Tôi mang đầy đủ máy hút bụi công nghiệp &amp; dụng cụ lau kính chuyên dụng.&quot;
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/checkout')} style={{ flex: 1, backgroundColor: '#2563EB', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Chấp nhận đề xuất</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Customer Profile Card */}
        <View style={styles.card}>
          <Text style={styles.customerCardTitle}>Người đăng</Text>

          <View style={styles.customerRow}>
            <Image
              source={{ uri: task.avatarUrl }}
              style={styles.customerAvatar}
            />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>Nguyễn Thị Thu Hà</Text>
              <View style={styles.customerRatingRow}>
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text style={styles.customerRating}>{task.rating}</Text>
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
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.8}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
        </TouchableOpacity>
      </View>
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
