import type { Task } from '@/src/features/tasker/types/tasker.types';

const customerMai = {
  id: 'customer_001',
  fullName: 'Nguyen Thi Mai Anh',
  avatarInitials: 'MA',
  ratingAverage: 4.9,
  reviewCount: 124,
  label: 'Khach hang VIP',
};

const customerTuan = {
  id: 'customer_002',
  fullName: 'Anh Tuan',
  avatarInitials: 'AT',
  ratingAverage: 4.9,
  reviewCount: 128,
};

export const taskDetailMock: Task = {
  id: 'task_001',
  title: 'Don dep can ho 2 phong ngu tai Vinhomes Central Park',
  category: 'cleaning',
  categoryLabel: 'Don dep nha cua',
  categoryIcon: 'cleaning-services',
  priorityLabel: 'Khan cap',
  description: 'Can don dep tong the can ho truoc 17:00 hom nay.',
  requirements: [
    {
      icon: 'check-circle',
      title: 'Don dep tong the',
      description: 'Quet don, lau san, hut bui toan bo cac phong va ban cong.',
    },
    {
      icon: 'kitchen',
      title: 'Ve sinh bep va tu lanh',
      description: 'Lam sach be mat bep, bon rua va sap xep lai thuc pham trong tu lanh.',
    },
    {
      icon: 'inventory',
      title: 'Luu y dac biet',
      description: 'Chu nha co nuoi mot meo nho, vui long can than khi mo cua ban cong.',
    },
  ],
  address: 'Toa Landmark 81, Vinhomes Central Park, Quan Binh Thanh, TP.HCM',
  distanceKm: 2.5,
  estimatedTravelTime: '18 phut',
  budget: 500000,
  serviceFee: 450000,
  urgentFee: 50000,
  platformFee: 0,
  totalEarning: 500000,
  scheduledTime: '14:00',
  scheduledDateLabel: 'Hom nay',
  durationLabel: '3 gio',
  postedTimeLabel: '15 phut truoc',
  status: 'Open',
  customer: customerMai,
};

export const acceptedTasksMock: Task[] = [
  {
    ...taskDetailMock,
    id: 'accepted_001',
    status: 'In Progress',
    progress: 75,
    budget: 450000,
    totalEarning: 450000,
    title: 'Don dep can ho 2 phong ngu',
    scheduledDateLabel: 'Hom nay',
  },
  {
    ...taskDetailMock,
    id: 'accepted_002',
    category: 'delivery',
    categoryLabel: 'Giao hang',
    categoryIcon: 'local-shipping',
    status: 'In Progress',
    progress: 40,
    budget: 120000,
    totalEarning: 120000,
    title: 'Giao qua tang hoa toc',
    address: 'Quan 1 den Quan 3',
    distanceKm: 2.5,
    customer: customerTuan,
  },
  {
    ...taskDetailMock,
    id: 'accepted_003',
    category: 'installation',
    categoryLabel: 'Lap dat',
    categoryIcon: 'construction',
    status: 'Accepted',
    progress: 0,
    budget: 800000,
    totalEarning: 800000,
    title: 'Lap dat ke sach go',
    scheduledDateLabel: 'Ngay mai',
    scheduledTime: '09:00',
    customer: { id: 'customer_003', fullName: 'Chi Linh', avatarInitials: 'CL', ratingAverage: 4.8, reviewCount: 42 },
  },
  {
    ...taskDetailMock,
    id: 'accepted_004',
    category: 'repair',
    categoryLabel: 'Sua chua',
    categoryIcon: 'build',
    status: 'Accepted',
    budget: 300000,
    totalEarning: 300000,
    title: 'Sua voi nuoc ro ri',
    scheduledDateLabel: '25 Thang 10',
    scheduledTime: '14:00',
  },
];

export const taskHistoryMock: Task[] = [
  { ...taskDetailMock, id: 'history_001', title: 'Don dep can ho 2PN', status: 'Completed', paymentStatus: 'Paid', totalEarning: 450000, scheduledDateLabel: '24 Th10, 2023' },
  { ...taskDetailMock, id: 'history_002', title: 'Van chuyen tu lanh 300L', category: 'delivery', categoryIcon: 'local-shipping', status: 'Cancelled', paymentStatus: 'Cancelled', totalEarning: 250000, scheduledDateLabel: '22 Th10, 2023' },
  { ...taskDetailMock, id: 'history_003', title: 'Sua ong nuoc nha tam', category: 'repair', categoryIcon: 'build', status: 'Disputed', paymentStatus: 'Pending', totalEarning: 0, scheduledDateLabel: '19 Th10, 2023' },
  { ...taskDetailMock, id: 'history_004', title: 'Di cho giup nguoi cao tuoi', category: 'shopping', categoryIcon: 'shopping-basket', status: 'Completed', paymentStatus: 'Paid', totalEarning: 120000, scheduledDateLabel: '15 Th10, 2023' },
];
