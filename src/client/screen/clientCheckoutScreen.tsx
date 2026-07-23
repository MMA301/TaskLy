// screens/CheckoutScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useState } from "react";
import {
  Alert,
  Platform,
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
import { addTask } from "../../session";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { paymentApi, taskApplicationApi } from "../../../service/api";
import { ActivityIndicator } from "react-native";

export default function ClientCheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    taskName?: string;
    taskDesc?: string;
    address?: string;
    date?: string;
    time?: string;
    budget?: string;
  }>();

  const taskName = params.taskName || "Dọn dẹp căn hộ 2 phòng ngủ";
  const taskDesc = params.taskDesc || "Mình cần một bạn dọn dẹp căn hộ 2 phòng ngủ, 1 phòng khách, 2 WC tại chung cư Sunrise City. Yêu cầu làm kỹ, sạch sẽ.";
  const address = params.address || "Tòa Landmark 81, Vinhomes Central Park, Quận Bình Thạnh, TP.HCM";
  const dateVal = params.date || "Hôm nay";
  const timeVal = params.time || "14:00";
  const budgetStr = params.budget || "500000";
  const rawBudget = parseInt(budgetStr.replace(/[^0-9]/g, '')) || 500000;
  const formattedBudget = rawBudget.toLocaleString('vi-VN') + "đ";

  const [promoCode, setPromoCode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("momo");

  const paymentMethods: {
    id: string;
    title: string;
    subtitle: string;
    iconName: ComponentProps<typeof Ionicons>["name"];
    color: string;
  }[] = [
      {
        id: "momo",
        title: "Ví MoMo",
        subtitle: "Đã liên kết",
        iconName: "wallet",
        color: "#A50064",
      },
      {
        id: "vnpay",
        title: "VNPAY",
        subtitle: "",
        iconName: "qr-code",
        color: "#005BAA",
      },
      {
        id: "credit",
        title: "Thẻ tín dụng / Ghi nợ",
        subtitle: "",
        iconName: "card",
        color: Colors.inverseSurface,
      },
      {
        id: "cash",
        title: "Tiền mặt",
        subtitle: "",
        iconName: "cash",
        color: Colors.success,
      },
    ];

  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    if (!params.taskId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin công việc.");
      return;
    }

    setIsPaying(true);

    paymentApi.createPayment({
      taskId: params.taskId,
      amount: rawBudget,
      provider: selectedPayment,
      applicationId: params.applicationId || undefined
    })
      .then(() => {
        // If an application ID is present, we accept it automatically
        if (params.applicationId) {
          return taskApplicationApi.acceptApplication(params.applicationId);
        }
        return Promise.resolve(null);
      })
      .then(() => {
        setIsPaying(false);
        const successMsg = "Thanh toán ký quỹ thành công! Ứng viên đã được duyệt và chuyển sang thực hiện.";
        if (Platform.OS === "web") {
          alert(successMsg);
        } else {
          Alert.alert("Thành công", successMsg);
        }
        router.replace("/(tabs)");
      })
      .catch((err: any) => {
        setIsPaying(false);
        const errMsg = err.message || "Giao dịch thanh toán thất bại. Vui lòng thử lại.";
        Alert.alert("Lỗi thanh toán", errMsg);
      });
  };

  const handleCancel = () => {
    const errorMsg = "Giao dịch ký quỹ thất bại. Bài đăng không được khởi tạo.";

    if (Platform.OS === "web") {
      alert(errorMsg);
    } else {
      Alert.alert("Hủy / Thất bại", errorMsg);
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Absolute Toolbar Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CHI TIẾT ĐƠN HÀNG</Text>

          <View style={styles.orderRow}>
            <View style={styles.orderIconCircle}>
              <Ionicons name="brush" size={24} color={Colors.primary} />
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderName} numberOfLines={1}>
                {taskName}
              </Text>
              <Text style={styles.orderTime}>
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={Colors.onSurfaceVariant}
                />{" "}
                {dateVal}, {timeVal}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Pricing breakdowns */}
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Phí dịch vụ (90%)</Text>
            <Text style={styles.pricingValue}>{(Math.round(rawBudget * 0.9)).toLocaleString('vi-VN')}đ</Text>
          </View>

          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Phí di chuyển (10%)</Text>
            <Text style={styles.pricingValue}>{(Math.round(rawBudget * 0.1)).toLocaleString('vi-VN')}đ</Text>
          </View>

          <View style={styles.dividerCenter}>
            <View style={styles.dividerCenterLine} />
            <View style={styles.dividerCenterIconCircle}>
              <Ionicons name="add" size={14} color={Colors.outline} />
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalPrice}>{formattedBudget}</Text>
          </View>

          {/* Taskly Escrow Guarantee Banner */}
          <View style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="shield-checkmark" size={24} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#15803D' }}>🛡️ Bảo vệ đặt cọc qua Ví Escrow</Text>
              <Text style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>
                Số tiền {formattedBudget} được hệ thống tạm giữ an toàn. Chỉ giải ngân cho Tasker sau khi bạn xem ảnh nghiệm thu và hài lòng 100%.
              </Text>
            </View>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mã giảm giá</Text>
          <View style={styles.promoInputRow}>
            <View style={styles.promoInputWrapper}>
              <Ionicons
                name="pricetag-outline"
                size={18}
                color={Colors.outline}
                style={styles.promoInputIcon}
              />
              <TextInput
                style={styles.promoTextInput}
                placeholder="Nhập mã voucher"
                placeholderTextColor={Colors.outline}
                value={promoCode}
                onChangeText={setPromoCode}
              />
            </View>
            <TouchableOpacity style={styles.promoApplyBtn} activeOpacity={0.8}>
              <Text style={styles.promoApplyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <View style={styles.paymentList}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPayment(method.id)}
                  style={[
                    styles.paymentItem,
                    isSelected
                      ? styles.paymentItemSelected
                      : styles.paymentItemUnselected,
                  ]}
                >
                  {/* Method brand Icon container */}
                  <View
                    style={[
                      styles.methodIconBadge,
                      { backgroundColor: method.color },
                    ]}
                  >
                    <Ionicons
                      name={method.iconName}
                      size={20}
                      color={Colors.white}
                    />
                  </View>

                  {/* Text details */}
                  <View style={styles.paymentItemTextWrapper}>
                    <Text style={styles.paymentItemTitle}>{method.title}</Text>
                    {method.subtitle ? (
                      <Text style={styles.paymentItemSub}>
                        {method.subtitle}
                      </Text>
                    ) : null}
                  </View>

                  {/* Radio indicators */}
                  <View
                    style={[
                      styles.radioCircleOuter,
                      isSelected
                        ? styles.radioCircleOuterActive
                        : styles.radioCircleOuterInactive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom spacing before checkout area */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Secure Bottom Footer Action */}
      <View style={styles.footerSticky}>
        <View style={styles.totalReceiptRow}>
          <Text style={styles.totalReceiptLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalReceiptValue}>{formattedBudget}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[styles.payButton, { flex: 1 }, isPaying && { backgroundColor: Colors.outline }]}
            activeOpacity={0.8}
            onPress={handlePay}
            disabled={isPaying}
          >
            {isPaying ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={18} color={Colors.white} />
                <Text style={styles.payButtonText}>Ký quỹ (SUCCESS)</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              height: 52,
              borderRadius: Layout.borderRadius.md,
              backgroundColor: '#FEE2E2',
              borderColor: '#EF4444',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            activeOpacity={0.8}
            onPress={handleCancel}
          >
            <Ionicons name="close-circle" size={18} color="#DC2626" />
            <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '600' }}>Hủy / Thất bại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSecureNote}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.outline} />
          <Text style={styles.footerSecureNoteText}>
            Giao dịch được mã hóa an toàn 256-bit
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 64,
    backgroundColor: Colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "33",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  spacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 150,
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
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.outline,
    letterSpacing: 1,
    marginBottom: Layout.spacing.md,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Layout.spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  orderTime: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "22",
    marginVertical: Layout.spacing.md,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  pricingLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  pricingValue: {
    fontSize: 14,
    color: Colors.onSurface,
    fontWeight: "500",
  },
  dividerCenter: {
    position: "relative",
    height: 24,
    justifyContent: "center",
    marginVertical: Layout.spacing.xs,
  },
  dividerCenterLine: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "22",
    width: "100%",
  },
  dividerCenterIconCircle: {
    position: "absolute",
    alignSelf: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Layout.spacing.xs,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  sectionContainer: {
    paddingHorizontal: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: Layout.spacing.md,
  },
  promoInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  promoInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Layout.borderRadius.default,
    height: 48,
    paddingHorizontal: Layout.spacing.md,
  },
  promoInputIcon: {
    marginRight: Layout.spacing.sm,
  },
  promoTextInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: Colors.onSurface,
  },
  promoApplyBtn: {
    height: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.default,
    alignItems: "center",
    justifyContent: "center",
  },
  promoApplyText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  paymentList: {
    gap: Layout.spacing.sm,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1.5,
  },
  paymentItemSelected: {
    backgroundColor: Colors.primary + "0d",
    borderColor: Colors.primary,
  },
  paymentItemUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.outlineVariant + "33",
  },
  methodIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Layout.spacing.md,
  },
  paymentItemTextWrapper: {
    flex: 1,
  },
  paymentItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  paymentItemSub: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 2,
  },
  radioCircleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleOuterActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  radioCircleOuterInactive: {
    borderColor: Colors.outlineVariant,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  bottomSpacer: {
    height: 30,
  },
  footerSticky: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "33",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  totalReceiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xs,
  },
  totalReceiptLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  totalReceiptValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  payButton: {
    height: 52,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  footerSecureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: Layout.spacing.sm,
  },
  footerSecureNoteText: {
    fontSize: 11,
    color: Colors.outline,
    fontWeight: "500",
  },
});
