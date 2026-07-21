import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function ClientTrackingScreen() {
  const router = useRouter();
  const [isSheetExpanded, setIsSheetExpanded] = useState(true);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState("Tasker đến muộn và bỏ dở công việc chưa hoàn thành xong phòng ngủ.");
  const [escrowReleased, setEscrowReleased] = useState(false);

  const toggleSheet = () => {
    setIsSheetExpanded(!isSheetExpanded);
  };

  const handleReleaseEscrow = () => {
    Alert.alert(
      "Giải ngân Escrow",
      "Bạn xác nhận đã nghiệm thu công việc thành công. Số tiền 500.000đ từ Ví Escrow sẽ được chuyển ngay cho Tasker!",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận & Giải ngân",
          onPress: () => {
            setEscrowReleased(true);
            Alert.alert("Thành công", "Đã giải ngân tiền thành công cho Tasker!");
          },
        },
      ]
    );
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Absolute Map Background */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop",
          }}
          style={styles.mapBackground}
        />

        {/* Motorcycle Live Marker */}
        <View style={[styles.markerContainer, styles.taskerMarker]}>
          <View style={styles.pulseRing} />
          <View style={styles.markerCircle}>
            <Ionicons name="bicycle" size={16} color={Colors.white} />
          </View>
        </View>

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

      {/* Floating Header Overlay */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi Task & Escrow</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
            }}
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Floating Status Badge */}
      <View style={styles.statusBadgeContainer}>
        <View style={styles.statusBadge}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.statusBadgeText}>
            {escrowReleased ? "ĐÃ HOÀN THÀNH & GIẢI NGÂN" : "ĐANG THỰC HIỆN • VÍ ESCROW GIỮ TẠM"}
          </Text>
        </View>
      </View>

      {/* Floating Map Zoom/Utility Buttons & SOS */}
      <View style={styles.mapUtilityColumn}>
        <TouchableOpacity style={[styles.utilityBtn, { backgroundColor: '#FEE2E2', borderColor: '#EF4444', borderWidth: 1 }]} onPress={handleClientSos}>
          <Ionicons name="warning" size={22} color="#DC2626" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityBtn}>
          <Ionicons name="add" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityBtn}>
          <Ionicons name="remove" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.utilityBtn, styles.myLocationBtn]}>
          <Ionicons name="locate" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <View
        style={[
          styles.bottomSheet,
          isSheetExpanded
            ? { height: 480 }
            : styles.bottomSheetCollapsed,
        ]}
      >
        {/* Drag Handle Touch Zone */}
        <TouchableOpacity
          style={styles.dragHandleContainer}
          onPress={toggleSheet}
          activeOpacity={0.9}
        >
          <View style={styles.dragHandleBar} />
        </TouchableOpacity>

        {/* Tasker Info Row */}
        <View style={styles.taskerRow}>
          <View style={styles.taskerAvatarWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop",
              }}
              style={styles.taskerAvatar}
            />
            <View style={styles.taskerOnlineDot} />
          </View>

          <View style={styles.taskerTextInfo}>
            <Text style={styles.taskerName}>Nguyễn Minh Đức (Sinh viên Bách Khoa)</Text>
            <View style={styles.taskerRatingRow}>
              <Ionicons name="star" size={14} color={Colors.star} />
              <Text style={styles.taskerRatingText}>4.9</Text>
              <Text style={styles.statsSeparator}>•</Text>
              <Text style={styles.taskerCompletedText}>
                128 Task • KYC Verified
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>✓ Sinh viên KYC</Text>
              </View>
              <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#166534' }}>🛡️ Escrow 500k</Text>
              </View>
            </View>
          </View>
        </View>

        {isSheetExpanded && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.divider} />

            {/* Proof of Work & Escrow Buttons Row */}
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

            {/* Escrow Action Button */}
            {!escrowReleased ? (
              <TouchableOpacity
                onPress={handleReleaseEscrow}
                style={{ backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14 }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Nghiệm Thu & Giải Ngân Escrow</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#15803D' }}>✓ Đã Giải Ngân Tiền Cho Tasker</Text>
              </View>
            )}

            {/* Quick action buttons row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionIconButton}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIconButton}>
                <Ionicons name="call" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => router.push("/(tabs)/job-details")}
              >
                <Text style={styles.detailBtnText}>Chi tiết Task</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

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
