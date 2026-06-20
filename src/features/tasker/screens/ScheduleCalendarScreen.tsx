import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarInitial, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import type { ScheduleItem } from '@/src/features/tasker/types/tasker.types';
import { scheduleDaysMock, scheduleItemsMock, scheduleSummaryMock } from '@/src/mocks/schedule.mock';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function ScheduleCalendarScreen() {
  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="history" />}>
      <TaskerTopBar
        rightContent={
          <Pressable style={styles.manageTopButton}>
            <MaterialIcons color={taskerColors.white} name="event-available" size={20} />
          </Pressable>
        }
      />
      <SurfaceCard>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={styles.monthTitle}>Thang 10, 2023</Text>
            <Text style={styles.mutedText}>Hom nay la Thu Tu, ngay 25</Text>
          </View>
          <View style={styles.monthActions}>
            <Pressable style={styles.chevronButton}>
              <MaterialIcons color={taskerColors.text} name="chevron-left" size={24} />
            </Pressable>
            <Pressable style={styles.chevronButton}>
              <MaterialIcons color={taskerColors.text} name="chevron-right" size={24} />
            </Pressable>
          </View>
        </View>
        <View style={styles.weekGrid}>
          {weekDays.map((day) => (
            <Text key={day} style={[styles.weekDay, (day === 'T7' || day === 'CN') && styles.weekendDay]}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {scheduleDaysMock.map((day, index) => (
            <View key={`${day.day}_${index}`} style={[styles.dayCell, day.isSelected && styles.daySelected]}>
              <Text style={[styles.dayText, !day.isCurrentMonth && styles.dayMuted, day.isSelected && styles.dayTextSelected]}>{day.day}</Text>
              {day.markers.length > 0 ? (
                <View style={styles.markerRow}>
                  {day.markers.map((marker, markerIndex) => (
                    <View key={`${marker}_${markerIndex}`} style={[styles.marker, marker === 'secondary' && styles.markerSecondary]} />
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </SurfaceCard>

      <View style={styles.summaryGrid}>
        <SurfaceCard style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialIcons color={taskerColors.primary} name="timer" size={24} />
          </View>
          <View>
            <Text style={styles.mutedText}>Tong thoi gian lam</Text>
            <Text style={styles.summaryValue}>{scheduleSummaryMock.workHoursThisWeek}</Text>
          </View>
        </SurfaceCard>
        <SurfaceCard style={styles.summaryCard}>
          <View style={[styles.summaryIcon, styles.summaryIconSecondary]}>
            <MaterialIcons color={taskerColors.secondary} name="payments" size={24} />
          </View>
          <View>
            <Text style={styles.mutedText}>Thu nhap du kien</Text>
            <Text style={styles.summaryValueSecondary}>{formatCurrency(scheduleSummaryMock.estimatedEarnings)}d</Text>
          </View>
        </SurfaceCard>
      </View>

      <SurfaceCard style={styles.agendaCard}>
        <View style={styles.agendaHeader}>
          <Text style={styles.cardTitle}>Chuong trinh ngay</Text>
          <Text style={styles.taskCountPill}>3 Cong viec</Text>
        </View>
        <View style={styles.agendaList}>
          {scheduleItemsMock.map((item) => (
            <ScheduleAgendaItem item={item} key={item.id} />
          ))}
        </View>
        <Pressable style={styles.manageButton}>
          <Text style={styles.manageButtonText}>Quan ly lich ranh</Text>
        </Pressable>
      </SurfaceCard>
    </TaskerLayout>
  );
}

function ScheduleAgendaItem({ item }: { item: ScheduleItem }) {
  const isFree = item.status === 'Free';

  return (
    <View style={styles.agendaItem}>
      <View style={styles.timeRail}>
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={styles.railLine} />
      </View>
      {isFree ? (
        <View style={styles.freeSlot}>
          <Text style={styles.freeText}>Thoi gian trong</Text>
          <Text style={styles.freeAction}>+ Nhan viec</Text>
        </View>
      ) : (
        <View style={[styles.taskSlot, item.color === 'secondary' && styles.taskSlotSecondary]}>
          <View style={styles.slotHeader}>
            <Text style={styles.slotTitle}>{item.title}</Text>
            <Text style={[styles.slotBudget, item.color === 'secondary' && styles.slotBudgetSecondary]}>{formatCurrency(item.budget)}d</Text>
          </View>
          <View style={styles.locationRow}>
            <MaterialIcons color={taskerColors.outline} name="location-on" size={15} />
            <Text style={styles.mutedText}>{item.address}</Text>
          </View>
          <View style={styles.slotFooter}>
            <AvatarInitial initials={item.customerInitials} size={28} />
            <Pressable style={styles.detailLink}>
              <Text style={[styles.detailText, item.color === 'secondary' && styles.detailTextSecondary]}>Chi tiet</Text>
              <MaterialIcons color={item.color === 'secondary' ? taskerColors.secondary : taskerColors.primary} name="arrow-forward" size={16} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  agendaCard: { paddingBottom: 0 },
  agendaHeader: { alignItems: 'center', borderBottomColor: taskerColors.surfaceContainer, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -16, paddingBottom: 16, paddingHorizontal: 16 },
  agendaItem: { flexDirection: 'row', gap: 12 },
  agendaList: { gap: 18, paddingVertical: 18 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { color: taskerColors.text, fontSize: 22, fontWeight: '900' },
  chevronButton: { alignItems: 'center', borderColor: taskerColors.border, borderRadius: 10, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  dayCell: { alignItems: 'center', aspectRatio: 1, borderRadius: 14, justifyContent: 'center', position: 'relative', width: `${100 / 7}%` },
  dayMuted: { color: taskerColors.border },
  daySelected: { backgroundColor: taskerColors.primary, transform: [{ scale: 1.05 }] },
  dayText: { color: taskerColors.text, fontSize: 16, fontWeight: '700' },
  dayTextSelected: { color: taskerColors.white, fontSize: 20, fontWeight: '900' },
  detailLink: { alignItems: 'center', flexDirection: 'row', gap: 3 },
  detailText: { color: taskerColors.primary, fontSize: 12, fontWeight: '900' },
  detailTextSecondary: { color: taskerColors.secondary },
  freeAction: { color: taskerColors.primary, fontSize: 13, fontWeight: '900', marginTop: 4 },
  freeSlot: { alignItems: 'center', borderColor: taskerColors.border, borderRadius: 16, borderStyle: 'dashed', borderWidth: 2, flex: 1, justifyContent: 'center', minHeight: 92, opacity: 0.7 },
  freeText: { color: taskerColors.muted, fontSize: 13, fontWeight: '900' },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 4, marginBottom: 10 },
  manageButton: { backgroundColor: taskerColors.primary, borderRadius: 16, marginHorizontal: -16, padding: 16 },
  manageButtonText: { color: taskerColors.white, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  manageTopButton: { alignItems: 'center', backgroundColor: taskerColors.primaryContainer, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  marker: { backgroundColor: taskerColors.primary, borderRadius: 2, height: 4, width: 4 },
  markerRow: { bottom: 8, flexDirection: 'row', gap: 2, position: 'absolute' },
  markerSecondary: { backgroundColor: taskerColors.secondary },
  monthActions: { flexDirection: 'row', gap: 8 },
  monthTitle: { color: taskerColors.text, fontSize: 22, fontWeight: '900' },
  mutedText: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  railLine: { backgroundColor: taskerColors.surfaceContainerHigh, flex: 1, marginTop: 6, width: 2 },
  slotBudget: { color: taskerColors.primary, fontSize: 13, fontWeight: '900' },
  slotBudgetSecondary: { color: taskerColors.secondary },
  slotFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  slotHeader: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  slotTitle: { color: taskerColors.text, flex: 1, fontSize: 15, fontWeight: '900' },
  summaryCard: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 14 },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryIcon: { alignItems: 'center', backgroundColor: taskerColors.primaryFixed, borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  summaryIconSecondary: { backgroundColor: taskerColors.secondaryFixed },
  summaryValue: { color: taskerColors.primary, fontSize: 19, fontWeight: '900' },
  summaryValueSecondary: { color: taskerColors.secondary, fontSize: 19, fontWeight: '900' },
  taskCountPill: { backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 999, color: taskerColors.primary, fontSize: 12, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 5 },
  taskSlot: { backgroundColor: taskerColors.surfaceContainer, borderLeftColor: taskerColors.primary, borderLeftWidth: 4, borderRadius: 16, flex: 1, gap: 8, padding: 14 },
  taskSlotSecondary: { borderLeftColor: taskerColors.secondary },
  timeRail: { alignItems: 'center', width: 48 },
  timeText: { color: taskerColors.outline, fontSize: 12, fontWeight: '900' },
  weekDay: { color: taskerColors.outline, fontSize: 12, fontWeight: '900', textAlign: 'center', width: `${100 / 7}%` },
  weekGrid: { flexDirection: 'row', marginBottom: 8 },
  weekendDay: { color: taskerColors.error },
});
