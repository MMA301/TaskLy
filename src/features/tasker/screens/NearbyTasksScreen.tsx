import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  DimensionValue,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNearbyTasks } from '@/src/features/tasker/hooks/useNearbyTasks';
import type {
  CategoryColor,
  FilterChip,
  MapPin,
  NearbyTask,
} from '@/src/features/tasker/types/nearbyTasks.types';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

export function NearbyTasksScreen() {
  const router = useRouter();
  const {
    activeFilterKey,
    currentLocation,
    filterChips,
    isEmpty,
    isError,
    isLoading,
    isLocationDenied,
    mapPins,
    nearbyTasks,
    selectedTaskId,
    selectFilter,
    selectTask,
  } = useNearbyTasks();

  const navigatePlaceholder = (routeName: string) => {
    const routes: Record<string, string> = {
      MyAcceptedTasks: '/tasker/my-accepted',
      Notification: '/tasker/notifications',
      Notifications: '/tasker/notifications',
      TaskDetail: '/tasker/task-detail',
      TaskHistory: '/tasker/task-history',
      TaskerDashboard: '/',
      TaskerProfile: '/tasker/profile',
    };

    if (routeName === 'NearbyTasks' || routeName === 'Menu') {
      return;
    }

    const route = routes[routeName];
    if (route) {
      router.push(route as never);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.stateScreen}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.stateText}>Dang tai cong viec gan ban...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.stateScreen}>
        <Text style={styles.stateTitle}>Khong the tai danh sach cong viec gan ban.</Text>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Thu lai</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable style={styles.topIconButton} onPress={() => navigatePlaceholder('Menu')}>
          <MaterialIcons color={colors.text} name="menu" size={24} />
        </Pressable>
        <Text style={styles.logoText}>Taskly</Text>
        <View style={styles.topActions}>
          <Pressable
            style={styles.topIconButton}
            onPress={() => navigatePlaceholder('Notification')}>
            <MaterialIcons color={colors.text} name="notifications-none" size={23} />
          </Pressable>
          <Pressable
            style={styles.avatarButton}
            onPress={() => navigatePlaceholder('TaskerProfile')}>
            <Text style={styles.avatarText}>N</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapSection}>
          <View style={styles.mapGrid}>
            <View style={[styles.mapRoad, styles.mapRoadOne]} />
            <View style={[styles.mapRoad, styles.mapRoadTwo]} />
            <View style={[styles.mapRoad, styles.mapRoadThree]} />
            <View style={styles.currentLocationDot} />
            {mapPins.map((pin, index) => (
              <TaskMapPin
                key={pin.taskId}
                onPress={() => selectTask(pin.taskId)}
                pin={pin}
                position={pinPositions[index % pinPositions.length]}
              />
            ))}
          </View>
          <View style={styles.mapFade} />
          <View style={styles.locationCard}>
            <View style={styles.locationIconBox}>
              <MaterialIcons color={colors.primary} name="location-on" size={24} />
            </View>
            <View style={styles.locationCopy}>
              <Text style={styles.locationLabel}>Vi tri cua ban</Text>
              <Text style={styles.locationText}>{currentLocation.addressLabel}</Text>
            </View>
            <Pressable style={styles.myLocationButton} onPress={() => selectTask(null)}>
              <MaterialIcons color={colors.primary} name="my-location" size={22} />
            </Pressable>
          </View>
        </View>

        {isLocationDenied ? (
          <View style={styles.permissionCard}>
            <Text style={styles.emptyTitle}>Ung dung can quyen vi tri.</Text>
            <Text style={styles.emptyText}>
              MVP dang dung vi tri mock: {currentLocation.addressLabel}.
            </Text>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.filterContent}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {filterChips.map((chip) => (
            <FilterChipButton
              chip={chip}
              isActive={activeFilterKey === chip.key}
              key={chip.key}
              onPress={() => selectFilter(chip.key)}
            />
          ))}
        </ScrollView>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Cong viec gan ban ({nearbyTasks.length})</Text>
            <Pressable onPress={() => selectTask(null)}>
              <Text style={styles.viewMapText}>Xem ban do</Text>
            </Pressable>
          </View>

          {isEmpty ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Chua co cong viec gan ban.</Text>
              <Text style={styles.emptyText}>
                Hay thu mo rong khoang cach tim kiem.
              </Text>
              <Pressable style={styles.primaryButton} onPress={() => selectFilter('distance')}>
                <Text style={styles.primaryButtonText}>Mo rong khoang cach</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.taskList}>
              {nearbyTasks.map((task) => (
                <NearbyTaskCard
                  isSelected={selectedTaskId === task.id}
                  key={task.id}
                  onPress={() => {
                    selectTask(task.id);
                    navigatePlaceholder('TaskDetail');
                  }}
                  task={task}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <BottomTabItem
          icon="home"
          isActive={false}
          label="Trang chu"
          onPress={() => navigatePlaceholder('TaskerDashboard')}
        />
        <BottomTabItem
          icon="search"
          isActive
          label="Tim viec"
          onPress={() => navigatePlaceholder('NearbyTasks')}
        />
        <Pressable style={styles.centerActionButton} onPress={() => selectFilter('all')}>
          <MaterialIcons color="#ffffff" name="add" size={30} />
        </Pressable>
        <BottomTabItem
          icon="history"
          isActive={false}
          label="Lich su"
          onPress={() => navigatePlaceholder('TaskHistory')}
        />
        <BottomTabItem
          icon="person"
          isActive={false}
          label="Ca nhan"
          onPress={() => navigatePlaceholder('TaskerProfile')}
        />
      </View>
    </SafeAreaView>
  );
}

function TaskMapPin({
  onPress,
  pin,
  position,
}: {
  onPress: () => void;
  pin: MapPin;
  position: { left: DimensionValue; top: DimensionValue };
}) {
  const pinColor = getCategoryColor(pin.color);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.mapPin,
        position,
        { backgroundColor: pinColor },
        pin.isHighlighted && styles.mapPinHighlighted,
      ]}>
      <MaterialIcons
        color="#ffffff"
        name={pin.icon as keyof typeof MaterialIcons.glyphMap}
        size={18}
      />
    </Pressable>
  );
}

