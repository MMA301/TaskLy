import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Receipt,
  X,
  Headphones,
  Award,
  LucideIcon,
  PlayCircle,
  XCircle,
  Copy,
  Building2,
  Check,
} from "lucide-react-native";

import { walletApi, paymentApi } from "../../../service/api";
import { getAuthSession } from "../../session";

export default function ClientWalletScreen() {
  const session = getAuthSession();
  const isTasker = session?.role === "staff" || session?.role === "tasker";

  const [balance, setBalance] = useState<number>(0);
  const [heldBalance, setHeldBalance] = useState<number>(0);
  const [points] = useState<number>(350);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Customer Top Up Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("200000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("MOMO");

  // Tasker Withdraw Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("300000");
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Selected Transaction Detail Modal State
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const topUpMethods: {
    id: string;
    name: string;
    Icon: LucideIcon;
    color: string;
  }[] = [
    { id: "MOMO", name: "Ví MoMo", Icon: Wallet, color: "#A50064" },
    { id: "ZALOPAY", name: "Ví ZaloPay", Icon: QrCode, color: "#0068FF" },
    { id: "VNPAY", name: "VNPay / Banking", Icon: Banknote, color: "#005BAA" },
    { id: "CARD", name: "Visa / Mastercard", Icon: CreditCard, color: "#4F46E5" },
  ];

  const fetchWalletData = useCallback((showLoading = false) => {
    if (showLoading) setIsLoading(true);
    Promise.allSettled([
      walletApi.getWallet(),
      walletApi.getHistory(),
      paymentApi.getMyPayments(),
    ])
      .then(([walletRes, historyRes, paymentsRes]) => {
        if (walletRes.status === "fulfilled") {
          const wData = walletRes.value?.data || walletRes.value;
          if (wData) {
            setBalance(wData.balance || 0);
            setHeldBalance(wData.heldBalance || 0);
          }
        }

        let walletHistories: any[] = [];
        if (historyRes.status === "fulfilled") {
          const hList = Array.isArray(historyRes.value)
            ? historyRes.value
            : historyRes.value?.data || [];
          walletHistories = [...hList];
        }

        let paymentRecords: any[] = [];
        if (paymentsRes.status === "fulfilled") {
          const pList = Array.isArray(paymentsRes.value)
            ? paymentsRes.value
            : paymentsRes.value?.data || [];

          // Include PENDING, CANCELLED, FAILED deposit payments
          const nonSuccessDeposits = pList.filter(
            (p: any) =>
              p.type === "deposit" &&
              (p.status === "PENDING" || p.status === "CANCELLED" || p.status === "FAILED")
          );

          paymentRecords = nonSuccessDeposits.map((p: any) => {
            const isCancelled = p.status === "CANCELLED" || p.status === "FAILED";
            return {
              ...p,
              type: isCancelled ? "DEPOSIT_CANCELLED" : "DEPOSIT_PENDING",
              direction: "IN",
              description: isCancelled
                ? `Giao dịch nạp tiền qua ${(p.provider || "momo").toUpperCase()} đã hủy`
                : `Giao dịch nạp tiền qua ${(p.provider || "momo").toUpperCase()} đang chờ`,
            };
          });
        }

        const combined = [...paymentRecords, ...walletHistories];
        setHistory(combined);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Automatically refresh wallet data on tab focus
  useFocusEffect(
    useCallback(() => {
      fetchWalletData(false);
    }, [fetchWalletData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.allSettled([
      walletApi.getWallet(),
      walletApi.getHistory(),
      paymentApi.getMyPayments(),
    ])
      .then(([walletRes, historyRes, paymentsRes]) => {
        if (walletRes.status === "fulfilled") {
          const wData = walletRes.value?.data || walletRes.value;
          if (wData) {
            setBalance(wData.balance || 0);
            setHeldBalance(wData.heldBalance || 0);
          }
        }

        let walletHistories: any[] = [];
        if (historyRes.status === "fulfilled") {
          const hList = Array.isArray(historyRes.value)
            ? historyRes.value
            : historyRes.value?.data || [];
          walletHistories = [...hList];
        }

        let paymentRecords: any[] = [];
        if (paymentsRes.status === "fulfilled") {
          const pList = Array.isArray(paymentsRes.value)
            ? paymentsRes.value
            : paymentsRes.value?.data || [];

          const nonSuccessDeposits = pList.filter(
            (p: any) =>
              p.type === "deposit" &&
              (p.status === "PENDING" || p.status === "CANCELLED" || p.status === "FAILED")
          );

          paymentRecords = nonSuccessDeposits.map((p: any) => {
            const isCancelled = p.status === "CANCELLED" || p.status === "FAILED";
            return {
              ...p,
              type: isCancelled ? "DEPOSIT_CANCELLED" : "DEPOSIT_PENDING",
              direction: "IN",
              description: isCancelled
                ? `Giao dịch nạp tiền qua ${(p.provider || "momo").toUpperCase()} đã hủy`
                : `Giao dịch nạp tiền qua ${(p.provider || "momo").toUpperCase()} đang chờ`,
            };
          });
        }

        setHistory([...paymentRecords, ...walletHistories]);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  // Customer Top Up Handler
  const handleTopUpConfirm = () => {
    const amountNum = Number(topUpAmount.replace(/\D/g, ""));
    if (isNaN(amountNum) || amountNum < 10000) {
      Alert.alert("Lỗi", "Số tiền nạp tối thiểu là 10.000đ");
      return;
    }

    setIsLoading(true);
    const providerStr = selectedPaymentMethod.toLowerCase();

    paymentApi.deposit({ amount: amountNum, provider: providerStr })
      .then((res: any) => {
        setIsLoading(false);
        setTopUpModalOpen(false);

        const pData = res?.data?.payment || res?.data || res?.payment || res;
        const paymentId = pData?._id || pData?.id || "";
        const paymentCode = pData?.paymentCode || "";
        const qrCode = pData?.qrCode || "";
        const expiresAt = pData?.expiresAt || "";

        router.push({
          pathname: "/(tabs)/checkout",
          params: {
            paymentId,
            amount: amountNum.toString(),
            provider: selectedPaymentMethod,
            paymentCode,
            qrCode,
            expiresAt,
            type: "deposit",
          },
        });
      })
      .catch((err: any) => {
        setIsLoading(false);
        Alert.alert("Thất bại", err?.message || "Không thể khởi tạo giao dịch nạp tiền. Vui lòng thử lại!");
      });
  };

  // Tasker Withdraw Handler
  const handleWithdrawConfirm = () => {
    const amountNum = Number(withdrawAmount.replace(/\D/g, ""));
    if (isNaN(amountNum) || amountNum < 50000) {
      Alert.alert("Lỗi", "Số tiền rút tối thiểu là 50.000đ");
      return;
    }
    if (amountNum > balance) {
      Alert.alert("Số dư không đủ", `Số dư khả dụng hiện tại là ${balance.toLocaleString("vi-VN")}đ`);
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawModalOpen(false);
      const newBal = Math.max(0, balance - amountNum);
      setBalance(newBal);
      const msg = `Yêu cầu rút ${amountNum.toLocaleString("vi-VN")}đ về ngân hàng MBBank đã được gửi thành công! Tiền sẽ về tài khoản trong 5-15 phút.`;
      if (typeof window !== "undefined" && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert("Rút tiền thành công", msg);
      }
      fetchWalletData(false);
    }, 1200);
  };

  const handleResumePendingPayment = (item: any) => {
    setSelectedTransaction(null);
    router.push({
      pathname: "/(tabs)/checkout",
      params: {
        paymentId: item._id || item.id,
        amount: item.amount?.toString() || "100000",
        provider: item.provider || "momo",
        paymentCode: item.paymentCode || "",
        qrCode: item.qrCode || "",
        expiresAt: item.expiresAt || "",
        type: "deposit",
      },
    });
  };

  const paymentMethods = [
    { id: "momo", name: "Ví MoMo", sub: "Liên kết trực tiếp", Icon: Wallet, color: "#A50064" },
    { id: "vnpay", name: "VNPay / QR", sub: "Quét mã chuyển khoản", Icon: QrCode, color: "#005BAA" },
    { id: "bank", name: "Thẻ ngân hàng", sub: "ATM / Visa / Mastercard", Icon: CreditCard, color: "#4F46E5" },
    { id: "cod", name: "Tiền mặt", sub: "Thanh toán cho Tasker khi xong", Icon: Banknote, color: "#059669" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-extrabold text-slate-900">
          {isTasker ? "Ví thu nhập Tasker" : "Ví & Thanh toán"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Trung tâm hỗ trợ thanh toán",
              "Tổng đài hỗ trợ Ví TaskLy 24/7: 1900 6868\nEmail: support@taskly.vn"
            )
          }
          className="flex-row items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full"
          activeOpacity={0.8}
        >
          <Headphones size={18} color="#3525CD" />
          <Text className="text-xs font-bold text-indigo-700">Hỗ trợ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3525CD"]} />
        }
      >
        {/* Balance Card Banner */}
        <View className="m-4 p-5 rounded-3xl bg-indigo-600 shadow-lg shadow-indigo-300">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center gap-1.5">
              <Wallet size={18} color="#FFFFFF" />
              <Text className="text-white/85 text-xs font-semibold">
                {isTasker ? "Thu nhập khả dụng (Rút tiền)" : "Số dư khả dụng"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
              <Award size={13} color="#FEF08A" />
              <Text className="text-white text-xs font-bold">{points} bPoints</Text>
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-1">
            {balance.toLocaleString("vi-VN")}đ
          </Text>

          {isTasker ? (
            <Text className="text-emerald-200 text-xs font-semibold mb-5">
              💰 Tự động nhận từ heldBalance của Khách hàng khi hoàn thành công việc
            </Text>
          ) : (
            <Text className="text-indigo-200 text-xs mb-5">
              🔒 Đang ký quỹ (Hệ thống giữ): {heldBalance.toLocaleString("vi-VN")}đ
            </Text>
          )}

          {/* Quick Actions Row */}
          <View className="flex-row justify-between bg-white/15 rounded-2xl p-2.5">
            {!isTasker && (
              <TouchableOpacity
                onPress={() => setTopUpModalOpen(true)}
                className="flex-1 items-center gap-1"
                activeOpacity={0.8}
              >
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
                  <ArrowDownCircle size={20} color="#3525CD" />
                </View>
                <Text className="text-white text-xs font-bold">Nạp tiền</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setWithdrawModalOpen(true)}
              className="flex-1 items-center gap-1"
              activeOpacity={0.8}
            >
              <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
                <ArrowUpCircle size={20} color="#3525CD" />
              </View>
              <Text className="text-white text-xs font-bold">
                {isTasker ? "Rút tiền về NH" : "Rút tiền"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  isTasker ? "Lịch sử thu nhập" : "Đổi quà",
                  isTasker
                    ? `Tổng thu nhập từ công việc đã hoàn thành: ${balance.toLocaleString("vi-VN")}đ.`
                    : "Bạn có 350 bPoints. Có thể dùng để giảm giá cho đơn tiếp theo!"
                )
              }
              className="flex-1 items-center gap-1"
              activeOpacity={0.8}
            >
              <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
                <Gift size={20} color="#3525CD" />
              </View>
              <Text className="text-white text-xs font-bold">
                {isTasker ? "Thưởng Tasker" : "Đổi quà"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Payment Method or Tasker Bank Account */}
        <View className="px-4 mt-2 mb-3">
          <Text className="text-lg font-extrabold text-slate-900">
            {isTasker ? "Tài khoản nhận lương / rút tiền" : "Phương thức thanh toán đã chọn"}
          </Text>
        </View>

        {isTasker ? (
          <View className="px-4">
            <View className="flex-row items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <View className="w-11 h-11 rounded-xl bg-blue-100 items-center justify-center">
                <Building2 size={22} color="#0068FF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-800">MBBank - Ngân hàng Quân Đội</Text>
                <Text className="text-xs text-slate-500 mt-0.5">STK: 9704 **** **** 1829</Text>
                <Text className="text-[11px] font-semibold text-emerald-600 mt-0.5">Chủ TK: NGUYEN MINH DUC (Đã xác thực)</Text>
              </View>
              <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center">
                <Check size={14} color="#059669" />
              </View>
            </View>
          </View>
        ) : (
          <View className="px-4 gap-2.5">
            {paymentMethods.map((m) => {
              const MethodIcon = m.Icon;
              return (
                <View key={m.id} className="flex-row items-center gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                  <View className="w-11 h-11 rounded-xl items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                    <MethodIcon size={22} color={m.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-800">{m.name}</Text>
                    <Text className="text-xs color-slate-500 mt-0.5">{m.sub}</Text>
                  </View>
                  <View className="p-0.5">
                    <CheckCircle2 size={20} color="#059669" />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Transaction History Section */}
        <View className="px-4 mt-5 mb-3 flex-row justify-between items-center">
          <Text className="text-lg font-extrabold text-slate-900">
            {isTasker ? "Lịch sử nhận thu nhập & rút tiền" : "Lịch sử biến động ví"}
          </Text>
          <Text className="text-xs font-semibold text-slate-400">Nhấn để xem chi tiết</Text>
        </View>

        {isLoading ? (
          <View className="py-5 items-center">
            <ActivityIndicator size="small" color="#3525CD" />
          </View>
        ) : history.length > 0 ? (
          <View className="px-4 gap-2.5">
            {history.map((item: any) => {
              const isPending = item.type === "DEPOSIT_PENDING" || item.status === "PENDING";
              const isCancelled = item.type === "DEPOSIT_CANCELLED" || item.status === "CANCELLED" || item.status === "FAILED";
              const amountStr = typeof item.amount === "number" ? item.amount.toLocaleString("vi-VN") + "đ" : "—";
              const isIncome = item.direction === "IN" || item.type === "RELEASE";
              const pMethod = item.metadata?.paymentMethod || item.provider || "";
              const desc = item.description || "";

              let typeText = desc;
              if (isPending) {
                typeText = `Nạp tiền (${(pMethod || "momo").toUpperCase()}) - Chờ thanh toán`;
              } else if (isCancelled) {
                typeText = `Nạp tiền (${(pMethod || "momo").toUpperCase()}) - Đã hủy`;
              } else if (item.type === "DEPOSIT") {
                if (pMethod === "MOMO" || desc.includes("MOMO")) typeText = "Nạp tiền qua Ví MoMo";
                else if (pMethod === "ZALOPAY" || desc.includes("ZALOPAY")) typeText = "Nạp tiền qua Ví ZaloPay";
                else if (pMethod === "VNPAY" || desc.includes("VNPAY")) typeText = "Nạp tiền qua VNPay Banking";
                else if (pMethod === "CARD" || desc.includes("CARD")) typeText = "Nạp tiền qua Thẻ Visa/Master";
                else typeText = "Nạp tiền vào Ví";
              } else if (item.type === "HOLD") {
                typeText = "Ký quỹ công việc (Hệ thống tạm giữ)";
              } else if (item.type === "REFUND") {
                typeText = "Hoàn tiền ký quỹ";
              } else if (item.type === "RELEASE") {
                typeText = isTasker
                  ? "💰 Thu nhập từ công việc (Nhận từ Held Balance Khách hàng)"
                  : "Giải ngân cho Tasker";
              }

              return (
                <TouchableOpacity
                  key={item._id || item.id}
                  onPress={() => setSelectedTransaction(item)}
                  activeOpacity={0.75}
                  className={`flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border ${
                    isPending ? "border-amber-400 bg-amber-50/50" : isCancelled ? "border-red-200 bg-red-50/30" : "border-slate-100"
                  } shadow-sm`}
                >
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ${isPending ? "bg-amber-100" : isCancelled ? "bg-red-100" : isIncome ? "bg-emerald-100" : "bg-amber-100"}`}>
                    {isPending ? (
                      <QrCode size={20} color="#D97706" />
                    ) : isCancelled ? (
                      <XCircle size={20} color="#DC2626" />
                    ) : isIncome ? (
                      <ArrowDownCircle size={20} color="#059669" />
                    ) : (
                      <ArrowUpCircle size={20} color="#D97706" />
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>
                      {typeText}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className={`text-sm font-extrabold ${isCancelled ? "text-slate-400 line-through" : isIncome ? "text-emerald-600" : "text-amber-700"}`}>
                      {isIncome ? `+${amountStr}` : `-${amountStr}`}
                    </Text>
                    {isPending ? (
                      <View className="flex-row items-center gap-1 bg-amber-500 px-2 py-0.5 rounded-md mt-1">
                        <PlayCircle size={11} color="#FFFFFF" />
                        <Text className="text-[10px] font-extrabold text-white">Tiếp tục</Text>
                      </View>
                    ) : isCancelled ? (
                      <Text className="text-[11px] font-semibold text-red-600 mt-0.5">🔴 Đã hủy</Text>
                    ) : (
                      <Text className="text-[11px] text-slate-400 mt-0.5">
                        {item.type === "HOLD" ? "🔒 Tạm giữ" : "Thành công"}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="mx-4 p-8 bg-white rounded-2xl items-center border border-dashed border-slate-200">
            <Receipt size={40} color="#94A3B8" />
            <Text className="text-sm font-bold text-slate-800 mt-2.5">Chưa có giao dịch nào</Text>
            <Text className="text-xs text-slate-400 mt-1 text-center">
              {isTasker
                ? "Thu nhập từ công việc hoàn thành sẽ tự động hiển thị ở đây."
                : "Các biến động nạp/rút và ký quỹ sẽ hiển thị tại đây."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Customer Top Up Modal */}
      {!isTasker && (
        <Modal
          visible={topUpModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setTopUpModalOpen(false)}
        >
          <View className="flex-1 bg-black/40 justify-center items-center p-5">
            <View className="w-full bg-white rounded-3xl p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-extrabold text-slate-900">Nạp tiền vào Ví TaskLy</Text>
                <TouchableOpacity onPress={() => setTopUpModalOpen(false)}>
                  <X size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text className="text-xs font-semibold text-slate-600 mb-2">Nhập số tiền cần nạp (VNĐ)</Text>
              <View className="border border-slate-300 rounded-xl px-3.5 h-12 justify-center mb-3">
                <TextInput
                  className="text-base font-bold text-slate-900"
                  keyboardType="numeric"
                  value={topUpAmount}
                  onChangeText={(val) => {
                    const cleaned = val.replace(/\D/g, "");
                    setTopUpAmount(cleaned ? Number(cleaned).toLocaleString("en-US") : "");
                  }}
                  placeholder="VD: 200,000"
                />
              </View>

              <View className="flex-row gap-2 mb-4">
                {["100000", "200000", "500000", "1000000"].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    onPress={() => setTopUpAmount(Number(amt).toLocaleString("en-US"))}
                    className="flex-1 bg-slate-100 py-2 rounded-lg items-center"
                  >
                    <Text className="text-xs font-bold text-indigo-600">{(Number(amt) / 1000).toLocaleString()}k</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-xs font-semibold text-slate-600 mb-2">Chọn phương thức nạp tiền</Text>
              <View className="gap-2 mb-5">
                {topUpMethods.map((m) => {
                  const isSelected = selectedPaymentMethod === m.id;
                  const MethodIcon = m.Icon;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => setSelectedPaymentMethod(m.id)}
                      className={`flex-row items-center justify-between p-3 rounded-2xl border ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60"
                          : "border-slate-200 bg-white"
                      }`}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          className="w-9 h-9 rounded-xl items-center justify-center"
                          style={{ backgroundColor: m.color + "18" }}
                        >
                          <MethodIcon size={18} color={m.color} />
                        </View>
                        <Text className="text-sm font-bold text-slate-800">{m.name}</Text>
                      </View>
                      {isSelected && (
                        <View className="w-5 h-5 rounded-full bg-indigo-600 items-center justify-center">
                          <CheckCircle2 size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                onPress={handleTopUpConfirm}
                className="bg-indigo-600 rounded-2xl py-3.5 items-center shadow-sm"
                activeOpacity={0.85}
              >
                <Text className="text-white text-sm font-bold">Xác nhận nạp tiền</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Tasker Withdraw Modal */}
      <Modal
        visible={withdrawModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setWithdrawModalOpen(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center p-5">
          <View className="w-full bg-white rounded-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-extrabold text-slate-900">Rút tiền về Ngân hàng</Text>
              <TouchableOpacity onPress={() => setWithdrawModalOpen(false)}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-4">
              <Text className="text-xs font-bold text-slate-700">Tài khoản nhận tiền:</Text>
              <Text className="text-xs text-slate-600 mt-1">🏦 MBBank - STK: 9704****1829</Text>
              <Text className="text-[11px] text-emerald-600 font-semibold mt-0.5">Chủ TK: NGUYEN MINH DUC</Text>
            </View>

            <Text className="text-xs font-semibold text-slate-600 mb-2">Nhập số tiền muốn rút (VNĐ)</Text>
            <View className="border border-slate-300 rounded-xl px-3.5 h-12 justify-center mb-3">
              <TextInput
                className="text-base font-bold text-slate-900"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={(val) => {
                  const cleaned = val.replace(/\D/g, "");
                  setWithdrawAmount(cleaned ? Number(cleaned).toLocaleString("en-US") : "");
                }}
                placeholder="VD: 300,000"
              />
            </View>

            <View className="flex-row gap-2 mb-4">
              {["100000", "200000", "500000", "1000000"].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setWithdrawAmount(Number(amt).toLocaleString("en-US"))}
                  className="flex-1 bg-slate-100 py-2 rounded-lg items-center"
                >
                  <Text className="text-xs font-bold text-indigo-600">{(Number(amt) / 1000).toLocaleString()}k</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              disabled={isWithdrawing}
              onPress={handleWithdrawConfirm}
              className="bg-indigo-600 rounded-2xl py-3.5 items-center shadow-sm flex-row justify-center"
              activeOpacity={0.85}
              style={isWithdrawing ? { opacity: 0.6 } : null}
            >
              {isWithdrawing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold">Xác nhận rút tiền</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        visible={Boolean(selectedTransaction)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 pb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-extrabold text-slate-900">Chi tiết giao dịch</Text>
              <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (() => {
              const item = selectedTransaction;
              const isPending = item.type === "DEPOSIT_PENDING" || item.status === "PENDING";
              const isCancelled = item.type === "DEPOSIT_CANCELLED" || item.status === "CANCELLED" || item.status === "FAILED";
              const isIncome = item.direction === "IN" || item.type === "RELEASE";
              const amountStr = typeof item.amount === "number" ? item.amount.toLocaleString("vi-VN") + "đ" : "—";
              const pMethod = item.metadata?.paymentMethod || item.provider || (isTasker ? "Ví thu nhập Tasker" : "Ví TaskLy");
              const txCode = item.paymentCode || item._id || item.id || "—";

              let statusLabel = "✅ Thành công";
              let statusColor = "text-emerald-700 bg-emerald-100";
              if (isPending) {
                statusLabel = "🟡 Đang chờ thanh toán";
                statusColor = "text-amber-800 bg-amber-100";
              } else if (isCancelled) {
                statusLabel = "🔴 Đã hủy giao dịch";
                statusColor = "text-red-700 bg-red-100";
              } else if (item.type === "HOLD") {
                statusLabel = "🔒 Hệ thống tạm giữ";
                statusColor = "text-amber-800 bg-amber-100";
              } else if (item.type === "REFUND") {
                statusLabel = "✅ Hoàn tiền ký quỹ";
                statusColor = "text-emerald-700 bg-emerald-100";
              } else if (item.type === "RELEASE" && isTasker) {
                statusLabel = "💰 Thu nhập đã cộng vào ví";
                statusColor = "text-emerald-700 bg-emerald-100";
              }

              return (
                <View>
                  {/* Amount Banner */}
                  <View className="items-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                    <Text className={`text-2xl font-extrabold ${isCancelled ? "text-slate-400 line-through" : isIncome ? "text-emerald-600" : "text-amber-700"}`}>
                      {isIncome ? `+${amountStr}` : `-${amountStr}`}
                    </Text>
                    <View className={`px-3 py-1 rounded-full mt-2 ${statusColor}`}>
                      <Text className="text-xs font-bold">{statusLabel}</Text>
                    </View>
                  </View>

                  {/* Transaction Attributes Card */}
                  <View className="bg-white rounded-2xl border border-slate-200 p-4 gap-3 mb-5">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-semibold text-slate-500">Mã giao dịch</Text>
                      <TouchableOpacity
                        onPress={() => Alert.alert("Thông báo", `Đã sao chép mã: ${txCode}`)}
                        className="flex-row items-center gap-1"
                      >
                        <Text className="text-xs font-mono font-bold text-indigo-700" numberOfLines={1}>
                          {txCode}
                        </Text>
                        <Copy size={13} color="#3525CD" />
                      </TouchableOpacity>
                    </View>

                    <View className="h-[1px] bg-slate-100" />

                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-semibold text-slate-500">Phương thức</Text>
                      <Text className="text-xs font-bold text-slate-800 uppercase">{pMethod}</Text>
                    </View>

                    <View className="h-[1px] bg-slate-100" />

                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-semibold text-slate-500">Thời gian</Text>
                      <Text className="text-xs font-bold text-slate-800">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                      </Text>
                    </View>

                    <View className="h-[1px] bg-slate-100" />

                    <View className="flex-row justify-between items-start">
                      <Text className="text-xs font-semibold text-slate-500 mr-2">Mô tả</Text>
                      <Text className="text-xs font-medium text-slate-800 flex-1 text-right">
                        {item.description || (isTasker ? "Thu nhập tự động từ heldBalance khi hoàn thành công việc" : "Giao dịch ví TaskLy")}
                      </Text>
                    </View>

                    {typeof item.balanceAfter === "number" && (
                      <>
                        <View className="h-[1px] bg-slate-100" />
                        <View className="flex-row justify-between items-center">
                          <Text className="text-xs font-semibold text-slate-500">Số dư ví sau giao dịch</Text>
                          <Text className="text-xs font-extrabold text-indigo-700">
                            {item.balanceAfter.toLocaleString("vi-VN")}đ
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Actions Footer */}
                  {isPending && !isTasker ? (
                    <TouchableOpacity
                      onPress={() => handleResumePendingPayment(item)}
                      className="bg-indigo-600 rounded-2xl py-3.5 items-center flex-row justify-center space-x-2 shadow-sm"
                      activeOpacity={0.85}
                    >
                      <PlayCircle size={18} color="#FFFFFF" />
                      <Text className="text-white text-sm font-bold ml-1.5">Tiếp tục thanh toán</Text>
                    </TouchableOpacity>
                  ) : isCancelled && !isTasker ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTransaction(null);
                        setTopUpModalOpen(true);
                      }}
                      className="bg-indigo-600 rounded-2xl py-3.5 items-center flex-row justify-center space-x-2 shadow-sm"
                      activeOpacity={0.85}
                    >
                      <ArrowDownCircle size={18} color="#FFFFFF" />
                      <Text className="text-white text-sm font-bold ml-1.5">Thử lại giao dịch nạp tiền</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setSelectedTransaction(null)}
                      className="bg-slate-100 rounded-2xl py-3.5 items-center"
                      activeOpacity={0.85}
                    >
                      <Text className="text-slate-800 text-sm font-bold">Đóng</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
