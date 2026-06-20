import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionTitle, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import type { TaskerNotification } from '@/src/features/tasker/types/tasker.types';
import { notificationsMock } from '@/src/mocks/notifications.mock';

const filters = ['Tat ca', 'Cong viec', 'Thanh toan', 'Tin nhan'];

export function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('Tat ca');
  const [readIds, setReadIds] = useState<string[]>(notificationsMock.filter((item) => item.isRead).map((item) => item.id));
  const visibleNotifications =
    activeFilter === 'Tat ca'
      ? notificationsMock
      : notificationsMock.filter((item) => filterToType(activeFilter) === item.type);

  const markAllRead = () => setReadIds(notificationsMock.map((item) => item.id));

  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="notifications" />}>
      <TaskerTopBar
        rightContent={
          <Pressable onPress={markAllRead}>
            <Text style={styles.markRead}>Danh dau da doc</Text>
          </Pressable>
        }
      />
      <SectionTitle
        subtitle="Cap nhat nhung hoat dong moi nhat cua ban"
        title="Thong bao"
      />
      <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {visibleNotifications.length === 0 ? (
        <SurfaceCard style={styles.emptyCard}>
          <MaterialIcons color={taskerColors.primary} name="notifications-off" size={42} />
          <Text style={styles.emptyTitle}>Moi thu deu yen tinh</Text>
          <Text style={styles.emptyText}>Ban chua co thong bao moi nao. Hay quay lai sau nhe.</Text>
        </SurfaceCard>
      ) : (
        <View style={styles.groupStack}>
          {['Task', 'Message', 'Payment', 'System', 'Review'].map((group) => {
            const groupItems = visibleNotifications.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <View key={group} style={styles.groupBlock}>
                <Text style={styles.groupTitle}>{groupLabel(group)}</Text>
                <View style={styles.notificationList}>
                  {groupItems.map((item) => (
                    <NotificationItem
                      isRead={readIds.includes(item.id)}
                      item={item}
                      key={item.id}
                      onPress={() => setReadIds((current) => [...new Set([...current, item.id])])}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </TaskerLayout>
  );
}

function NotificationItem({
  isRead,
  item,
  onPress,
}: {
  isRead: boolean;
  item: TaskerNotification;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.notificationCard, isRead && styles.notificationRead]}>
      <View style={[styles.notificationIcon, iconToneStyle(item.type)]}>
        <MaterialIcons
          color={iconToneColor(item.type)}
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={24}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.timeLabel}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        {item.amount || item.locationLabel ? (
          <View style={styles.tagRow}>
            {item.amount ? <Text style={styles.tagPrimary}>{formatCurrency(item.amount)}d</Text> : null}
            {item.locationLabel ? <Text style={styles.tagMuted}>{item.locationLabel}</Text> : null}
          </View>
        ) : null}
      </View>
      {!isRead ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

function filterToType(filter: string) {
  if (filter === 'Cong viec') return 'task';
  if (filter === 'Thanh toan') return 'payment';
  if (filter === 'Tin nhan') return 'message';
  return 'task';
}

function groupLabel(group: string) {
  if (group === 'Task') return 'Cong viec';
  if (group === 'Message') return 'Tin nhan';
  if (group === 'Payment') return 'Thanh toan';
  if (group === 'Review') return 'Danh gia';
  return 'Chung';
}

function iconToneColor(type: TaskerNotification['type']) {
  if (type === 'message') return taskerColors.secondary;
  if (type === 'payment') return taskerColors.tertiary;
  if (type === 'system') return taskerColors.muted;
  return taskerColors.primary;
}

function iconToneStyle(type: TaskerNotification['type']) {
  if (type === 'message') return styles.iconSecondary;
  if (type === 'payment') return styles.iconTertiary;
  if (type === 'system') return styles.iconMuted;
  return styles.iconPrimary;
}

const styles = StyleSheet.create({
  emptyCard: { alignItems: 'center', gap: 10, paddingVertical: 48 },
  emptyText: { color: taskerColors.muted, fontSize: 14, textAlign: 'center' },
  emptyTitle: { color: taskerColors.text, fontSize: 20, fontWeight: '900' },
  filterChip: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  filterChipActive: { backgroundColor: taskerColors.primary },
  filterRow: { gap: 8 },
  filterText: { color: taskerColors.muted, fontSize: 14, fontWeight: '800' },
  filterTextActive: { color: taskerColors.white },
  groupBlock: { gap: 12 },
  groupStack: { gap: 24 },
  groupTitle: { color: taskerColors.outline, fontSize: 12, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  iconMuted: { backgroundColor: taskerColors.surfaceContainerHigh },
  iconPrimary: { backgroundColor: taskerColors.primaryFixed },
  iconSecondary: { backgroundColor: taskerColors.secondaryFixed },
  iconTertiary: { backgroundColor: taskerColors.tertiaryFixed },
  markRead: { color: taskerColors.primary, fontSize: 13, fontWeight: '900' },
  notificationCard: { alignItems: 'flex-start', backgroundColor: taskerColors.card, borderColor: 'transparent', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 14 },
  notificationContent: { flex: 1, gap: 5 },
  notificationHeader: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  notificationIcon: { alignItems: 'center', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  notificationList: { gap: 12 },
  notificationMessage: { color: taskerColors.muted, fontSize: 14, lineHeight: 20 },
  notificationRead: { opacity: 0.7 },
  notificationTitle: { color: taskerColors.text, flex: 1, fontSize: 15, fontWeight: '900' },
  tagMuted: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 6, color: taskerColors.muted, fontSize: 12, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4 },
  tagPrimary: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 6, color: taskerColors.primary, fontSize: 12, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 4 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  timeText: { color: taskerColors.outline, fontSize: 11, fontWeight: '700' },
  unreadDot: { backgroundColor: taskerColors.primary, borderRadius: 4, height: 8, marginTop: 8, width: 8 },
});
