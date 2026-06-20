import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AvatarInitial,
  ProgressBar,
  SectionTitle,
  StatusBadge,
  SurfaceCard,
} from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import type { Task } from '@/src/features/tasker/types/tasker.types';
import { acceptedTasksMock } from '@/src/mocks/tasks.mock';

const filters = ['Tat ca (8)', 'Dang thuc hien (3)', 'Sap toi (5)'];

export function MyAcceptedTasksScreen() {
  const router = useRouter();

  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="create" />}>
      <TaskerTopBar />
      <SectionTitle
        subtitle="Quan ly cac yeu cau dich vu ban da chap nhan."
        title="Cong viec cua toi"
      />
      <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter, index) => (
          <Pressable key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
            <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.grid}>
        {acceptedTasksMock.slice(0, 3).map((task) => (
          <AcceptedTaskCard key={task.id} task={task} />
        ))}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Tang thu nhap cuoi tuan!</Text>
          <Text style={styles.promoText}>
            Nhan them 200k khi hoan thanh 5 don hang trong 2 ngay Thu 7 va CN.
          </Text>
          <Pressable style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Dang ky ngay</Text>
          </Pressable>
        </View>
        {acceptedTasksMock.slice(3).map((task) => (
          <AcceptedTaskCard key={task.id} task={task} compact />
        ))}
      </View>
      <Pressable style={styles.fab} onPress={() => router.push('/explore')}>
        <MaterialIcons color={taskerColors.white} name="add" size={32} />
      </Pressable>
    </TaskerLayout>
  );
}

function AcceptedTaskCard({ compact, task }: { compact?: boolean; task: Task }) {
  const router = useRouter();
  const isActive = task.status === 'In Progress';

  return (
    <SurfaceCard>
      <View style={styles.cardHeader}>
        <StatusBadge label={isActive ? 'Dang thuc hien' : `${task.scheduledDateLabel} - ${task.scheduledTime}`} tone={isActive ? 'secondary' : 'muted'} />
        <Text style={styles.budget}>{formatCurrency(task.totalEarning)}d</Text>
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <View style={styles.metaRow}>
        <MaterialIcons color={taskerColors.muted} name={task.categoryIcon as keyof typeof MaterialIcons.glyphMap} size={17} />
        <Text style={styles.metaText}>{compact ? task.address : `${task.distanceKm} km - ${task.address}`}</Text>
      </View>
      {!compact ? (
        <>
          <View style={styles.progressBlock}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.metaText}>{isActive ? 'Tien do cong viec' : 'Sap dien ra'}</Text>
              <Text style={styles.progressValue}>{task.progress ?? 0}%</Text>
            </View>
            <ProgressBar progress={task.progress ?? 0} />
          </View>
          <View style={styles.customerFooter}>
            <View style={styles.customerInfo}>
              <AvatarInitial initials={task.customer.avatarInitials} />
              <View>
                <Text style={styles.customerName}>{task.customer.fullName}</Text>
                <Text style={styles.metaText}>{task.customer.label ?? `${task.customer.ratingAverage} sao`}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <IconAction icon="chat" onPress={() => router.push('/tasker/messages')} />
              <IconAction icon="call" />
              <IconAction icon="chevron-right" onPress={() => router.push('/tasker/task-detail')} />
            </View>
          </View>
        </>
      ) : (
        <Pressable onPress={() => router.push('/tasker/task-detail')} style={styles.manageButton}>
          <Text style={styles.manageText}>Quan ly</Text>
          <MaterialIcons color={taskerColors.primary} name="arrow-forward" size={16} />
        </Pressable>
      )}
    </SurfaceCard>
  );
}

function IconAction({ icon, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.iconAction}>
      <MaterialIcons color={taskerColors.primary} name={icon} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8 },
  budget: { color: taskerColors.primary, fontSize: 18, fontWeight: '900' },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  customerFooter: { alignItems: 'center', borderTopColor: taskerColors.surfaceContainerHigh, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14 },
  customerInfo: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  customerName: { color: taskerColors.text, fontSize: 14, fontWeight: '900' },
  fab: { alignItems: 'center', backgroundColor: taskerColors.secondary, borderRadius: 28, bottom: 96, height: 56, justifyContent: 'center', position: 'absolute', right: 18, width: 56 },
  filterChip: { backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  filterChipActive: { backgroundColor: taskerColors.primary },
  filterRow: { gap: 8 },
  filterText: { color: taskerColors.primary, fontSize: 14, fontWeight: '800' },
  filterTextActive: { color: taskerColors.white },
  grid: { gap: 14 },
  iconAction: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerLow, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  manageButton: { alignItems: 'center', alignSelf: 'flex-end', flexDirection: 'row', gap: 4, marginTop: 16 },
  manageText: { color: taskerColors.primary, fontSize: 14, fontWeight: '900' },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 8 },
  metaText: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  progressBlock: { gap: 8, marginTop: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressValue: { color: taskerColors.primary, fontSize: 12, fontWeight: '900' },
  promoButton: { alignSelf: 'flex-start', backgroundColor: taskerColors.white, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  promoButtonText: { color: taskerColors.primary, fontWeight: '900' },
  promoCard: { backgroundColor: taskerColors.primaryContainer, borderRadius: 22, gap: 12, padding: 22 },
  promoText: { color: taskerColors.white, fontSize: 14, lineHeight: 20, opacity: 0.9 },
  promoTitle: { color: taskerColors.white, fontSize: 23, fontWeight: '900' },
  taskTitle: { color: taskerColors.text, fontSize: 21, fontWeight: '900', lineHeight: 27, marginTop: 10 },
});