function FilterChipButton({
  chip,
  isActive,
  onPress,
}: {
  chip: FilterChip;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, isActive && styles.filterChipActive]}>
      <MaterialIcons
        color={isActive ? '#ffffff' : colors.surfaceText}
        name={chip.icon as keyof typeof MaterialIcons.glyphMap}
        size={18}
      />
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {chip.label}
      </Text>
    </Pressable>
  );
}

function NearbyTaskCard({
  isSelected,
  onPress,
  task,
}: {
  isSelected: boolean;
  onPress: () => void;
  task: NearbyTask;
}) {
  const categoryColor = getCategoryColor(task.categoryColor);

  return (
    <Pressable onPress={onPress} style={[styles.taskCard, isSelected && styles.taskCardSelected]}>
      <View style={[styles.categoryIconBox, { backgroundColor: `${categoryColor}18` }]}>
        <MaterialIcons
          color={categoryColor}
          name={task.categoryIcon as keyof typeof MaterialIcons.glyphMap}
          size={25}
        />
      </View>
      <View style={styles.taskContent}>
        <View style={styles.taskTopRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{task.categoryLabel}</Text>
          </View>
          <Text style={styles.taskBudget}>{formatCurrency(task.budget)}d</Text>
        </View>
        <Text numberOfLines={2} style={styles.taskTitle}>
          {task.title}
        </Text>
        <View style={styles.taskMetaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons color={colors.muted} name="near-me" size={15} />
            <Text style={styles.metaText}>{task.distanceKm}km</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons color={colors.muted} name="schedule" size={15} />
            <Text style={styles.metaText}>{task.postedTimeLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function BottomTabItem({
  icon,
  isActive,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.bottomTabItem}>
      <MaterialIcons color={isActive ? colors.primary : colors.muted} name={icon} size={24} />
      <Text style={[styles.bottomTabLabel, isActive && styles.bottomTabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function getCategoryColor(color: CategoryColor) {
  if (color === 'secondary') {
    return colors.secondary;
  }

  if (color === 'tertiary') {
    return colors.tertiary;
  }

  return colors.primary;
}

const pinPositions: { left: DimensionValue; top: DimensionValue }[] = [
  { left: '18%', top: '24%' },
  { left: '64%', top: '20%' },
  { left: '45%', top: '48%' },
  { left: '72%', top: '60%' },
];

const colors = {
  background: '#f9f9ff',
  border: '#e5e0f3',
  card: '#ffffff',
  map: '#ecebf8',
  muted: '#817c91',
  primary: '#3525cd',
  secondary: '#831ada',
  surfaceText: '#5f5a70',
  tertiary: '#00a6a6',
  text: '#201a30',
};

const styles = StyleSheet.create({
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d8ceff',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  bottomNavigation: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 78,
    justifyContent: 'space-around',
    paddingBottom: 8,
    paddingHorizontal: 6,
  },
  bottomTabItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 58,
  },
  bottomTabLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomTabLabelActive: {
    color: colors.primary,
  },
  categoryBadge: {
    backgroundColor: '#f2efff',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  categoryIconBox: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  categoryText: {
    color: colors.surfaceText,
    fontSize: 12,
    fontWeight: '800',
  },
  centerActionButton: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 4,
    height: 56,
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: colors.secondary,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    width: 56,
  },
  currentLocationDot: {
    backgroundColor: '#ffffff',
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 5,
    height: 20,
    left: '50%',
    position: 'absolute',
    top: '38%',
    width: 20,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.surfaceText,
    fontSize: 13,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterContent: {
    gap: 10,
    paddingHorizontal: 18,
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listSection: {
    gap: 14,
    paddingHorizontal: 18,
  },
  locationCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    borderWidth: 1,
    bottom: 18,
    flexDirection: 'row',
    gap: 12,
    left: 18,
    padding: 14,
    position: 'absolute',
    right: 18,
  },
  locationCopy: {
    flex: 1,
    gap: 3,
  },
  locationIconBox: {
    alignItems: 'center',
    backgroundColor: '#f0edff',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  locationLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  locationText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  logoText: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
  },
  mapFade: {
    backgroundColor: 'rgba(53,37,205,0.08)',
    bottom: 0,
    height: 126,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  mapGrid: {
    backgroundColor: colors.map,
    flex: 1,
    overflow: 'hidden',
  },
  mapPin: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 3,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    width: 40,
  },
  mapPinHighlighted: {
    height: 48,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    width: 48,
  },
  mapRoad: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    height: 18,
    opacity: 0.86,
    position: 'absolute',
    width: 460,
  },
  mapRoadOne: {
    left: -80,
    top: 94,
    transform: [{ rotate: '-24deg' }],
  },
  mapRoadThree: {
    right: -150,
    top: 240,
    transform: [{ rotate: '-38deg' }],
  },
  mapRoadTwo: {
    left: -40,
    top: 196,
    transform: [{ rotate: '28deg' }],
  },
  mapSection: {
    backgroundColor: colors.map,
    height: 397,
    overflow: 'hidden',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  myLocationButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  permissionCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    marginHorizontal: 18,
    padding: 14,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  stateScreen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: colors.muted,
    fontSize: 15,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  taskBudget: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  taskCard: {
    backgroundColor: colors.card,
    borderColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    padding: 16,
    shadowColor: '#201a30',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },
  taskCardSelected: {
    borderColor: '#d8ceff',
  },
  taskContent: {
    flex: 1,
    gap: 8,
  },
  taskList: {
    gap: 13,
  },
  taskMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 21,
  },
  taskTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  topIconButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  viewMapText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
});
