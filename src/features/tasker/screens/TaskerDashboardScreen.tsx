import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { useTaskerDashboard } from '@/src/features/tasker/hooks/useTaskerDashboard';
import type {
  BottomNavigationItem,
  PerformanceItem,
  UpcomingTask,
} from '@/src/features/tasker/types/taskerDashboard.types';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

export function TaskerDashboardScreen() {
  const router = useRouter();
  const {
    bottomNavigation,
    isEmpty,
    isError,
    isLoading,
    performance,
    selectedPeriod,
    setSelectedPeriod,
    summary,
    toggleOnlineStatus,
    upcomingTasks,
  } = useTaskerDashboard();

  const navigatePlaceholder = (routeName: string) => {
    const routes: Record<string, string> = {
      EarningsDashboard: '/tasker/earnings',
      MyAcceptedTasks: '/tasker/my-accepted',
      NearbyTasks: '/explore',
      Notification: '/tasker/notifications',
      Notifications: '/tasker/notifications',
      TaskDetail: '/tasker/task-detail',
      TaskHistory: '/tasker/task-history',
      TaskerProfile: '/tasker/profile',
    };

    if (routeName === 'TaskerDashboard' || routeName === 'Menu') {
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
        <Text style={styles.stateText}>Dang tai du lieu dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.stateScreen}>
        <Text style={styles.stateTitle}>Khong the tai du lieu dashboard.</Text>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Thu lai</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => navigatePlaceholder('Menu')}>
            <MaterialIcons color={colors.text} name="menu" size={24} />
          </Pressable>
          <Text style={styles.logoText}>Taskly</Text>
          <Pressable
            style={styles.avatarButton}
            onPress={() => navigatePlaceholder('TaskerProfile')}>
            <Text style={styles.avatarText}>{summary.taskerName.charAt(0)}</Text>
          </Pressable>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>{summary.greetingMessage}</Text>
          <Text style={styles.greetingSubtitle}>
            Hom nay ban co {summary.todayTaskCount} cong viec moi can hoan thanh.
          </Text>
        </View>

        <Pressable
          style={styles.earningsCard}
          onPress={() => navigatePlaceholder('EarningsDashboard')}>
          <View>
            <Text style={styles.cardLabel}>Thu nhap hom nay</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(summary.todayEarnings)}d</Text>
            <View style={styles.trendRow}>
              <MaterialIcons color={colors.success} name="trending-up" size={18} />
              <Text style={styles.trendText}>+{summary.earningsChangePercent}% so voi hom qua</Text>
            </View>
          </View>
          <View style={styles.earningsIcon}>
            <MaterialIcons color={colors.primary} name="payments" size={28} />
          </View>
        </Pressable>

        <View style={styles.statsGrid}>
          <StatCard
            icon="check-circle"
            label="Da hoan thanh"
            value={summary.completedTaskCount.toString()}
          />
          <StatCard icon="verified" label="Ty le thanh cong" value={`${summary.successRate}%`} />
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusCopy}>
            <View style={styles.statusTitleRow}>
              <View
                style={[
                  styles.statusDot,
                  summary.isOnline ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
              <Text style={styles.statusTitle}>
                {summary.isOnline ? 'Truc tuyen' : 'Ngoai tuyen'}
              </Text>
            </View>
            <Text style={styles.statusDescription}>
              {summary.isOnline
                ? 'Ban dang san sang nhan task moi.'
                : 'He thong se khong goi y task moi khi ban ngoai tuyen.'}
            </Text>
          </View>
          <Switch
            onValueChange={toggleOnlineStatus}
            thumbColor="#ffffff"
            trackColor={{ false: '#cbd5e1', true: colors.primarySoft }}
            value={summary.isOnline}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bieu do hieu suat</Text>
            <View style={styles.filterTabs}>
              <FilterTab
                isActive={selectedPeriod === 'week'}
                label="Tuan nay"
                onPress={() => setSelectedPeriod('week')}
              />
              <FilterTab
                isActive={selectedPeriod === 'month'}
                label="Thang nay"
                onPress={() => setSelectedPeriod('month')}
              />
            </View>
          </View>
          <PerformanceChart items={performance.items} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cong viec sap toi</Text>
            <Pressable onPress={() => navigatePlaceholder('MyAcceptedTasks')}>
              <Text style={styles.viewAllText}>Xem tat ca</Text>
            </Pressable>
          </View>
          {isEmpty ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Ban chua co cong viec sap toi.</Text>
              <Text style={styles.emptyText}>
                Hay tim task gan ban de bat dau kiem thu nhap.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() => navigatePlaceholder('NearbyTasks')}>
                <Text style={styles.primaryButtonText}>Tim task gan day</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.taskList}>
              {upcomingTasks.map((task) => (
                <UpcomingTaskCard
                  key={task.id}
                  task={task}
                  onPress={() => navigatePlaceholder('TaskDetail')}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        {bottomNavigation.map((item) => (
          <BottomTabItem
            item={item}
            key={item.key}
            onPress={() => navigatePlaceholder(item.routeName)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialIcons color={colors.primary} name={icon} size={22} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function FilterTab({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterTab, isActive && styles.filterTabActive]}>
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

function PerformanceChart({ items }: { items: PerformanceItem[] }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <View style={styles.chart}>
      {items.map((item) => {
        const heightPercent = Math.max((item.value / maxValue) * 100, item.value > 0 ? 12 : 4);

        return (
          <View key={item.label} style={styles.chartItem}>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartBar,
                  { height: `${heightPercent}%` },
                  item.isCurrentDay && styles.chartBarActive,
                ]}
              />
            </View>
            <Text style={[styles.chartLabel, item.isCurrentDay && styles.chartLabelActive]}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function UpcomingTaskCard({ onPress, task }: { onPress: () => void; task: UpcomingTask }) {
  return (
    <Pressable onPress={onPress} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>
        <Text style={styles.taskBudget}>{formatCurrency(task.budget)}d</Text>
      </View>
      <Text numberOfLines={2} style={styles.taskTitle}>
        {task.title}
      </Text>
      <View style={styles.taskMetaRow}>
        <View style={styles.metaItem}>
          <MaterialIcons color={colors.muted} name="schedule" size={16} />
          <Text style={styles.metaText}>
            {task.scheduledTime}, {task.scheduledDateLabel}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialIcons color={colors.muted} name="place" size={16} />
          <Text style={styles.metaText}>{task.distanceKm}km</Text>
        </View>
      </View>
    </Pressable>
  );
}

function BottomTabItem({
  item,
  onPress,
}: {
  item: BottomNavigationItem;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.bottomTabItem}>
      <MaterialIcons
        color={item.isActive ? colors.primary : colors.muted}
        name={item.icon as keyof typeof MaterialIcons.glyphMap}
        size={24}
      />
      <Text style={[styles.bottomTabLabel, item.isActive && styles.bottomTabLabelActive]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const colors = {
  background: '#f7f8fb',
  border: '#e5e9f0',
  card: '#ffffff',
  muted: '#7c8798',
  primary: '#246bfe',
  primarySoft: '#7aa7ff',
  success: '#17a65b',
  successSoft: '#e8f7ef',
  text: '#172033',
};

const styles = StyleSheet.create({
  avatarButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomNavigation: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-around',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  bottomTabItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 54,
  },
  bottomTabLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomTabLabelActive: {
    color: colors.primary,
  },
  cardLabel: {
    color: '#d9e4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#eef4ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  chart: {
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 190,
    justifyContent: 'space-between',
    padding: 16,
  },
  chartBar: {
    backgroundColor: '#c8d8ff',
    borderRadius: 8,
    width: '100%',
  },
  chartBarActive: {
    backgroundColor: colors.primary,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    minHeight: 16,
  },
  chartLabelActive: {
    color: colors.primary,
  },
  chartTrack: {
    alignItems: 'flex-end',
    backgroundColor: '#f1f4f9',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%',
  },
  earningsAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  earningsCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  earningsIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  emptyCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
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
    fontWeight: '800',
  },
  filterTab: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabs: {
    backgroundColor: '#eef1f6',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
  },
  filterText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  greetingSection: {
    gap: 6,
  },
  greetingSubtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  greetingTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  logoText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    gap: 18,
    padding: 20,
    paddingBottom: 26,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    gap: 16,
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
    fontWeight: '800',
    textAlign: 'center',
  },
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 124,
    padding: 16,
  },
  statIcon: {
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusCopy: {
    flex: 1,
    gap: 6,
    paddingRight: 12,
  },
  statusDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusDotOffline: {
    backgroundColor: '#94a3b8',
  },
  statusDotOnline: {
    backgroundColor: colors.success,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  statusTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  taskBudget: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  taskCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  taskHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskList: {
    gap: 12,
  },
  taskMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
  },
  trendText: {
    color: '#e7efff',
    fontSize: 13,
    fontWeight: '700',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
