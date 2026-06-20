import type { Review } from '@/src/features/tasker/types/tasker.types';

export const ratingSummaryMock = {
  average: 4.9,
  totalReviews: 124,
  criteria: [
    { label: 'Dung gio', value: 4.9, percent: 98 },
    { label: 'Chat luong', value: 4.8, percent: 96 },
    { label: 'Thai do', value: 5.0, percent: 100 },
  ],
};

export const reviewsMock: Review[] = [
  {
    id: 'review_001',
    customerName: 'Nguyen Thi Mai',
    customerInitials: 'NM',
    rating: 5,
    comment: 'Rat hai long voi dich vu ve sinh may lanh. Tasker den dung gio, lam viec can than va tu van them cach su dung tiet kiem dien.',
    taskTitle: 'Don dep nha',
    timeLabel: '2 gio truoc',
    tags: ['Don dep nha', 'Dung hen'],
  },
  {
    id: 'review_002',
    customerName: 'Tran Anh Dung',
    customerInitials: 'TD',
    rating: 4,
    comment: 'Tasker nhiet tinh, sua ong nuoc nhanh chong. Co chu dong goi dien bao truoc khi den.',
    taskTitle: 'Sua dien nuoc',
    timeLabel: 'Hom qua',
    tags: ['Sua dien nuoc'],
  },
  {
    id: 'review_003',
    customerName: 'Le Van Hung',
    customerInitials: 'LH',
    rating: 5,
    comment: 'Tuyet voi! Tay nghe tot, don dep sach se sau khi sua chua. 5 sao.',
    taskTitle: 'Sua chua',
    timeLabel: '3 ngay truoc',
    tags: ['Tan tam', 'Ky thuat cao'],
  },
];
