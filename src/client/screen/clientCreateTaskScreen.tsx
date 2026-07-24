import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin,
  Calendar,
  Clock,
  Banknote,
  Sparkles,
  Camera,
  Paintbrush,
  Truck,
  Wrench,
  ShoppingCart,
  Shirt,
  LucideIcon,
} from "lucide-react-native";

// Services & Components
import Button from "../components/Button";
import { categoryApi, taskApi } from "../../../service/api";
import { getGeminiSmartPrice, GeminiPriceResult } from "../../../service/geminiService";

export default function ClientCreateTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskName?: string; rate?: string; categoryId?: string }>();
  const initialTaskName =
    typeof params.taskName === "string" ? params.taskName : "";
  const initialRate = typeof params.rate === "string" ? params.rate : "";

  // Inputs state
  const [taskName, setTaskName] = useState(initialTaskName);
  const [taskDesc, setTaskDesc] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [budget, setBudget] = useState(initialRate ? "200000" : "");

  // Gemini AI Price states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPriceData, setAiPriceData] = useState<GeminiPriceResult | null>(null);

  // API dynamic states
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    categoryApi.getCategories()
      .then((res: any) => {
        setCategories(res);
        if (res && res.length > 0) {
          const match = params.categoryId
            ? res.find((c: any) => (c._id || c.id) === params.categoryId)
            : null;
          if (match) {
            setSelectedCategoryId(match._id || match.id);
          } else {
            setSelectedCategoryId(res[0]._id || res[0].id);
          }
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh mục:", err);
      });
  }, [params.categoryId]);

  const formatBudgetInput = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (!cleaned) return "";
    return Number(cleaned).toLocaleString("en-US");
  };

  const getCategoryIcon = (name: string): LucideIcon => {
    const n = (name || "").toLowerCase();
    if (n.includes("dọn") || n.includes("sạch")) return Paintbrush;
    if (n.includes("chuyển") || n.includes("đồ")) return Truck;
    if (n.includes("lắp") || n.includes("bàn") || n.includes("sửa")) return Wrench;
    if (n.includes("mua")) return ShoppingCart;
    if (n.includes("giặt")) return Shirt;
    return Clock;
  };

  const formatDateInput = (text: string): string => {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const formatTimeInput = (text: string): string => {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const handleFetchGeminiPrice = async () => {
    if (!taskName.trim()) {
      showAlert("Thiếu tên công việc", "Vui lòng nhập tên công việc để AI gợi ý mức giá chính xác nhất.");
      return;
    }
    const catObj = categories.find((c) => c._id === selectedCategoryId || c.id === selectedCategoryId);
    const catName = catObj?.name || "";

    setAiLoading(true);
    setAiPriceData(null);

    try {
      const result = await getGeminiSmartPrice(taskName, taskDesc, address || catName);
      setAiPriceData(result);
    } catch (err: any) {
      showAlert("Lỗi Gemini AI", err.message || "Không thể tải gợi ý giá từ Gemini.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAISuggestion = () => {
    if (aiPriceData) {
      setBudget(aiPriceData.recommendedPrice.toLocaleString("en-US"));
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "Đã hiểu" }]);
  };

  const validateDateTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr || dateStr.length < 10) return "Vui lòng nhập đầy đủ ngày (dd/mm/yyyy).";
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    if (!dd || !mm || !yyyy || mm < 1 || mm > 12 || dd < 1 || dd > 31)
      return "Ngày không hợp lệ.";

    const now = new Date();
    let selectedDate: Date;

    if (timeStr && timeStr.length === 5) {
      const [hh, mins] = timeStr.split(":").map(Number);
      if (hh > 23 || mins > 59) return "Giờ không hợp lệ (hh:mm).";
      selectedDate = new Date(yyyy, mm - 1, dd, hh, mins, 0, 0);
    } else {
      selectedDate = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    }

    if (isNaN(selectedDate.getTime())) return "Ngày không hợp lệ.";
    if (selectedDate <= now) return "Thời gian thực hiện phải ở tương lai.";
    return "";
  };

  const validateDateOnly = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 10) return "";
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    if (!dd || !mm || !yyyy || mm < 1 || mm > 12 || dd < 1 || dd > 31)
      return "Ngày không hợp lệ.";
    const now = new Date();
    const selected = new Date(yyyy, mm - 1, dd, 23, 59, 59);
    if (isNaN(selected.getTime())) return "Ngày không hợp lệ.";
    if (selected < now) return "Ngày phải từ hôm nay trở đi.";
    return "";
  };

  const validateTimeOnly = (timeStr: string, dateStr: string): string => {
    if (!timeStr || timeStr.length < 5) return "";
    const [hh, mins] = timeStr.split(":").map(Number);
    if (hh > 23 || mins > 59) return "Giờ không hợp lệ (hh:mm).";
    if (dateStr && dateStr.length === 10) {
      const [dd, mm, yyyy] = dateStr.split("/").map(Number);
      const selected = new Date(yyyy, mm - 1, dd, hh, mins, 0, 0);
      if (!isNaN(selected.getTime()) && selected <= new Date())
        return "Thời gian phải ở tương lai.";
    }
    return "";
  };

  const handleSubmit = () => {
    if (!selectedCategoryId) {
      showAlert("Thiếu thông tin", "Vui lòng chọn danh mục công việc.");
      return;
    }

    if (!taskName || taskName.trim().length < 3 || taskName.trim().length > 150) {
      showAlert("Thiếu thông tin", "Tên công việc phải có độ dài từ 3 đến 150 ký tự.");
      return;
    }

    if (!address || !address.trim()) {
      showAlert("Thiếu thông tin", "Vui lòng cung cấp địa chỉ thực hiện.");
      return;
    }

    const dtError = validateDateTime(date, time);
    if (dtError) {
      setDateError(dtError);
      showAlert("Thời gian không hợp lệ", dtError);
      return;
    }

    const cleanBudget = budget.replace(/[^0-9]/g, '');
    if (!cleanBudget) {
      showAlert("Thiếu thông tin", "Vui lòng nhập ngân sách công việc.");
      return;
    }

    const priceNum = Number(cleanBudget);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert("Lỗi", "Ngân sách phải là một số dương hợp lệ.");
      return;
    }

    setIsLoading(true);

    taskApi.createTask({
      categoryId: selectedCategoryId,
      title: taskName.trim(),
      description: taskDesc.trim(),
      address: address.trim(),
      price: priceNum,
      location: {
        type: 'Point',
        coordinates: [106.660172, 10.762622]
      }
    })
      .then(() => {
        setIsLoading(false);
        showAlert("Thành công", "Đăng bài tuyển dụng & ký quỹ thành công! Tiền sẽ được hệ thống tạm giữ an toàn cho đến khi hoàn thành.");
        router.replace("/(tabs)");
      })
      .catch((err: any) => {
        setIsLoading(false);
        const errMsg = err.message || "";
        if (errMsg.toLowerCase().includes("insufficient wallet balance") || errMsg.toLowerCase().includes("không đủ")) {
          Alert.alert(
            "Số dư ví không đủ",
            `Số dư Ví TaskLy của bạn không đủ để ký quỹ công việc này (${priceNum.toLocaleString("vi-VN")}đ).\n\nHệ thống sẽ tự động giữ khoản tiền này cho đến khi công việc hoàn tất. Vui lòng nạp tiền vào ví!`,
            [
              { text: "Để sau", style: "cancel" },
              {
                text: "Nạp tiền ngay",
                onPress: () => router.push("/(tabs)/wallet"),
              },
            ]
          );
        } else {
          Alert.alert("Thất bại", errMsg || "Tạo công việc thất bại. Vui lòng thử lại!");
        }
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header Intro */}
        <View className="px-4 pt-3 pb-2">
          <Text className="text-sm text-slate-500 font-medium">
            Điền thông tin chi tiết để tìm người hỗ trợ nhanh nhất.
          </Text>
        </View>

        {/* Section 1: Basic Info */}
        <View className="bg-white rounded-2xl p-4 mx-4 mt-3 border border-slate-100 shadow-sm">
          <Text className="text-xs font-bold text-indigo-600 tracking-wider mb-3 uppercase">DANH MỤC CÔNG VIỆC</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat._id;
              const IconComp = getCategoryIcon(cat.name);
              return (
                <TouchableOpacity
                  key={cat._id}
                  onPress={() => setSelectedCategoryId(cat._id)}
                  className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 border ${
                    isSelected ? "bg-indigo-600 border-indigo-600" : "bg-indigo-50 border-indigo-100"
                  }`}
                  activeOpacity={0.7}
                >
                  <IconComp size={14} color={isSelected ? "#FFFFFF" : "#3525CD"} style={{ marginRight: 6 }} />
                  <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-indigo-700"}`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text className="text-xs font-bold text-indigo-600 tracking-wider mb-3 uppercase">THÔNG TIN CƠ BẢN</Text>

          <View className="mb-4">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Tên công việc</Text>
            <TextInput
              className="h-12 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-white"
              placeholder="VD: Dọn dẹp nhà cửa, Sửa ống nước..."
              placeholderTextColor="#94A3B8"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          <View className="mb-1">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Mô tả chi tiết</Text>
            <TextInput
              className="h-24 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-white text-top"
              placeholder="Mô tả rõ yêu cầu của bạn để Tasker hiểu rõ hơn..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={taskDesc}
              onChangeText={setTaskDesc}
            />
          </View>
        </View>

        {/* Section 2: Location & Timing */}
        <View className="bg-white rounded-2xl p-4 mx-4 mt-3 border border-slate-100 shadow-sm">
          <Text className="text-xs font-bold text-indigo-600 tracking-wider mb-3 uppercase">THỜI GIAN & ĐỊA ĐIỂM</Text>

          <View className="mb-4">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Địa chỉ thực hiện</Text>
            <View className="flex-row items-center border border-slate-200 rounded-xl px-3 h-12 bg-white">
              <MapPin size={18} color="#64748B" className="mr-2" />
              <TextInput
                className="flex-1 text-sm text-slate-900 ml-2"
                placeholder="Nhập địa chỉ của bạn"
                placeholderTextColor="#94A3B8"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 mb-1">
              <Text className="text-xs font-semibold text-slate-700 mb-1.5">Ngày</Text>
              <View className={`flex-row items-center border rounded-xl px-3 h-12 bg-white ${dateError ? "border-red-500" : "border-slate-200"}`}>
                <Calendar size={18} color="#64748B" />
                <TextInput
                  className="flex-1 text-sm text-slate-900 ml-2"
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={date}
                  onChangeText={(val) => {
                    const formatted = formatDateInput(val);
                    setDate(formatted);
                    if (dateError) setDateError("");
                  }}
                  onBlur={() => {
                    const err = validateDateOnly(date);
                    setDateError(err);
                    if (!err && time) setTimeError(validateTimeOnly(time, date));
                  }}
                />
              </View>
              {dateError ? (
                <Text className="text-red-500 text-[11px] mt-1 ml-0.5">{dateError}</Text>
              ) : null}
            </View>

            <View className="flex-1 mb-1">
              <Text className="text-xs font-semibold text-slate-700 mb-1.5">Giờ</Text>
              <View className={`flex-row items-center border rounded-xl px-3 h-12 bg-white ${timeError ? "border-red-500" : "border-slate-200"}`}>
                <Clock size={18} color="#64748B" />
                <TextInput
                  className="flex-1 text-sm text-slate-900 ml-2"
                  placeholder="hh:mm"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={time}
                  onChangeText={(val) => {
                    const formatted = formatTimeInput(val);
                    setTime(formatted);
                    if (timeError) setTimeError("");
                  }}
                  onBlur={() => {
                    const err = validateTimeOnly(time, date);
                    setTimeError(err);
                  }}
                />
              </View>
              {timeError ? (
                <Text className="text-red-500 text-[11px] mt-1 ml-0.5">{timeError}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Section 3: Budget */}
        <View className="bg-white rounded-2xl p-4 mx-4 mt-3 border border-slate-100 shadow-sm">
          <Text className="text-xs font-bold text-indigo-600 tracking-wider mb-3 uppercase">NGÂN SÁCH</Text>

          <View className="mb-3">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Ngân sách dự kiến (VND)</Text>
            <View className="flex-row items-center border border-slate-200 rounded-xl px-3 h-12 bg-white">
              <Banknote size={18} color="#64748B" />
              <TextInput
                className="flex-1 text-sm font-bold text-slate-900 ml-2"
                placeholder="VD: 200,000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={budget}
                onChangeText={(val) => setBudget(formatBudgetInput(val))}
              />
            </View>
          </View>

          {/* AI Suggestion Box */}
          <View className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex-row gap-3">
            <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center">
              <Sparkles size={16} color="#3525CD" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-indigo-900 mb-1">Gợi ý giá từ Taskly AI (Gemini)</Text>

              {aiLoading ? (
                <View className="flex-row items-center gap-2 my-1.5">
                  <ActivityIndicator size="small" color="#3525CD" />
                  <Text className="text-xs text-indigo-700">Đang gọi Google Gemini AI phân tích giá...</Text>
                </View>
              ) : aiPriceData ? (
                <>
                  <Text className="text-xs text-slate-700">
                    Khuyến nghị:{" "}
                    <Text className="font-extrabold text-indigo-600">
                      {aiPriceData.recommendedPrice.toLocaleString("vi-VN")}đ
                    </Text>{" "}
                    ({aiPriceData.rangeMin.toLocaleString("vi-VN")}đ - {aiPriceData.rangeMax.toLocaleString("vi-VN")}đ)
                  </Text>
                  <Text className="text-[11px] text-slate-500 mt-0.5">
                    Độ phức tạp: {aiPriceData.complexity} • Nhu cầu: {aiPriceData.demand}
                  </Text>
                  <TouchableOpacity onPress={handleApplyAISuggestion} className="mt-1.5">
                    <Text className="text-xs font-bold text-indigo-600 underline">Áp dụng mức giá khuyến nghị này</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="text-xs text-slate-600">
                    Nhập tên công việc và nhấn bên dưới để Google Gemini phân tích mức giá thị trường tối ưu.
                  </Text>
                  <TouchableOpacity onPress={handleFetchGeminiPrice} className="mt-1.5">
                    <Text className="text-xs font-bold text-indigo-600">✨ Phân tích & Gợi ý giá cùng Gemini AI</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Section 4: Attachments */}
        <View className="bg-white rounded-2xl p-4 mx-4 mt-3 border border-slate-100 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-bold text-indigo-600 tracking-wider uppercase">HÌNH ẢNH ĐÍNH KÈM</Text>
            <Text className="text-xs text-slate-400 font-medium">Tùy chọn</Text>
          </View>

          <TouchableOpacity className="border-2 border-dashed border-slate-200 rounded-xl p-5 items-center bg-slate-50/50" activeOpacity={0.7}>
            <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center mb-2 border border-indigo-100">
              <Camera size={24} color="#3525CD" />
            </View>
            <Text className="text-xs font-bold text-slate-800">Nhấn để tải ảnh lên</Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ JPG, PNG (Tối đa 5MB)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Submit Button */}
        <View className="px-4 mt-5">
          <Button title={isLoading ? "Đang xử lý..." : "Đăng bài"} onPress={handleSubmit} disabled={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
