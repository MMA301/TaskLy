import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../constants/Colors";

export default function AISmartPriceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    taskName?: string;
    address?: string;
  }>();
  const taskName =
    typeof params.taskName === "string"
      ? params.taskName
      : "Sửa máy lạnh căn hộ";
  const address =
    typeof params.address === "string"
      ? params.address
      : "Quận 7, TP. Hồ Chí Minh";

  const handleApplyNow = () => {
    router.push("/(tabs)/checkout");
  };

  const handleEditPrice = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View
          className="mx-4 mt-4 rounded-2xl border p-6 shadow-sm"
          style={{
            backgroundColor: Colors.surface,
            borderColor: Colors.outlineVariant,
          }}
        >
          <View className="mb-4 flex-row items-center">
            <Ionicons name="sparkles" size={18} color={Colors.primary} />
            <Text
              className="ml-2 text-[12px] font-bold uppercase tracking-[1px]"
              style={{ color: Colors.onSurfaceVariant }}
            >
              AI Smart Price
            </Text>
          </View>

          <Text
            className="text-[36px] font-extrabold"
            style={{ color: Colors.primary }}
          >
            250,000 VND
          </Text>
          <Text
            className="mt-2 text-center text-sm"
            style={{ color: Colors.onSurfaceVariant }}
          >
            Mức giá khuyến nghị để hoàn thành nhanh nhất
          </Text>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleApplyNow}
              className="flex-1 items-center justify-center rounded-xl border py-3"
              style={{
                backgroundColor: Colors.primary,
                borderColor: Colors.primary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: Colors.white }}
              >
                Áp dụng ngay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEditPrice}
              className="flex-1 items-center justify-center rounded-xl border py-3"
              style={{
                backgroundColor: Colors.surface,
                borderColor: Colors.outlineVariant,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: Colors.primary }}
              >
                Chỉnh sửa giá
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          className="mx-4 mt-6 text-lg font-bold"
          style={{ color: Colors.onSurface }}
        >
          Phân tích yếu tố
        </Text>

        <View className="mx-4 mt-3 flex-row flex-wrap gap-4">
          <View
            className="w-[47.5%] rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: Colors.surface,
              borderColor: Colors.outlineVariant,
            }}
          >
            <View className="mb-2 flex-row items-center justify-between">
              <Ionicons name="trending-up" size={20} color={Colors.primary} />
              <View
                className="rounded-full px-2 py-1"
                style={{ backgroundColor: Colors.primaryFixed }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{ color: Colors.primary }}
                >
                  CAO
                </Text>
              </View>
            </View>
            <Text
              className="mb-1 text-sm font-semibold"
              style={{ color: Colors.onSurface }}
            >
              Nhu cầu thị trường
            </Text>
            <Text
              className="text-[11px] leading-4"
              style={{ color: Colors.onSurfaceVariant }}
            >
              Đang có 12 yêu cầu tương tự gần bạn.
            </Text>
          </View>

          <View
            className="w-[47.5%] rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: Colors.surface,
              borderColor: Colors.outlineVariant,
            }}
          >
            <View className="mb-2 flex-row items-center justify-between">
              <Ionicons name="map-outline" size={20} color={Colors.secondary} />
              <Text
                className="text-sm font-bold"
                style={{ color: Colors.secondary }}
              >
                3.2 km
              </Text>
            </View>
            <Text
              className="mb-1 text-sm font-semibold"
              style={{ color: Colors.onSurface }}
            >
              Khoảng cách
            </Text>
            <Text
              className="text-[11px] leading-4"
              style={{ color: Colors.onSurfaceVariant }}
            >
              Quãng đường di chuyển trung bình.
            </Text>
          </View>

          <View
            className="mt-1 w-full rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: Colors.surface,
              borderColor: Colors.outlineVariant,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="mr-4 h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: Colors.surfaceContainer }}
              >
                <Ionicons
                  name="git-network-outline"
                  size={20}
                  color={Colors.secondary}
                />
              </View>
              <View className="flex-1">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: Colors.onSurface }}
                  >
                    Độ phức tạp: Trung bình
                  </Text>
                  <Text
                    className="text-xs font-bold"
                    style={{ color: Colors.secondary }}
                  >
                    Bình thường
                  </Text>
                </View>
                <View
                  className="h-1.5 w-full rounded-full"
                  style={{ backgroundColor: Colors.surfaceContainerHigh }}
                >
                  <View
                    className="h-1.5 w-[60%] rounded-full"
                    style={{ backgroundColor: Colors.secondary }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          className="mx-4 mt-5 rounded-2xl border p-5 shadow-sm"
          style={{
            backgroundColor: Colors.surface,
            borderColor: Colors.outlineVariant,
          }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text
                className="text-base font-bold"
                style={{ color: Colors.onSurface }}
              >
                Xu hướng giá
              </Text>
              <Text
                className="text-xs"
                style={{ color: Colors.onSurfaceVariant }}
              >
                Các công việc tương tự tại TP.HCM
              </Text>
            </View>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={Colors.outline}
            />
          </View>

          <View className="mb-5 h-[180px] flex-row items-end justify-between px-2">
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "40%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                T2
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "55%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                T3
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "45%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                T4
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg border-2"
                style={{
                  height: "85%",
                  backgroundColor: Colors.primary,
                  borderColor: Colors.primaryFixed,
                }}
              />
              <Text
                className="mt-2 text-[10px] font-bold"
                style={{ color: Colors.primary }}
              >
                Hnay
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "70%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                T6
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "90%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                T7
              </Text>
            </View>
            <View className="flex-1 items-center justify-end">
              <View
                className="w-[80%] rounded-t-lg"
                style={{
                  height: "80%",
                  backgroundColor: Colors.surfaceContainerHigh,
                }}
              />
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                CN
              </Text>
            </View>
          </View>

          <View
            className="flex-row justify-between border-t pt-4"
            style={{ borderColor: Colors.outlineVariant }}
          >
            <View className="flex-row items-center">
              <View
                className="mr-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: Colors.primary }}
              />
              <Text
                className="text-xs font-medium"
                style={{ color: Colors.onSurface }}
              >
                Giá đề xuất
              </Text>
            </View>
            <View className="flex-row items-center">
              <View
                className="mr-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: Colors.surfaceContainerHigh }}
              />
              <Text
                className="text-xs font-medium"
                style={{ color: Colors.onSurface }}
              >
                Trung bình khu vực
              </Text>
            </View>
          </View>
        </View>

        <View
          className="mx-4 mt-5 flex-row items-center rounded-2xl border p-4"
          style={{
            backgroundColor: Colors.surfaceContainerLow,
            borderColor: Colors.primaryFixed,
          }}
        >
          <View
            className="mr-3 h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: Colors.secondary }}
          >
            <Ionicons name="flash" size={18} color={Colors.white} />
          </View>
          <View className="flex-1">
            <Text
              className="text-sm font-semibold"
              style={{ color: Colors.onSurface }}
            >
              Khả năng nhận việc: Cao
            </Text>
            <Text
              className="text-xs leading-4"
              style={{ color: Colors.onSurfaceVariant }}
            >
              95% công việc ở mức giá này được nhận trong 5 phút.
            </Text>
          </View>
        </View>

        <View className="mx-4 mt-6 overflow-hidden rounded-2xl shadow-sm">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&auto=format&fit=crop",
            }}
            className="h-[150px] w-full"
          />
          <View className="p-4" style={{ backgroundColor: Colors.surface }}>
            <Text
              className="text-base font-bold"
              style={{ color: Colors.onSurface }}
            >
              {taskName}
            </Text>
            <Text
              className="mt-1 text-sm"
              style={{ color: Colors.onSurfaceVariant }}
            >
              <Ionicons name="location" size={14} color={Colors.outline} />{" "}
              {address}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
