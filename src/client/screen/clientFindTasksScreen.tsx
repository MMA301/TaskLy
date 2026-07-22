// screens/FindTasksScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants & Components
import FilterChips from "../components/FilterChips";
import TaskCard from "../components/TaskCard";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function ClientFindTasksScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const initialQuery = typeof params.query === "string" ? params.query : "";
  void params.category;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("price"); // default active price

  // Filter list
  const filters = [
    { id: "distance", label: "Khoảng cách", hasDropdown: true },
    { id: "price", label: "Giá (VND)", hasClose: true },
    { id: "rating", label: "Đánh giá", hasDropdown: true },
    { id: "type", label: "Loại hình", hasDropdown: true },
  ];

  // Sample tasks list
  const sampleTasks = [
    {
      id: 1,
      category: "Cleaning",
      title: "Deep cleaning for 2-bedroom apartment",
      description:
        "Need a thorough cleaning including windows and oven before moving out. Supplies provided.",
      distance: "1.2 km",
      rating: "4.9",
      budget: "500.000đ",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
    },
    {
      id: 2,
      category: "Delivery",
      title: "Pick up documents from District 1 to District 7",
      description:
        "Urgent document delivery required by 2 PM today. Must be reliable.",
      distance: "3.5 km",
      rating: "4.7",
      budget: "150.000đ",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
    },
    {
      id: 3,
      category: "Handyman",
      title: "Fix leaking sink pipe in kitchen",
      description:
        "Minor leak under the kitchen sink. Needs immediate repair, parts can be reimbursed.",
      distance: "0.8 km",
      rating: "5.0",
      budget: "300.000đ",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    },
  ];

  const handleFilterPress = (id: string) => {
    setActiveFilter(id);
  };

  const handleTaskPress = (task: {
    id: number;
    category: string;
    title: string;
    description: string;
    distance: string;
    rating: string;
    budget: string;
    avatarUrl: string;
  }) => {
    router.push({
      pathname: "/(tabs)/job-details",
      params: { task: JSON.stringify(task) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>Tìm Công Việc</Text>
      </View>

      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.outline}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you need help with?"
            placeholderTextColor={Colors.outlineVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Horizontal List */}
      <View style={styles.filtersSection}>
        <FilterChips
          filters={filters}
          activeFilterId={activeFilter}
          onFilterPress={handleFilterPress}
        />
      </View>

      {/* Task List Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {sampleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => handleTaskPress(task)}
          />
        ))}

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8}>
          <Text style={styles.loadMoreText}>Load More Tasks</Text>
        </TouchableOpacity>

        {/* Padding for Bottom Tabs */}
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
  titleSection: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xs,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  searchSection: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    height: 52,
    paddingHorizontal: Layout.spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
  filterButton: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.default,
  },
  filtersSection: {
    marginBottom: Layout.spacing.sm,
  },
  listContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 110,
  },
  loadMoreButton: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.default,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  loadMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 30,
  },
});
