// screens/CreateTaskScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants & Components
import Button from "../components/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { categoryApi, taskApi } from "../../../service/api";

export default function ClientCreateTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskName?: string; rate?: string }>();
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

  // API dynamic states
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    categoryApi.getCategories()
      .then((res: any) => {
        setCategories(res);
        if (res && res.length > 0) {
          setSelectedCategoryId(res[0]._id || res[0].id);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh mục:", err);
      });
  }, []);

  const formatBudgetInput = (text: string) => {
    const cleaned = text.replace(/\D/g, ""); // keep only digits
    if (!cleaned) return "";
    return Number(cleaned).toLocaleString("en-US"); // formats with commas
  };

  const handleApplyAISuggestion = () => {
    setBudget(formatBudgetInput("250000")); // apply recommendations with commas
  };

  const getCategoryIcon = (name: string): any => {
    const n = name.toLowerCase();
    if (n.includes("dọn") || n.includes("sạch")) return "sparkles-outline";
    if (n.includes("chuyển") || n.includes("giao") || n.includes("đồ")) return "cube-outline";
    if (n.includes("lắp") || n.includes("sửa") || n.includes("setup")) return "build-outline";
    if (n.includes("chợ") || n.includes("mua")) return "cart-outline";
    return "time-outline";
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const formatDateInput = (text: string) => {
    const cleaned = text.replace(/\D/g, ""); // keep only digits
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    return formatted.slice(0, 10); // max length 10 (dd/mm/yyyy)
  };

  const formatTimeInput = (text: string) => {
    const cleaned = text.replace(/\D/g, ""); // keep only digits
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }
    return formatted.slice(0, 5); // max length 5 (hh:mm)
  };

  /**
   * Trả về true nếu ngày/giờ hợp lệ và KHÔNG ở trong quá khứ.
   * dateStr: dd/mm/yyyy, timeStr: hh:mm (có thể để trống — chỉ check ngày).
   */
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
      // Nếu chưa nhập giờ, so sánh theo ngày (bắt đầu ngày đó)
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
    // 1. Validate Category
    if (!selectedCategoryId) {
      showAlert("Thiếu thông tin", "Vui lòng chọn danh mục công việc.");
      return;
    }

    // 2. Validate Title (3-150 characters)
    if (!taskName || taskName.trim().length < 3 || taskName.trim().length > 150) {
      showAlert("Thiếu thông tin", "Tên công việc phải có độ dài từ 3 đến 150 ký tự.");
      return;
    }

    // 3. Validate Address
    if (!address || !address.trim()) {
      showAlert("Thiếu thông tin", "Vui lòng cung cấp địa chỉ thực hiện.");
      return;
    }

    // 4. Validate Date & Time (không được ở quá khứ)
    const dtError = validateDateTime(date, time);
    if (dtError) {
      setDateError(dtError);
      showAlert("Thời gian không hợp lệ", dtError);
      return;
    }

    // 4. Validate Budget
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
      .then((createdTask: any) => {
        setIsLoading(false);
        showAlert("Thành công", "Đăng bài tuyển dụng thành công! Vui lòng chờ ứng viên nộp đơn.");
        router.replace("/(tabs)");
      })
      .catch((err: any) => {
        setIsLoading(false);
        const errMsg = err.message || "Tạo công việc thất bại. Vui lòng thử lại!";
        Alert.alert("Thất bại", errMsg);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Intro */}
        <View style={styles.headerIntro}>
          <Text style={styles.headerSubtitle}>
            Điền thông tin chi tiết để tìm người hỗ trợ nhanh nhất.
          </Text>
        </View>

        {/* Section 1: Basic Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>DANH MỤC CÔNG VIỆC</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
            style={{ marginBottom: 15 }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat._id;
              return (
                <TouchableOpacity
                  key={cat._id}
                  onPress={() => setSelectedCategoryId(cat._id)}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={getCategoryIcon(cat.name)}
                    size={14}
                    color={isSelected ? Colors.white : Colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionHeader}>THÔNG TIN CƠ BẢN</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên công việc</Text>
            <TextInput
              style={styles.textInput}
              placeholder="VD: Dọn dẹp nhà cửa, Sửa ống nước..."
              placeholderTextColor={Colors.outline}
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mô tả chi tiết</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Mô tả rõ yêu cầu của bạn để Tasker hiểu rõ hơn..."
              placeholderTextColor={Colors.outline}
              multiline
              numberOfLines={4}
              value={taskDesc}
              onChangeText={setTaskDesc}
            />
          </View>
        </View>

        {/* Section 2: Location & Timing */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>THỜI GIAN & ĐỊA ĐIỂM</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ thực hiện</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.outline}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Nhập địa chỉ của bạn"
                placeholderTextColor={Colors.outline}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, styles.flexHalf]}>
              <Text style={styles.inputLabel}>Ngày</Text>
              <View style={styles.inputWithIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Colors.outline}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={[
                    styles.textInputWithIcon,
                    dateError ? { borderColor: "#EF4444" } : undefined,
                  ]}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor={Colors.outline}
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
              <Text style={{ color: "#EF4444", fontSize: 11, marginTop: 4, marginLeft: 2 }}>{dateError}</Text>
            ) : null}
            </View>

            <View style={[styles.inputGroup, styles.flexHalf]}>
              <Text style={styles.inputLabel}>Giờ</Text>
              <View style={styles.inputWithIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={Colors.outline}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={[
                    styles.textInputWithIcon,
                    timeError ? { borderColor: "#EF4444" } : undefined,
                  ]}
                  placeholder="hh:mm"
                  placeholderTextColor={Colors.outline}
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
              <Text style={{ color: "#EF4444", fontSize: 11, marginTop: 4, marginLeft: 2 }}>{timeError}</Text>
            ) : null}
            </View>
          </View>
        </View>

        {/* Section 3: Budget */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>NGÂN SÁCH</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngân sách dự kiến (VND)</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={Colors.outline}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="VD: 200,000"
                placeholderTextColor={Colors.outline}
                keyboardType="numeric"
                value={budget}
                onChangeText={(val) => setBudget(formatBudgetInput(val))}
              />
            </View>
          </View>

          {/* AI Suggestion Box */}
          <View style={styles.aiSuggestionCard}>
            <View style={styles.aiIconBadge}>
              <Ionicons name="sparkles" size={18} color={Colors.primary} />
            </View>
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiTitle}>Gợi ý giá từ Taskly AI</Text>
              <Text style={styles.aiDesc}>
                Dựa trên thị trường, mức giá hợp lý cho công việc này khoảng{" "}
                <Text style={styles.aiPriceHighlight}>150.000đ - 250.000đ</Text>
                .
              </Text>
              <TouchableOpacity onPress={handleApplyAISuggestion}>
                <Text style={styles.aiApplyButton}>Áp dụng giá gợi ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section 4: Attachments */}
        <View style={styles.card}>
          <View style={styles.attachmentHeader}>
            <Text style={styles.sectionHeader}>HÌNH ẢNH ĐÍNH KÈM</Text>
            <Text style={styles.optionalText}>Tùy chọn</Text>
          </View>

          <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
            <View style={styles.uploadIconCircle}>
              <Ionicons
                name="camera-outline"
                size={28}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.uploadMainText}>Nhấn để tải ảnh lên</Text>
            <Text style={styles.uploadSubText}>
              Hỗ trợ JPG, PNG (Tối đa 5MB)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Submit Button */}
        <View style={styles.buttonContainer}>
          <Button title={isLoading ? "Đang xử lý..." : "Đăng bài"} onPress={handleSubmit} disabled={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerIntro: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
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
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Layout.spacing.md,
  },
  inputGroup: {
    marginBottom: Layout.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.onSurface,
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Layout.borderRadius.default,
    paddingHorizontal: Layout.spacing.md,
    fontSize: 15,
    color: Colors.onSurface,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 100,
    paddingTop: Layout.spacing.sm,
    textAlignVertical: "top",
  },
  inputWithIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Layout.borderRadius.default,
    height: 48,
    backgroundColor: Colors.background,
  },
  fieldIcon: {
    paddingLeft: Layout.spacing.md,
    paddingRight: Layout.spacing.sm,
  },
  textInputWithIcon: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: Colors.onSurface,
  },
  rowGrid: {
    flexDirection: "row",
    gap: Layout.spacing.md,
  },
  flexHalf: {
    flex: 1,
  },
  aiSuggestionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    // borderColor: Colors.surfaceDim,
    borderRadius: Layout.borderRadius.default,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
  },
  aiIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: Layout.spacing.md,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 2,
  },
  aiDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  aiPriceHighlight: {
    color: Colors.primary,
    fontWeight: "600",
  },
  aiApplyButton: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  attachmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  optionalText: {
    fontSize: 12,
    color: Colors.outline,
    fontWeight: "500",
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderStyle: "dashed",
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.spacing.sm,
  },
  uploadMainText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  uploadSubText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  buttonContainer: {
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  categoryScroll: {
    paddingRight: Layout.spacing.md,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  categoryChipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});
