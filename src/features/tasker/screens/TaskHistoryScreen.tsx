import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AmountText, SectionTitle, StatusBadge, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import type { Task } from '@/src/features/tasker/types/tasker.types';
import { taskHistoryMock } from '@/src/mocks/tasks.mock';

const historyFilters = ['Tat ca', 'Thang 10', 'Thang 09', 'Thang 08'];

export function TaskHistoryScreen() {
  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="history" />}>
      <TaskerTopBar
        rightContent={<MaterialIcons color={taskerColors.muted} name="search" size={24} />}
      />
      <SectionTitle
        subtitle="Theo doi thu nhap va cac yeu cau da thuc hien cua ban."
        title="Lich su cong viec"
      />
      <View style={styles.summaryGrid}>
        <SurfaceCard style={styles.earningsCard}>
          <Text style={styles.summaryLabel}>Tong thu nhap thang 10</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(15420000)}d</Text>
          <View style={styles.trendPill}>
            <MaterialIcons color={taskerColors.success} name="trending-up" size={16} />
            <Text style={styles.trendText}>+12.5% so voi thang truoc</Text>
          </View>
        </SurfaceCard>
        <SurfaceCard>
          <Text style={styles.summaryLabel}>Cong viec hoan thanh</Text>
          <View style={styles.completedRow}>
            <Text style={styles.completedValue}>42</Text>
            <View style={styles.iconBox}>
              <MaterialIcons color={taskerColors.secondary} name="task-alt" size={26} />
            </View>
          </View>
        </SurfaceCard>
      </View>
      <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
        {historyFilters.map((filter, index) => (
          <Pressable key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
            <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.searchBox}>
        <MaterialIcons color={taskerColors.outline} name="search" size={20} />
        <TextInput placeholder="Tim kiem cong viec..." placeholderTextColor={taskerColors.outline} style={styles.searchInput} />
      </View>
      <View style={styles.historyList}>
        {taskHistoryMock.map((task) => (
          <HistoryItem key={task.id} task={task} />
        ))}
      </View>
      <Pressable style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Xem them cong viec</Text>
        <MaterialIcons color={taskerColors.primary} name="expand-more" size={20} />
      </Pressable>
    </TaskerLayout>
  );
}

function HistoryItem({ task }: { task: Task }) {
  const router = useRouter();
  const statusTone = task.status === 'Completed' ? 'success' : task.status === 'Cancelled' ? 'error' : 'muted';

  return (
    <Pressable onPress={() => router.push('/tasker/task-detail')} style={styles.historyItem}>
      <View style={styles.historyMain}>
        <View style={[styles.historyIcon, task.status === 'Cancelled' && styles.historyIconError]}>
          <MaterialIcons
            color={task.status === 'Cancelled' ? taskerColors.error : taskerColors.primary}
            name={task.categoryIcon as keyof typeof MaterialIcons.glyphMap}
            size={24}
          />
        </View>
        <View style={styles.historyText}>
          <Text style={styles.historyTitle}>{task.title}</Text>
          <View style={styles.historyMeta}>
            <MaterialIcons color={taskerColors.muted} name="calendar-today" size={14} />
            <Text style={styles.metaText}>{task.scheduledDateLabel}</Text>
            <StatusBadge label={statusLabel(task.status)} tone={statusTone} />
          </View>
        </View>
      </View>
      <View style={styles.historyAmount}>
        <AmountText amount={task.totalEarning} muted={task.status === 'Cancelled'} />
        <MaterialIcons color={taskerColors.outline} name="chevron-right" size={22} />
      </View>
    </Pressable>
  );
}

function statusLabel(status: Task['status']) {
  if (status === 'Completed') return 'Da hoan thanh';
  if (status === 'Cancelled') return 'Da huy';
  if (status === 'Disputed') return 'Dang khieu nai';
  return status;
}

const styles = StyleSheet.create({
  completedRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  completedValue: { color: taskerColors.secondary, fontSize: 32, fontWeight: '900' },
  earningsCard: { flex: 2 },
  filterChip: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  filterChipActive: { backgroundColor: taskerColors.primary },
  filterRow: { gap: 8 },
  filterText: { color: taskerColors.muted, fontSize: 14, fontWeight: '800' },
  filterTextActive: { color: taskerColors.white },
  historyAmount: { alignItems: 'flex-end', gap: 4 },
  historyIcon: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  historyIconError: { backgroundColor: taskerColors.errorContainer },
  historyItem: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.82)', borderLeftColor: taskerColors.success, borderLeftWidth: 4, borderRadius: 18, flexDirection: 'row', gap: 10, justifyContent: 'space-between', padding: 14 },
  historyList: { gap: 12 },
  historyMain: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 12 },
  historyMeta: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 5 },
  historyText: { flex: 1 },
  historyTitle: { color: taskerColors.text, fontSize: 16, fontWeight: '900' },
  iconBox: { alignItems: 'center', backgroundColor: taskerColors.secondaryFixed, borderRadius: 12, height: 44, justifyContent: 'center', width: 44 },
  loadMoreButton: { alignItems: 'center', alignSelf: 'center', borderColor: taskerColors.primary, borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 18, paddingVertical: 12 },
  loadMoreText: { color: taskerColors.primary, fontWeight: '900' },
  metaText: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  searchBox: { alignItems: 'center', backgroundColor: taskerColors.card, borderColor: taskerColors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 8, paddingHorizontal: 14 },
  searchInput: { color: taskerColors.text, flex: 1, height: 46, fontSize: 15 },
  summaryAmount: { color: taskerColors.primary, fontSize: 28, fontWeight: '900', marginTop: 8 },
  summaryGrid: { gap: 14 },
  summaryLabel: { color: taskerColors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  trendPill: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#f0fdf4', borderRadius: 10, flexDirection: 'row', gap: 4, marginTop: 14, paddingHorizontal: 8, paddingVertical: 4 },
  trendText: { color: taskerColors.success, fontSize: 12, fontWeight: '800' },
});
