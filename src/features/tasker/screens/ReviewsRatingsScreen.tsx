import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarInitial, SectionTitle, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import type { Review } from '@/src/features/tasker/types/tasker.types';
import { ratingSummaryMock, reviewsMock } from '@/src/mocks/reviews.mock';

export function ReviewsRatingsScreen() {
  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="profile" />}>
      <TaskerTopBar />
      <SectionTitle title="Danh gia & Nhan xet" subtitle="Theo doi chat luong dich vu va niem tin tu Customer." />
      <SurfaceCard>
        <Text style={styles.cardTitle}>Danh gia chung</Text>
        <View style={styles.ratingSummary}>
          <Text style={styles.averageRating}>{ratingSummaryMock.average}</Text>
          <View>
            <StarRow rating={5} />
            <Text style={styles.mutedText}>Dua tren {ratingSummaryMock.totalReviews} danh gia</Text>
          </View>
        </View>
        <View style={styles.criteriaList}>
          {ratingSummaryMock.criteria.map((item) => (
            <View key={item.label} style={styles.criteriaItem}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaLabel}>{item.label}</Text>
                <Text style={styles.criteriaValue}>{item.value}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.percent}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </SurfaceCard>
      <View style={styles.trustCard}>
        <Text style={styles.trustTitle}>Cong dong tin cay</Text>
        <Text style={styles.trustText}>
          Hon 95% Customer da quay lai su dung dich vu cua Tasker nay.
        </Text>
        <Pressable style={styles.trustButton}>
          <Text style={styles.trustButtonText}>Dat ngay</Text>
        </Pressable>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.cardTitle}>Nhan xet tu Customer</Text>
        <View style={styles.filterPill}>
          <MaterialIcons color={taskerColors.text} name="tune" size={18} />
          <Text style={styles.filterText}>Moi nhat</Text>
        </View>
      </View>
      <View style={styles.reviewList}>
        {reviewsMock.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
      <Pressable style={styles.moreReviews}>
        <Text style={styles.moreText}>Xem them danh gia</Text>
      </Pressable>
    </TaskerLayout>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <SurfaceCard>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewCustomer}>
          <AvatarInitial initials={review.customerInitials} size={48} />
          <View>
            <Text style={styles.customerName}>{review.customerName}</Text>
            <StarRow rating={review.rating} small />
          </View>
        </View>
        <Text style={styles.mutedText}>{review.timeLabel}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
      <View style={styles.tagRow}>
        {review.tags.map((tag) => (
          <Text key={tag} style={styles.reviewTag}>{tag}</Text>
        ))}
      </View>
    </SurfaceCard>
  );
}

function StarRow({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <MaterialIcons
          color={index < rating ? '#fbbf24' : taskerColors.border}
          key={index}
          name="star"
          size={small ? 17 : 22}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  averageRating: { color: taskerColors.primary, fontSize: 48, fontWeight: '900' },
  cardTitle: { color: taskerColors.text, fontSize: 22, fontWeight: '900' },
  comment: { color: taskerColors.text, fontSize: 15, lineHeight: 22, marginTop: 14 },
  criteriaHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  criteriaItem: { gap: 8 },
  criteriaLabel: { color: taskerColors.text, fontSize: 14, fontWeight: '800' },
  criteriaList: { gap: 14, marginTop: 18 },
  criteriaValue: { color: taskerColors.primary, fontWeight: '900' },
  customerName: { color: taskerColors.text, fontSize: 16, fontWeight: '900' },
  filterPill: { alignItems: 'center', backgroundColor: taskerColors.white, borderColor: taskerColors.border, borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { color: taskerColors.text, fontSize: 13, fontWeight: '800' },
  moreReviews: { alignItems: 'center', borderColor: taskerColors.border, borderRadius: 18, borderStyle: 'dashed', borderWidth: 2, padding: 16 },
  moreText: { color: taskerColors.muted, fontWeight: '900' },
  mutedText: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  progressFill: { backgroundColor: taskerColors.secondary, borderRadius: 999, height: '100%' },
  progressTrack: { backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 999, height: 8, overflow: 'hidden' },
  ratingSummary: { alignItems: 'flex-end', flexDirection: 'row', gap: 10, marginTop: 12 },
  reviewCustomer: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  reviewHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  reviewList: { gap: 12 },
  reviewTag: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 8, color: taskerColors.primary, fontSize: 12, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 5 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  starRow: { flexDirection: 'row' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  trustButton: { backgroundColor: taskerColors.white, borderRadius: 12, padding: 12 },
  trustButtonText: { color: taskerColors.primary, fontWeight: '900', textAlign: 'center' },
  trustCard: { backgroundColor: taskerColors.primaryContainer, borderRadius: 20, gap: 8, padding: 20 },
  trustText: { color: taskerColors.white, fontSize: 14, lineHeight: 20, opacity: 0.9 },
  trustTitle: { color: taskerColors.white, fontSize: 22, fontWeight: '900' },
});
