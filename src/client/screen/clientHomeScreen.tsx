import { router, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Sparkles,
  Grid,
  ArrowLeft,
  Wallet,
  Award,
  ChevronRight,
  Paintbrush,
  Truck,
  Wrench,
  ShoppingCart,
  Shirt,
  Clock,
  X,
  LucideIcon,
} from "lucide-react-native";

// Components & Services
import Header from "../components/Header";
import TaskerCard from "../components/TaskerCard";
import { categoryApi, taskApi, userApi, walletApi } from "../../../service/api";
import { setSelectedTaskId } from "../../session";

export default function ClientHomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fullscreen All Services Modal State
  const [allServicesModalOpen, setAllServicesModalOpen] = useState(false);
  const [allServicesFilter, setAllServicesFilter] = useState("");

  const fetchWallet = useCallback(() => {
    walletApi.getWallet()
      .then((res: any) => {
        const wData = res?.data || res;
        if (wData) {
          setWallet(wData);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật số dư ví ở trang chủ:", err);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWallet();
    }, [fetchWallet])
  );

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      userApi.getProfile(),
      categoryApi.getCategories(),
      taskApi.getTasks(),
      walletApi.getWallet(),
    ])
      .then(([userRes, catRes, taskRes, walletRes]) => {
        if (!isMounted) return;

        if (userRes.status === "fulfilled") {
          const uData = userRes.value?.data || userRes.value;
          setUser(uData);
        }

        if (catRes.status === "fulfilled") {
          const cData = Array.isArray(catRes.value)
            ? catRes.value
            : catRes.value?.data || [];
          setCategories(cData);
        }

        if (taskRes.status === "fulfilled") {
          const tData = Array.isArray(taskRes.value)
            ? taskRes.value
            : taskRes.value?.data || [];
          const active = tData.filter(
            (t: any) => t.status === "open" || t.status === "in_progress"
          );
          setActiveTasks(active);
        }

        if (walletRes.status === "fulfilled") {
          const wData = walletRes.value?.data || walletRes.value;
          setWallet(wData);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (name: string): LucideIcon => {
    const n = (name || "").toLowerCase();
    if (n.includes("dọn") || n.includes("sạch")) return Paintbrush;
    if (n.includes("chuyển") || n.includes("đồ")) return Truck;
    if (n.includes("lắp") || n.includes("bàn") || n.includes("sửa")) return Wrench;
    if (n.includes("mua")) return ShoppingCart;
    if (n.includes("giặt")) return Shirt;
    return Clock;
  };

  // Sample Featured Taskers
  const featuredTaskers = [
    {
      id: 1,
      name: "Minh Châu",
      rating: "4.9",
      jobsCount: "120",
      skills: ["Dọn dẹp", "Nấu ăn"],
      hourlyRate: "80.000đ",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Hoàng Nam",
      rating: "5.0",
      jobsCount: "85",
      skills: ["Lắp ráp", "Sửa chữa"],
      hourlyRate: "150.000đ",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop",
    },
  ];

  const handleSearch = () => {
    router.push({ pathname: "/(tabs)/search", params: { query: searchQuery } });
  };

  const handleServiceSelect = (cat: any) => {
    const catId = typeof cat === "object" ? (cat._id || cat.id) : cat;
    const catName = typeof cat === "object" ? cat.name : "";
    router.push({
      pathname: "/(tabs)/create",
      params: {
        categoryId: catId,
        taskName: catName ? `${catName}` : "",
      },
    });
  };

  const handleBookNow = (tasker: { name: string; hourlyRate: string }) => {
    router.push({
      pathname: "/(tabs)/create",
      params: {
        taskName: `Yêu cầu dịch vụ với ${tasker.name}`,
        rate: tasker.hourlyRate,
      },
    });
  };

  const headerTitle = user?.fullName ? `Chào, ${user.fullName.split(" ").pop()}` : "Taskly";
  const walletBalance =
    typeof wallet?.balance === "number"
      ? wallet.balance
      : typeof wallet?.data?.balance === "number"
      ? wallet.data.balance
      : 0;
  const [bPoints] = useState<number>(350);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <Header
        title={headerTitle}
        onProfilePress={() => router.push("/(tabs)/profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Wallet Balance Card under Header Greeting */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/wallet")}
          className="bg-white mx-4 mt-2 mb-3 rounded-2xl p-3.5 border border-indigo-100 shadow-sm"
        >
          <Text className="text-xs font-medium text-slate-500 mb-2.5">
            Khám phá và trải nghiệm dịch vụ tiện ích ngay hôm nay.
          </Text>

          <View className="h-[1px] bg-slate-100 mb-2.5" />

          <View className="flex-row items-center">
            {/* Wallet Balance (Left Half) */}
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between pr-2.5"
              onPress={() => router.push("/(tabs)/wallet")}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-7 h-7 rounded-full bg-amber-100 items-center justify-center">
                  <Wallet size={15} color="#D97706" />
                </View>
                <Text className="text-sm font-extrabold text-slate-900">
                  {walletBalance.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Vertical Divider */}
            <View className="w-[1px] h-6 bg-slate-200" />

            {/* bPoints Badge (Right Half) */}
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between pl-2.5"
              onPress={() => router.push("/(tabs)/wallet")}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-7 h-7 rounded-full bg-indigo-100 items-center justify-center">
                  <Award size={15} color="#3525CD" />
                </View>
                <Text className="text-sm font-extrabold text-slate-900">
                  {bPoints} bPoints
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Dynamic Service Grid (bTaskee style, 4 columns, max 8 items) */}
        <View className="bg-white mx-4 my-2 rounded-2xl p-4 border border-slate-100 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-extrabold text-slate-900">Dịch vụ cho bạn</Text>
            <TouchableOpacity
              onPress={() => setAllServicesModalOpen(true)}
              className="flex-row items-center"
            >
              <Text className="text-xs font-bold text-indigo-600 mr-0.5">Xem tất cả</Text>
              <ChevronRight size={14} color="#3525CD" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color="#3525CD" />
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.slice(0, categories.length > 8 ? 7 : 8).map((cat) => {
                const IconComp = getCategoryIcon(cat.name);
                return (
                  <TouchableOpacity
                    key={cat._id || cat.id}
                    onPress={() => handleServiceSelect(cat)}
                    className="w-[22%] items-center mb-4"
                    activeOpacity={0.7}
                  >
                    <View className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl items-center justify-center mb-1.5 shadow-xs">
                      <IconComp size={24} color="#3525CD" />
                    </View>
                    <Text
                      className="text-xs font-semibold text-slate-800 text-center"
                      numberOfLines={2}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {categories.length > 8 && (
                <TouchableOpacity
                  onPress={() => setAllServicesModalOpen(true)}
                  className="w-[22%] items-center mb-4"
                  activeOpacity={0.7}
                >
                  <View className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl items-center justify-center mb-1.5">
                    <Grid size={24} color="#3525CD" />
                  </View>
                  <Text className="text-xs font-bold text-indigo-600 text-center">
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Promo / Hot Offer Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setAllServicesModalOpen(true)}
          className="mx-4 my-2 rounded-2xl overflow-hidden bg-indigo-600 p-4 shadow-md shadow-indigo-200 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <View className="bg-white/20 self-start px-2 py-0.5 rounded-full mb-1.5">
              <Text className="text-[10px] font-extrabold text-white uppercase tracking-wider">ƯU ĐÃI ĐẶC BIỆT</Text>
            </View>
            <Text className="text-white text-base font-extrabold mb-1">
              Giảm ngay 20% đơn đầu tiên
            </Text>
            <Text className="text-indigo-100 text-xs font-medium">
              Nhập mã TASKLY20 khi tạo việc dọn dẹp hoặc mua hộ.
            </Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
            <Sparkles size={26} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Active Tasks Section */}
        {activeTasks.length > 0 && (
          <View className="mx-4 my-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-extrabold text-slate-900">
                Công việc đang chạy ({activeTasks.length})
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/tracking")}>
                <Text className="text-xs font-bold text-indigo-600">Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            {activeTasks.map((t) => (
              <TouchableOpacity
                key={t._id || t.id}
                onPress={() => {
                  setSelectedTaskId(t._id || t.id);
                  router.push("/(tabs)/tracking");
                }}
                className="bg-white rounded-2xl p-4 mb-2.5 border border-indigo-100 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-extrabold text-amber-800 uppercase">
                        {t.status === "open" ? "Đang tìm Tasker" : "Đang thực hiện"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-slate-900 mb-0.5" numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Text className="text-xs text-slate-500" numberOfLines={1}>
                    📍 {t.address}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-extrabold text-indigo-600">
                    {typeof t.price === "number" ? t.price.toLocaleString("vi-VN") + "đ" : t.price}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" className="mt-1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Featured Taskers Row */}
        <View className="mx-4 my-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-extrabold text-slate-900">Đối tác nổi bật</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
              <Text className="text-xs font-bold text-indigo-600">Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-3 py-1"
          >
            {featuredTaskers.map((tasker) => (
              <TaskerCard
                key={tasker.id}
                tasker={tasker}
                onBookPress={() => handleBookNow(tasker)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fullscreen All Services Modal */}
      <Modal
        visible={allServicesModalOpen}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setAllServicesModalOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Modal Top Header with Back Arrow */}
          <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
            <TouchableOpacity
              onPress={() => setAllServicesModalOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F172A" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-slate-900">Tất cả dịch vụ</Text>
              <Text className="text-xs text-slate-500">Chọn dịch vụ bạn cần trợ giúp</Text>
            </View>
          </View>

          {/* Modal Search Bar */}
          <View className="px-4 py-3 bg-slate-50">
            <View className="flex-row items-center bg-white px-3.5 h-11 rounded-xl border border-slate-200">
              <Search size={18} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-2.5 text-sm text-slate-900 font-medium"
                placeholder="Tìm kiếm dịch vụ..."
                placeholderTextColor="#94A3B8"
                value={allServicesFilter}
                onChangeText={setAllServicesFilter}
              />
              {allServicesFilter.length > 0 && (
                <TouchableOpacity onPress={() => setAllServicesFilter("")}>
                  <X size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Modal Services Grid */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          >
            <View className="flex-row flex-wrap justify-between">
              {categories
                .filter((cat) =>
                  cat.name.toLowerCase().includes(allServicesFilter.toLowerCase())
                )
                .map((cat) => {
                  const IconComp = getCategoryIcon(cat.name);
                  return (
                    <TouchableOpacity
                      key={cat._id || cat.id}
                      onPress={() => {
                        setAllServicesModalOpen(false);
                        handleServiceSelect(cat);
                      }}
                      className="w-[48%] bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-xs flex-row items-center"
                      activeOpacity={0.75}
                    >
                      <View className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl items-center justify-center mr-3">
                        <IconComp size={22} color="#3525CD" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-slate-900" numberOfLines={2}>
                          {cat.name}
                        </Text>
                        <Text className="text-[10px] text-slate-400 mt-0.5" numberOfLines={1}>
                          {cat.description || "Dịch vụ TaskLy"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
