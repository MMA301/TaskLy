import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  CategoryBadge,
  InfoRow,
  OutlineButton,
  PrimaryButton,
  SurfaceCard,
} from '@/src/features/tasker/components/TaskerCards';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { taskDetailMock } from '@/src/mocks/tasks.mock';

const checklist = [
  { title: 'Lien he voi khach hang', description: 'Xac nhan lai thoi gian va yeu cau cu the.' },
  { title: 'Di chuyen den dia diem', description: 'Su dung ban do de tim duong di ngan nhat.' },
  { title: 'Bat dau cong viec', description: 'Chup anh truoc va sau khi hoan thanh.' },
];

export function AcceptTaskConfirmationScreen() {
  const router = useRouter();
  const task = taskDetailMock;

  return (
    <TaskerLayout>
      <View style={styles.centerWrap}>
        <SurfaceCard style={styles.confirmCard}>
          <View style={styles.heroImage}>
            <View style={styles.successIcon}>
              <MaterialIcons color={taskerColors.white} name="check-circle" size={42} />
            </View>
          </View>
          <Text style={styles.title}>Chuc mung!</Text>
          <Text style={styles.subtitle}>Ban da nhan cong viec nay thanh cong.</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <CategoryBadge label={task.categoryLabel} />
              <Text style={styles.amount}>{formatCurrency(task.totalEarning)}d</Text>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <InfoRow icon="location-on" value={task.address} />
            <InfoRow icon="schedule" value={`${task.scheduledDateLabel}, ${task.scheduledTime}`} />
          </View>

          <View style={styles.checklist}>
            <View style={styles.checklistHeader}>
              <MaterialIcons color={taskerColors.primary} name="list-alt" size={22} />
              <Text style={styles.checklistTitle}>Cac buoc tiep theo</Text>
            </View>
            {checklist.map((item, index) => (
              <View key={item.title} style={styles.stepRow}>
                <View style={[styles.stepCircle, index < 2 && styles.stepCircleActive]}>
                  <Text style={[styles.stepNumber, index < 2 && styles.stepNumberActive]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <PrimaryButton
            icon="near-me"
            label="Bat dau chuan bi"
            onPress={() => router.push('/tasker/my-accepted')}
          />
          <OutlineButton
            icon="chat"
            label="Nhan tin cho khach"
            onPress={() => router.push('/tasker/messages')}
          />
        </SurfaceCard>
      </View>
    </TaskerLayout>
  );
}

const styles = StyleSheet.create({
  amount: { color: taskerColors.primary, fontSize: 20, fontWeight: '900' },
  centerWrap: { flex: 1, justifyContent: 'center' },
  checklist: { gap: 14, marginVertical: 18 },
  checklistHeader: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  checklistTitle: { color: taskerColors.text, fontSize: 16, fontWeight: '900' },
  confirmCard: { gap: 14, overflow: 'hidden' },
  heroImage: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 20, height: 160, justifyContent: 'flex-end', margin: -16, marginBottom: 4 },
  stepCircle: { alignItems: 'center', borderColor: taskerColors.outline, borderRadius: 13, borderWidth: 2, height: 26, justifyContent: 'center', marginTop: 2, width: 26 },
  stepCircleActive: { borderColor: taskerColors.primary },
  stepDescription: { color: taskerColors.muted, fontSize: 13, lineHeight: 18 },
  stepNumber: { color: taskerColors.outline, fontSize: 11, fontWeight: '900' },
  stepNumberActive: { color: taskerColors.primary },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepText: { flex: 1 },
  stepTitle: { color: taskerColors.text, fontSize: 15, fontWeight: '900' },
  subtitle: { color: taskerColors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  successIcon: { alignItems: 'center', backgroundColor: taskerColors.primaryContainer, borderColor: taskerColors.white, borderRadius: 38, borderWidth: 5, bottom: -28, height: 76, justifyContent: 'center', width: 76 },
  summaryCard: { backgroundColor: taskerColors.surfaceContainerLow, borderColor: 'rgba(199,196,216,0.5)', borderRadius: 14, borderWidth: 1, gap: 10, padding: 14 },
  summaryTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  taskTitle: { color: taskerColors.text, fontSize: 16, fontWeight: '900', lineHeight: 22 },
  title: { color: taskerColors.text, fontSize: 26, fontWeight: '900', marginTop: 28, textAlign: 'center' },
});
