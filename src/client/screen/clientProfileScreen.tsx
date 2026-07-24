import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle2,
  MapPin,
  Pencil,
  Star,
  Clock,
  Wallet,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  LucideIcon,
  Mail,
  Phone,
} from "lucide-react-native";

// Services & Session
import { clearAuthSession } from "../../session";
import { taskApi, userApi } from "../../../service/api";

type ClientProfileScreenProps = {
  session?: any;
};

export default function ClientProfileScreen({ session }: ClientProfileScreenProps = {}) {
  const [user, setUser] = useState<any>(null);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      userApi.getProfile(),
      taskApi.getTasks(),
    ])
      .then(([userRes, taskRes]) => {
        if (!isMounted) return;

        if (userRes.status === "fulfilled") {
          const u = userRes.value?.data || userRes.value;
          setUser(u);
        }

        if (taskRes.status === "fulfilled") {
          const list = Array.isArray(taskRes.value)
            ? taskRes.value
            : taskRes.value?.data || [];
          setTaskCount(list.length);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          clearAuthSession();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuSection1: {
    id: string;
    label: string;
    Icon: LucideIcon;
  }[] = [
    { id: "history", label: "Lịch sử công việc", Icon: Clock },
    { id: "wallet", label: "Ví TaskLy & Thanh toán", Icon: Wallet },
    { id: "address", label: "Địa chỉ đã lưu", Icon: MapPin },
  ];

  const menuSection2: {
    id: string;
    label: string;
    Icon: LucideIcon;
  }[] = [
    { id: "settings", label: "Cài đặt", Icon: Settings },
    { id: "support", label: "Hỗ trợ", Icon: HelpCircle },
  ];

  const handleMenuItemPress = (menuId: string) => {
    if (menuId === "history") {
      router.push("/(tabs)/tracking");
    } else if (menuId === "wallet") {
      router.push("/(tabs)/wallet");
    } else {
      if (Platform.OS === "web") {
        alert(`Tính năng "${menuId}" đang được phát triển.`);
      } else {
        Alert.alert("Thông báo", `Tính năng "${menuId}" đang được phát triển.`);
      }
    }
  };

  const userName = user?.fullName || "Khách hàng TaskLy";
  const userEmail = user?.email || "Chưa cập nhật email";
  const userPhone = user?.phone || "Chưa cập nhật SĐT";
  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${userName}`;
  const isVerified = user?.isVerified || false;
  const ratingAvg = user?.taskerProfile?.ratingAverage ? user.taskerProfile.ratingAverage.toFixed(1) : "5.0";

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Main Profile Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header Title */}
        <View className="px-4 pt-3 pb-1">
          <Text className="text-2xl font-extrabold text-slate-900">Tài khoản</Text>
        </View>

        {/* Profile Card Header (Bento Style) */}
        <View className="bg-white rounded-3xl p-5 mx-4 mt-2 border border-slate-100 shadow-sm">
          {isLoading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="small" color="#3525CD" />
              <Text className="text-xs text-slate-400 mt-2">Đang tải thông tin tài khoản...</Text>
            </View>
          ) : (
            <>
              <View className="flex-row items-center">
                <View className="relative">
                  <Image
                    source={{ uri: avatarUrl }}
                    className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200"
                  />
                  {isVerified && (
                    <View className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5 border-2 border-white">
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View className="flex-1 ml-3.5">
                  <Text className="text-lg font-bold text-slate-900">{userName}</Text>
                  <View className="flex-row items-center mt-1">
                    <Mail size={13} color="#64748B" />
                    <Text className="text-xs text-slate-500 ml-1" numberOfLines={1}>
                      {userEmail}
                    </Text>
                  </View>
                  {userPhone !== "Chưa cập nhật SĐT" && (
                    <View className="flex-row items-center mt-0.5">
                      <Phone size={12} color="#64748B" />
                      <Text className="text-[11px] text-slate-400 ml-1">
                        {userPhone}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => Alert.alert("Thông tin", "Chức năng chỉnh sửa thông tin đang được cập nhật.")}
                  className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Pencil size={16} color="#3525CD" />
                </TouchableOpacity>
              </View>

              {/* Sub Stats Row Grid */}
              <View className="flex-row mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 rounded-2xl p-3">
                <View className="flex-1 items-center border-r border-slate-200">
                  <Text className="text-xl font-extrabold text-slate-900">{taskCount}</Text>
                  <Text className="text-xs text-slate-500 font-medium mt-0.5">Công việc</Text>
                </View>

                <View className="flex-1 items-center">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xl font-extrabold text-slate-900">{ratingAvg}</Text>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  </View>
                  <Text className="text-xs text-slate-500 font-medium mt-0.5">Đánh giá</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Section 1: Tài Khoản */}
        <Text className="text-xs font-bold text-slate-400 px-4 mt-6 mb-2 tracking-wider uppercase">QUẢN LÝ</Text>
        <View className="bg-white rounded-2xl mx-4 overflow-hidden border border-slate-100 shadow-sm">
          {menuSection1.map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleMenuItemPress(item.id)}
                className={`flex-row items-center justify-between p-4 ${
                  idx > 0 ? "border-t border-slate-100" : ""
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-xl bg-indigo-50 items-center justify-center">
                    <ItemIcon size={18} color="#3525CD" />
                  </View>
                  <Text className="text-sm font-bold text-slate-800">{item.label}</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 2: Khác */}
        <Text className="text-xs font-bold text-slate-400 px-4 mt-6 mb-2 tracking-wider uppercase">KHÁC</Text>
        <View className="bg-white rounded-2xl mx-4 overflow-hidden border border-slate-100 shadow-sm">
          {menuSection2.map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleMenuItemPress(item.id)}
                className={`flex-row items-center justify-between p-4 ${
                  idx > 0 ? "border-t border-slate-100" : ""
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-xl bg-indigo-50 items-center justify-center">
                    <ItemIcon size={18} color="#3525CD" />
                  </View>
                  <Text className="text-sm font-bold text-slate-800">{item.label}</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 bg-red-50 border border-red-100 mx-4 mt-8 py-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#EF4444" />
          <Text className="text-sm font-bold text-red-500">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
