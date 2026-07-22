// screens/CreateTaskScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Constants & Components
import Button from "../components/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

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
  const [budget, setBudget] = useState(initialRate ? "200000" : "");

  const handleApplyAISuggestion = () => {
    setBudget("250000"); // apply recommendations
  };

  const handleSubmit = () => {
    if (!taskName || !taskDesc || !address || !budget) {
      if (Platform.OS === "web") {
        alert(
          "Vui lòng điền đầy đủ thông tin: Tên công việc, mô tả, địa chỉ và ngân sách.",
        );
      } else {
        Alert.alert(
          "Thiếu thông tin",
          "Vui lòng điền đầy đủ các thông tin cần thiết.",
        );
      }
      return;
    }

    router.push({
      pathname: "/(tabs)/ai-smart-price",
      params: {
        taskName,
        taskDesc,
        address,
        date,
        time,
        budget: budget + "đ",
      },
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
                  style={styles.textInputWithIcon}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor={Colors.outline}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
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
                  style={styles.textInputWithIcon}
                  placeholder="--:-- --"
                  placeholderTextColor={Colors.outline}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
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
                onChangeText={setBudget}
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
          <Button title="Đăng tin ngay" onPress={handleSubmit} />
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
});
