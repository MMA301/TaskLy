import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AvatarInitial,
  CategoryBadge,
  InfoRow,
  OutlineButton,
  PrimaryButton,
  StatusBadge,
  SurfaceCard,
} from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import { taskDetailMock } from '@/src/mocks/tasks.mock';

export function TaskDetailTaskerScreen() {
  const router = useRouter();
  const task = taskDetailMock;

  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="history" />}>
      <TaskerTopBar showBack title="Chi tiet cong viec" />

      <SurfaceCard>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <View style={styles.badgeRow}>
              <CategoryBadge label={task.categoryLabel} />
              {task.priorityLabel ? <StatusBadge label={task.priorityLabel} tone="secondary" /> : null}
            </View>
            <Text style={styles.heroTitle}>{task.title}</Text>
            <InfoRow icon="schedule" value={`Dang cach day ${task.postedTimeLabel}`} />
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.priceText}>{formatCurrency(task.budget)}d</Text>
            <Text style={styles.mutedText}>Du kien {task.durationLabel} lam viec</Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.cardTitle}>Khach hang</Text>
        <View style={styles.customerRow}>
          <View style={styles.customerInfo}>
            <AvatarInitial initials={task.customer.avatarInitials} size={56} />
            <View>
              <Text style={styles.customerName}>{task.customer.fullName}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons color="#f59e0b" name="star" size={17} />
                <Text style={styles.ratingText}>{task.customer.ratingAverage}</Text>
                <Text style={styles.mutedText}>({task.customer.reviewCount} danh gia)</Text>
              </View>
            </View>
          </View>
          <OutlineButton label="Ho so" />
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.cardTitle}>Yeu cau chi tiet</Text>
        <View style={styles.listStack}>
          {task.requirements.map((item) => (
            <View key={item.title} style={styles.requirementRow}>
              <View style={styles.iconBox}>
                <MaterialIcons
                  color={taskerColors.primary}
                  name={item.icon as keyof typeof MaterialIcons.glyphMap}
                  size={22}
                />
              </View>
              <View style={styles.requirementText}>
                <Text style={styles.requirementTitle}>{item.title}</Text>
                <Text style={styles.requirementDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.cardTitle}>Dia diem</Text>
        <InfoRow icon="location-on" value={task.address} />
        <Pressable style={styles.mapPreview}>
          <View style={styles.mapRoadOne} />
          <View style={styles.mapRoadTwo} />
          <View style={styles.mapPin}>
            <MaterialIcons color={taskerColors.white} name="location-on" size={24} />
          </View>
        </Pressable>
        <View style={styles.twoCol}>
          <InfoRow icon="near-me" label="Khoang cach" value={`${task.distanceKm}km`} />
          <InfoRow icon="directions-bike" label="Di chuyen" value={task.estimatedTravelTime} />
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.cardTitle}>Thanh toan</Text>
        <View style={styles.paymentRows}>
          <PaymentLine label="Phi dich vu" value={task.serviceFee ?? task.budget} />
          <PaymentLine label="Phu phi khan cap" value={task.urgentFee ?? 0} />
          <PaymentLine label="Phi nen tang" value={task.platformFee ?? 0} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tong nhan</Text>
            <Text style={styles.totalValue}>{formatCurrency(task.totalEarning)}d</Text>
          </View>
        </View>
        <View style={styles.ctaStack}>
          <PrimaryButton
            icon="bolt"
            label="Nhan viec ngay"
            onPress={() => router.push('/tasker/accept-task')}
          />
          <OutlineButton
            icon="chat"
            label="Hoi khach hang"
            onPress={() => router.push('/tasker/messages')}
          />
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.safetyCard}>
        <MaterialIcons color={taskerColors.primary} name="shield" size={34} />
        <View style={styles.requirementText}>
          <Text style={styles.requirementTitle}>Bao hiem Taskly</Text>
          <Text style={styles.requirementDescription}>
            Cong viec nay duoc bao hiem len den 10.000.000d.
          </Text>
        </View>
      </SurfaceCard>
    </TaskerLayout>
  );
}

function PaymentLine({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.paymentLine}>
      <Text style={styles.mutedText}>{label}</Text>
      <Text style={styles.paymentValue}>{formatCurrency(value)}d</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cardTitle: { color: taskerColors.text, fontSize: 22, fontWeight: '900', marginBottom: 14 },
  ctaStack: { gap: 12, marginTop: 16 },
  customerInfo: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 12 },
  customerName: { color: taskerColors.text, fontSize: 17, fontWeight: '900' },
  customerRow: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  heroCopy: { flex: 1, gap: 10 },
  heroHeader: { gap: 16 },
  heroTitle: { color: taskerColors.text, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  iconBox: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerLow, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  listStack: { gap: 16 },
  mapPin: { alignItems: 'center', backgroundColor: taskerColors.primary, borderColor: taskerColors.white, borderRadius: 24, borderWidth: 4, height: 48, justifyContent: 'center', left: '44%', position: 'absolute', top: '38%', width: 48 },
  mapPreview: { backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 14, height: 190, marginTop: 14, overflow: 'hidden' },
  mapRoadOne: { backgroundColor: taskerColors.white, borderRadius: 20, height: 18, left: -40, position: 'absolute', top: 64, transform: [{ rotate: '24deg' }], width: 360 },
  mapRoadTwo: { backgroundColor: taskerColors.white, borderRadius: 20, height: 18, position: 'absolute', right: -40, top: 120, transform: [{ rotate: '-28deg' }], width: 320 },
  mutedText: { color: taskerColors.muted, fontSize: 13, fontWeight: '600' },
  paymentLine: { borderBottomColor: taskerColors.surfaceContainerHigh, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  paymentRows: { gap: 2 },
  paymentValue: { color: taskerColors.text, fontSize: 15, fontWeight: '800' },
  priceBlock: { alignItems: 'flex-start' },
  priceText: { color: taskerColors.primary, fontSize: 30, fontWeight: '900' },
  ratingRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 3 },
  ratingText: { color: taskerColors.tertiary, fontWeight: '900' },
  requirementDescription: { color: taskerColors.muted, fontSize: 14, lineHeight: 20 },
  requirementRow: { flexDirection: 'row', gap: 12 },
  requirementText: { flex: 1, gap: 3 },
  requirementTitle: { color: taskerColors.text, fontSize: 15, fontWeight: '900' },
  safetyCard: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerHigh, flexDirection: 'row', gap: 12 },
  totalLabel: { color: taskerColors.text, fontSize: 17, fontWeight: '900' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  totalValue: { color: taskerColors.primary, fontSize: 20, fontWeight: '900' },
  twoCol: { flexDirection: 'row', gap: 16, marginTop: 14 },
});
