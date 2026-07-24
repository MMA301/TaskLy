import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Wallet,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  XCircle,
  Home,
  Copy,
  Clock,
} from "lucide-react-native";

import Colors from "../constants/Colors";
import { paymentApi, taskApplicationApi } from "../../../service/api";

export default function ClientCheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    // Deposit payment params
    paymentId?: string;
    type?: string;
    paymentCode?: string;
    qrCode?: string;
    expiresAt?: string;
    // Task checkout params
    taskName?: string;
    taskDesc?: string;
    address?: string;
    date?: string;
    time?: string;
    budget?: string;
    taskId?: string;
    applicationId?: string;
    amount?: string;
    provider?: string;
  }>();

  const isDepositFlow = Boolean(params.paymentId || params.type === "deposit");

  // Deposit Params
  const paymentId = params.paymentId || "";
  const depositAmountNum = Number(params.amount || "100000");
  const depositProvider = (params.provider || "momo").toUpperCase();
  const paymentCode = params.paymentCode || "PAY-TASKLY-DEPOSIT";

  // Task Checkout Params
  const taskName = params.taskName || "Dọn dẹp căn hộ 2 phòng ngủ";
  const dateVal = params.date || "Hôm nay";
  const timeVal = params.time || "14:00";
  const budgetStr = params.budget || "500000";
  const rawBudget = parseInt(budgetStr.replace(/[^0-9]/g, "")) || 500000;

  const [selectedPayment, setSelectedPayment] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);

  // ----------------------------------------------------
  // DEPOSIT ACTIONS
  // ----------------------------------------------------

  // Action 1: Confirm Payment (Check thông tin thanh toán)
  const handleConfirmDeposit = () => {
    if (!paymentId) {
      Alert.alert("Lỗi", "Không tìm thấy mã giao dịch thanh toán.");
      return;
    }

    setIsProcessing(true);
    paymentApi.confirmPayment(paymentId)
      .then(() => {
        setIsProcessing(false);
        const msg = `Nạp tiền thành công ${depositAmountNum.toLocaleString("vi-VN")}đ vào Ví TaskLy!`;
        if (Platform.OS === "web") {
          alert(msg);
        } else {
          Alert.alert("Thành công", msg);
        }
        router.replace("/(tabs)/wallet");
      })
      .catch((err: any) => {
        setIsProcessing(false);
        Alert.alert("Thất bại", err?.message || "Xác nhận thanh toán thất bại. Vui lòng thử lại!");
      });
  };

  // Action 2: Cancel Payment (Hủy thanh toán)
  const handleCancelDeposit = () => {
    const confirmAction = () => {
      if (!paymentId) {
        router.replace("/(tabs)/wallet");
        return;
      }

      setIsProcessing(true);
      paymentApi.cancelPayment(paymentId)
        .then(() => {
          setIsProcessing(false);
          const msg = "Đã hủy giao dịch nạp tiền thành công.";
          if (Platform.OS === "web") {
            alert(msg);
          } else {
            Alert.alert("Đã hủy", msg);
          }
          router.replace("/(tabs)/wallet");
        })
        .catch((err: any) => {
          setIsProcessing(false);
          Alert.alert("Thất bại", err?.message || "Hủy giao dịch thất bại.");
        });
    };

    if (Platform.OS === "web") {
      if (window.confirm("Bạn có chắc chắn muốn hủy giao dịch nạp tiền này?")) {
        confirmAction();
      }
    } else {
      Alert.alert("Hủy thanh toán", "Bạn có chắc chắn muốn hủy giao dịch nạp tiền này?", [
        { text: "Không", style: "cancel" },
        { text: "Đồng ý hủy", style: "destructive", onPress: confirmAction },
      ]);
    }
  };

  // Action 3: Go to Home Screen (Về màn hình chính - Lưu PENDING state)
  const handleGoHome = () => {
    const msg = "Giao dịch đã được lưu ở trạng thái chờ thanh toán. Bạn có thể tiếp tục thanh toán bất kỳ lúc nào tại Ví TaskLy.";
    if (Platform.OS === "web") {
      alert(msg);
    } else {
      Alert.alert("Thông báo", msg);
    }
    router.replace("/(tabs)");
  };

  // ----------------------------------------------------
  // TASK CHECKOUT ACTIONS
  // ----------------------------------------------------
  const handlePayTask = () => {
    if (!params.taskId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin công việc.");
      return;
    }

    setIsProcessing(true);
    paymentApi.createPayment({
      taskId: params.taskId,
      amount: rawBudget,
      provider: selectedPayment,
      applicationId: params.applicationId || undefined,
    })
      .then(() => {
        if (params.applicationId) {
          return taskApplicationApi.acceptApplication(params.applicationId);
        }
        return Promise.resolve(null);
      })
      .then(() => {
        setIsProcessing(false);
        const successMsg = "Thanh toán ký quỹ thành công! Ứng viên đã được duyệt và chuyển sang thực hiện.";
        if (Platform.OS === "web") {
          alert(successMsg);
        } else {
          Alert.alert("Thành công", successMsg);
        }
        router.replace("/(tabs)");
      })
      .catch((err: any) => {
        setIsProcessing(false);
        Alert.alert("Lỗi thanh toán", err.message || "Giao dịch thanh toán thất bại. Vui lòng thử lại.");
      });
  };

  // Provider Helpers
  const getProviderInfo = (prov: string) => {
    const p = (prov || "").toUpperCase();
    if (p.includes("MOMO")) return { name: "Ví MoMo", Icon: Wallet, color: "#A50064", bg: "#FDF2F8" };
    if (p.includes("ZALO")) return { name: "Ví ZaloPay", Icon: QrCode, color: "#0068FF", bg: "#EFF6FF" };
    if (p.includes("VNPAY")) return { name: "VNPay / Banking", Icon: Banknote, color: "#005BAA", bg: "#F0F9FF" };
    return { name: "Thẻ Visa / Mastercard", Icon: CreditCard, color: "#4F46E5", bg: "#EEF2FF" };
  };

  const provInfo = getProviderInfo(depositProvider);
  const ProviderIcon = provInfo.Icon;

  // Render Deposit Gateway View
  if (isDepositFlow) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <TouchableOpacity
            onPress={handleGoHome}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-slate-900">Cổng thanh toán Nạp ví</Text>
          <TouchableOpacity onPress={handleGoHome} className="p-1">
            <Home size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {/* Amount & Status Banner */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-200 shadow-sm items-center">
            <View className="bg-amber-100 px-3 py-1 rounded-full flex-row items-center gap-1.5 mb-2">
              <Clock size={14} color="#D97706" />
              <Text className="text-amber-800 text-xs font-bold uppercase">Đang chờ thanh toán (PENDING)</Text>
            </View>
            <Text className="text-slate-500 text-xs mb-1">Số tiền nạp vào Ví TaskLy</Text>
            <Text className="text-indigo-600 text-3xl font-extrabold mb-3">
              {depositAmountNum.toLocaleString("vi-VN")}đ
            </Text>

            <View className="w-full bg-slate-50 rounded-2xl p-3 flex-row items-center justify-between border border-slate-100">
              <View className="flex-row items-center gap-2.5">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: provInfo.bg }}
                >
                  <ProviderIcon size={20} color={provInfo.color} />
                </View>
                <View>
                  <Text className="text-xs font-bold text-slate-800">{provInfo.name}</Text>
                  <Text className="text-[11px] text-slate-400">Phương thức nạp tiền</Text>
                </View>
              </View>
              <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-bold text-emerald-800">Cổng khả dụng</Text>
              </View>
            </View>
          </View>

          {/* QR Code / Payment Code Instructions Card */}
          <View className="bg-white rounded-3xl p-5 mb-5 border border-slate-200 shadow-sm items-center">
            <Text className="text-sm font-bold text-slate-800 mb-1">Mã QR Thanh Toán</Text>
            <Text className="text-xs text-slate-400 text-center mb-4">
              Quét mã QR bên dưới hoặc nhấn nút xác nhận bên dưới sau khi chuyển khoản thành công.
            </Text>

            {/* Simulated QR Code Graphic Box */}
            <View
              style={{ width: 200, height: 200 }}
              className="bg-slate-900 rounded-3xl p-3 items-center justify-center mb-4 shadow-md self-center"
            >
              <View
                style={{ width: 176, height: 176 }}
                className="border-2 border-dashed border-indigo-400 rounded-2xl items-center justify-center bg-white p-2"
              >
                <QrCode size={96} color={provInfo.color} />
                <Text className="text-[10px] font-mono font-extrabold text-slate-700 mt-1" numberOfLines={1}>
                  {paymentCode}
                </Text>
              </View>
            </View>

            {/* Payment Code Copy Box */}
            <View className="w-full bg-indigo-50/70 rounded-xl p-3 flex-row items-center justify-between border border-indigo-100">
              <View className="flex-1 mr-2">
                <Text className="text-[10px] font-bold text-indigo-400 uppercase">Mã giao dịch (Payment Code)</Text>
                <Text className="text-xs font-mono font-bold text-indigo-900">{paymentCode}</Text>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Thông báo", `Đã sao chép mã giao dịch: ${paymentCode}`)}
                className="flex-row items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200"
              >
                <Copy size={13} color="#3525CD" />
                <Text className="text-xs font-bold text-indigo-600">Sao chép</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3 Main Action Buttons */}
          <View className="gap-3">
            {/* Button 1: Check / Confirm Payment */}
            <TouchableOpacity
              disabled={isProcessing}
              onPress={handleConfirmDeposit}
              className="bg-indigo-600 rounded-2xl py-3.5 items-center flex-row justify-center space-x-2 shadow-sm"
              activeOpacity={0.85}
              style={isProcessing ? { opacity: 0.6 } : null}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircle2 size={18} color="#FFFFFF" />
                  <Text className="text-white text-sm font-bold ml-1.5">
                    Xác nhận đã thanh toán
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Button 2: Cancel Payment */}
            <TouchableOpacity
              disabled={isProcessing}
              onPress={handleCancelDeposit}
              className="bg-red-50 border border-red-200 rounded-2xl py-3.5 items-center flex-row justify-center space-x-2"
              activeOpacity={0.85}
              style={isProcessing ? { opacity: 0.6 } : null}
            >
              <XCircle size={18} color="#DC2626" />
              <Text className="text-red-700 text-sm font-bold ml-1.5">Hủy thanh toán</Text>
            </TouchableOpacity>

            {/* Button 3: Go to Home Screen */}
            <TouchableOpacity
              disabled={isProcessing}
              onPress={handleGoHome}
              className="bg-white border border-slate-300 rounded-2xl py-3.5 items-center flex-row justify-center space-x-2"
              activeOpacity={0.85}
            >
              <Home size={18} color="#475569" />
              <Text className="text-slate-700 text-sm font-bold ml-1.5">Về màn hình chính</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Fallback Task Checkout View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán công việc</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          <View style={styles.orderRow}>
            <View style={styles.orderIconCircle}>
              <Ionicons name="brush" size={24} color={Colors.primary} />
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderName} numberOfLines={1}>{taskName}</Text>
              <Text style={styles.orderTime}>
                <Ionicons name="calendar-outline" size={13} color={Colors.onSurfaceVariant} /> {dateVal}, {timeVal}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Tổng thanh toán ký quỹ</Text>
            <Text style={styles.pricingValue}>{rawBudget.toLocaleString("vi-VN")}đ</Text>
          </View>
        </View>

        <TouchableOpacity
          disabled={isProcessing}
          onPress={handlePayTask}
          style={styles.payButton}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  spacer: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  orderTime: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pricingLabel: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3525CD",
  },
  payButton: {
    backgroundColor: "#3525CD",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
