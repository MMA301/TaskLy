// screens/ProfileScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
import { clearAuthSession } from "../../session";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function ClientProfileScreen() {
  const router = useRouter();

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
    icon: ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { id: "history", label: "Lịch sử công việc", icon: "time-outline" },
    { id: "address", label: "Địa chỉ đã lưu", icon: "location-outline" },
    { id: "payment", label: "Phương thức thanh toán", icon: "card-outline" },
  ];

  const menuSection2: {
    id: string;
    label: string;
    icon: ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { id: "settings", label: "Cài đặt", icon: "settings-outline" },
    { id: "support", label: "Hỗ trợ", icon: "help-buoy-outline" },
  ];

  const handleMenuItemPress = (menuId: string) => {
    if (menuId === "history") {
      router.push("/(tabs)/tracking");
    } else if (menuId === "payment") {
      router.push("/(tabs)/checkout");
    } else {
      if (Platform.OS === "web") {
        alert(`Tính năng "${menuId}" đang được phát triển.`);
      } else {
        Alert.alert("Thông báo", `Tính năng "${menuId}" đang được phát triển.`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Main Profile Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Header (Bento Style) */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
                }}
                style={styles.avatarImage}
              />
              <View style={styles.verifiedIconBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.white}
                />
              </View>
            </View>

            <View style={styles.profileTextInfo}>
              <Text style={styles.profileName}>Nguyễn Văn A</Text>
              <Text style={styles.profileLocation}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={Colors.outline}
                />{" "}
                Hà Nội, Việt Nam
              </Text>
            </View>

            <TouchableOpacity style={styles.editBtn}>
              <Ionicons
                name="pencil-outline"
                size={18}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Sub Stats Row Grid */}
          <View style={styles.statsRowGrid}>
            <View style={styles.statCell}>
              <Text style={styles.statCellVal}>42</Text>
              <Text style={styles.statCellLabel}>Tasks Completed</Text>
            </View>

            <View style={styles.statCell}>
              <View style={styles.statCellRatingRow}>
                <Text style={styles.statCellRatingText}>4.9</Text>
                <Ionicons
                  name="star"
                  size={16}
                  color="#F59E0B"
                  style={styles.starIcon}
                />
              </View>
              <Text style={styles.statCellLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Tài Khoản */}
        <Text style={styles.sectionHeaderTitle}>TÀI KHOẢN</Text>
        <View style={styles.menuContainer}>
          {menuSection1.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleMenuItemPress(item.id)}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.outline}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 2: Khác */}
        <Text style={styles.sectionHeaderTitle}>KHÁC</Text>
        <View style={styles.menuContainer}>
          {menuSection2.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleMenuItemPress(item.id)}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.outline}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Padding under scroll content for bottom tabs */}
        <View style={styles.bottomSpacer} />
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
  profileHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "33",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: Layout.spacing.md,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  verifiedIconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  profileTextInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontWeight: "500",
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRowGrid: {
    flexDirection: "row",
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  statCell: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "15",
  },
  statCellVal: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2,
  },
  statCellLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: "500",
  },
  statCellRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  statCellRatingText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  starIcon: {
    marginLeft: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.outline,
    letterSpacing: 1,
    paddingHorizontal: Layout.spacing.md + 4,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    marginHorizontal: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "33",
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "11",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error + "33",
    borderRadius: 16,
    marginHorizontal: Layout.spacing.md,
    marginTop: Layout.spacing.xl,
    height: 52,
    gap: 8,
  },
  logoutButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 30,
  },
});
