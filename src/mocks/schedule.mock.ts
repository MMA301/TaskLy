import type { ScheduleDay, ScheduleItem } from '@/src/features/tasker/types/tasker.types';

export const scheduleDaysMock: ScheduleDay[] = [
  { day: 25, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 26, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 27, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 28, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 29, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 30, isCurrentMonth: false, isSelected: false, markers: [] },
  { day: 1, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 2, isCurrentMonth: true, isSelected: false, markers: ['primary'] },
  { day: 3, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 4, isCurrentMonth: true, isSelected: false, markers: ['secondary'] },
  { day: 5, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 6, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 7, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 8, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 23, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 24, isCurrentMonth: true, isSelected: false, markers: ['primary', 'secondary'] },
  { day: 25, isCurrentMonth: true, isSelected: true, markers: [] },
  { day: 26, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 27, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 28, isCurrentMonth: true, isSelected: false, markers: [] },
  { day: 29, isCurrentMonth: true, isSelected: false, markers: [] },
];

export const scheduleSummaryMock = {
  workHoursThisWeek: '32h / tuan',
  estimatedEarnings: 4200000,
};

export const scheduleItemsMock: ScheduleItem[] = [
  { id: 'schedule_001', time: '08:00', title: 'Don dep can ho', customerName: 'Chi Mai', customerInitials: 'CM', address: 'Vinhomes Central Park, Q. Binh Thanh', budget: 250000, status: 'Accepted', color: 'primary' },
  { id: 'schedule_002', time: '13:30', title: 'Giao hang thuc pham', customerName: 'Anh Tuan', customerInitials: 'AT', address: 'Thao Dien, Quan 2', budget: 120000, status: 'Accepted', color: 'secondary' },
  { id: 'schedule_003', time: '16:00', title: 'Thoi gian trong', customerName: '', customerInitials: '', address: '', budget: 0, status: 'Free', color: 'primary' },
  { id: 'schedule_004', time: '19:00', title: 'Day kem tieng Anh', customerName: 'Anh Hung', customerInitials: 'AH', address: 'Phu My Hung, Quan 7', budget: 300000, status: 'Accepted', color: 'primary' },
];
