// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Constants & Components
import Header from "../components/Header";
import TaskerCard from "../components/TaskerCard";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function ClientHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Discover Services list
  const services: {
    id: string;
    name: string;
    icon: ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { id: "clean", name: "Dọn dẹp", icon: "brush-outline" },
    { id: "move", name: "Chuyển nhà", icon: "bus-outline" },
    { id: "assemble", name: "Lắp ráp nội thất", icon: "construct-outline" },
    { id: "deliver", name: "Giao hàng", icon: "cube-outline" },
    { id: "shop", name: "Đi chợ hộ", icon: "cart-outline" },
    { id: "hourly", name: "Hỗ trợ theo giờ", icon: "time-outline" },
  ];

  const handleSearch = () => {
    router.push({ pathname: "/(tabs)/search", params: { query: searchQuery } });
  };

  const handleServiceSelect = (serviceId: string) => {
    router.push({
      pathname: "/(tabs)/search",
      params: { category: serviceId },
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Header
        title="Taskly"
        onProfilePress={() => router.push("/(tabs)/profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.onSurfaceVariant}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm dịch vụ..."
              placeholderTextColor={Colors.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>

        {/* Hero Promotional Banner */}
        <TouchableOpacity
          style={styles.heroBanner}
          activeOpacity={0.95}
          onPress={() => handleServiceSelect("clean")}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroTextContainer}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Ưu đãi đặc biệt</Text>
            </View>
            <Text style={styles.heroTitle}>
              Giảm 20% cho dịch vụ Dọn dẹp phòng
            </Text>
            <Text style={styles.heroSubtitle}>
              Đặt ngay hôm nay, không gian sạch sẽ đón cuối tuần.
            </Text>
          </View>
          <Ionicons
            name="sparkles"
            size={120}
            color={Colors.white + "1c"}
            style={styles.heroDecoIcon}
          />
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khám phá dịch vụ</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceButton}
              activeOpacity={0.7}
              onPress={() => handleServiceSelect(service.id)}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons
                  name={service.icon}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.serviceText} numberOfLines={2}>
                {service.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Taskers Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Taskers nổi bật gần bạn</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.taskersScroll}
        >
          {featuredTaskers.map((tasker) => (
            <TaskerCard
              key={tasker.id}
              tasker={tasker}
              onBookPress={() => handleBookNow(tasker)}
            />
          ))}
        </ScrollView>

        {/* Extra spacing at bottom for tab bar padding */}
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
    paddingBottom: 90,
  },
  searchContainer: {
    padding: Layout.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    height: 48,
    paddingHorizontal: Layout.spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    height: "100%",
  },
  heroBanner: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Colors.primary,
    padding: Layout.spacing.lg,
    minHeight: 160,
    justifyContent: "center",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  heroTextContainer: {
    zIndex: 2,
    width: "75%",
  },
  promoBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
    alignSelf: "flex-start",
    marginBottom: Layout.spacing.sm,
  },
  promoBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.white + "d0",
    lineHeight: 18,
  },
  heroDecoIcon: {
    position: "absolute",
    bottom: -20,
    right: -20,
    transform: [{ rotate: "-12deg" }],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.primary,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Layout.spacing.md,
    justifyContent: "space-between",
    gap: 12,
    marginBottom: Layout.spacing.lg,
  },
  serviceButton: {
    width: "30%",
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: "transparent",
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.spacing.sm,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.onSurface,
    textAlign: "center",
    lineHeight: 16,
  },
  taskersScroll: {
    paddingLeft: Layout.spacing.md,
    paddingRight: Layout.spacing.sm,
    paddingBottom: Layout.spacing.sm,
  },
});
