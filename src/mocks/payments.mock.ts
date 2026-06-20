import type { EarningsChartItem, PaymentTransaction } from '@/src/features/tasker/types/tasker.types';

export const earningsSummaryMock = {
  totalBalance: 15450000,
  thisMonthEarnings: 4200000,
  completedTaskCount: 24,
};

export const earningsChartMock: EarningsChartItem[] = [
  { label: 'T2', value: 450000, color: 'surface' },
  { label: 'T3', value: 720000, color: 'surface' },
  { label: 'T4', value: 1200000, color: 'primary' },
  { label: 'T5', value: 380000, color: 'surface' },
  { label: 'T6', value: 600000, color: 'surface' },
  { label: 'T7', value: 950000, color: 'secondary' },
  { label: 'CN', value: 210000, color: 'surface' },
];

export const paymentTransactionsMock: PaymentTransaction[] = [
  { id: 'pay_001', title: 'Don dep can ho Vinhome', subtitle: 'Hom nay, 14:30 - Thanh toan cong viec', amount: 350000, status: 'Paid', type: 'earning', icon: 'cleaning-services' },
  { id: 'pay_002', title: 'Rut tien ve MB Bank', subtitle: 'Hom qua, 09:15 - Rut tien', amount: -2000000, status: 'Processing', type: 'withdraw', icon: 'account-balance' },
  { id: 'pay_003', title: 'Giao hang hoa toc - Quan 1', subtitle: '02 Thg 5, 18:20 - Thanh toan cong viec', amount: 120000, status: 'Paid', type: 'earning', icon: 'local-shipping' },
  { id: 'pay_004', title: 'Sua ong nuoc - Landmark 81', subtitle: '01 Thg 5, 10:00 - Thanh toan cong viec', amount: 550000, status: 'Paid', type: 'earning', icon: 'plumbing' },
];
