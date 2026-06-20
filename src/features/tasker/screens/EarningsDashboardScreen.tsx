import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AmountText, SectionTitle, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import { earningsChartMock, earningsSummaryMock, paymentTransactionsMock } from '@/src/mocks/payments.mock';

export function EarningsDashboardScreen() {
  const maxValue = Math.max(...earningsChartMock.map((item) => item.value));

  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="history" />}>
      <TaskerTopBar />
      <SectionTitle title="Bang dieu khien thu nhap" subtitle="Theo doi so du va giao dich gan day." />
      <View style={styles.balanceCard}>
        <MaterialIcons color="rgba(255,255,255,0.18)" name="account-balance-wallet" size={116} style={styles.walletWatermark} />
        <Text style={styles.balanceLabel}>Tong so du</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(earningsSummaryMock.totalBalance)}d</Text>
        <View style={styles.balanceActions}>
          <Pressable style={styles.withdrawButton}>
            <MaterialIcons color={taskerColors.primary} name="account-balance" size={20} />
            <Text style={styles.withdrawText}>Rut tien</Text>
          </Pressable>
          <Pressable style={styles.moreButton}>
            <MaterialIcons color={taskerColors.white} name="more-horiz" size={22} />
          </Pressable>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <SurfaceCard style={styles.statCard}>
          <Text style={styles.statLabel}>Thu nhap thang nay</Text>
          <Text style={styles.statPrimary}>+{formatCurrency(earningsSummaryMock.thisMonthEarnings)}d</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.statCard}>
          <Text style={styles.statLabel}>So viec da lam</Text>
          <Text style={styles.statSecondary}>{earningsSummaryMock.completedTaskCount}</Text>
        </SurfaceCard>
      </View>
      <SurfaceCard>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.cardTitle}>Tong quan thu nhap tuan</Text>
            <Text style={styles.mutedText}>01 Thg 5 - 07 Thg 5, 2024</Text>
          </View>
          <Text style={styles.filterPill}>Tuan nay</Text>
        </View>
        <View style={styles.chart}>
          {earningsChartMock.map((item) => (
            <View key={item.label} style={styles.chartItem}>
              <View style={styles.chartTrack}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      backgroundColor: item.color === 'primary' ? taskerColors.primary : item.color === 'secondary' ? taskerColors.secondary : taskerColors.surfaceContainerHigh,
                      height: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.chartLabel, item.color !== 'surface' && styles.chartLabelActive]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>
      <SurfaceCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.cardTitle}>Giao dich gan day</Text>
          <Text style={styles.linkText}>Xem tat ca</Text>
        </View>
        <View style={styles.transactionList}>
          {paymentTransactionsMock.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialIcons color={transaction.type === 'withdraw' ? taskerColors.error : taskerColors.primary} name={transaction.icon as keyof typeof MaterialIcons.glyphMap} size={24} />
              </View>
              <View style={styles.transactionText}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.mutedText}>{transaction.subtitle}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <AmountText amount={transaction.amount} />
                <Text style={[styles.statusText, transaction.status === 'Processing' && styles.statusMuted]}>
                  {transaction.status === 'Paid' ? 'Thanh cong' : 'Dang xu ly'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </SurfaceCard>
    </TaskerLayout>
  );
}

const styles = StyleSheet.create({
  balanceActions: { flexDirection: 'row', gap: 8, marginTop: 18 },
  balanceAmount: { color: taskerColors.white, fontSize: 38, fontWeight: '900' },
  balanceCard: { backgroundColor: taskerColors.primary, borderRadius: 22, overflow: 'hidden', padding: 26 },
  balanceLabel: { color: 'rgba(255,255,255,0.86)', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  cardTitle: { color: taskerColors.text, fontSize: 20, fontWeight: '900' },
  chart: { alignItems: 'flex-end', flexDirection: 'row', gap: 9, height: 220, marginTop: 22 },
  chartBar: { borderRadius: 8, width: '100%' },
  chartItem: { alignItems: 'center', flex: 1, gap: 8, height: '100%', justifyContent: 'flex-end' },
  chartLabel: { color: taskerColors.outline, fontSize: 11, fontWeight: '900' },
  chartLabelActive: { color: taskerColors.primary },
  chartTrack: { alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', width: '100%' },
  filterPill: { backgroundColor: taskerColors.surfaceContainerLow, borderRadius: 10, color: taskerColors.primary, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 8 },
  linkText: { color: taskerColors.primary, fontSize: 14, fontWeight: '900' },
  moreButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 42, justifyContent: 'center', width: 42 },
  mutedText: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1 },
  statLabel: { color: taskerColors.muted, fontSize: 12, fontWeight: '800' },
  statPrimary: { color: taskerColors.primary, fontSize: 22, fontWeight: '900', marginTop: 6 },
  statSecondary: { color: taskerColors.secondary, fontSize: 22, fontWeight: '900', marginTop: 6 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statusMuted: { color: taskerColors.muted, backgroundColor: taskerColors.surfaceContainer },
  statusText: { alignSelf: 'flex-end', backgroundColor: '#f0fdf4', borderRadius: 5, color: taskerColors.success, fontSize: 10, fontWeight: '900', marginTop: 3, paddingHorizontal: 5, paddingVertical: 2 },
  transactionAmount: { alignItems: 'flex-end' },
  transactionIcon: { alignItems: 'center', backgroundColor: taskerColors.primaryFixed, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  transactionItem: { alignItems: 'center', borderBottomColor: taskerColors.surfaceContainer, borderBottomWidth: 1, flexDirection: 'row', gap: 12, paddingVertical: 12 },
  transactionList: { marginTop: 12 },
  transactionText: { flex: 1 },
  transactionTitle: { color: taskerColors.text, fontSize: 14, fontWeight: '900' },
  walletWatermark: { position: 'absolute', right: -6, top: -16 },
  withdrawButton: { alignItems: 'center', backgroundColor: taskerColors.white, borderRadius: 10, flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  withdrawText: { color: taskerColors.primary, fontWeight: '900' },
});
