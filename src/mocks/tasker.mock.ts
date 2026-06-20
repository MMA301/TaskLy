import type { TaskerProfile } from '@/src/features/tasker/types/tasker.types';

export const taskerProfileMock: TaskerProfile = {
  id: 'tasker_001',
  fullName: 'Nguyen Minh Duc',
  avatarInitials: 'MD',
  title: 'Chuyen gia cap cao',
  bio: 'Tasker sua chua da nang voi hon 5 nam kinh nghiem trong dien nuoc va lap dat noi that tai TP.HCM.',
  completedTaskCount: 128,
  ratingAverage: 4.9,
  responseRate: 100,
  reputationScore: 96,
  isAvailable: true,
  skills: ['Dien nuoc', 'Lap dat IKEA', 'Son sua nha', 'Van chuyen noi that', 'Khoan tuong'],
  verificationItems: ['So dien thoai: 09*** **123', 'CCCD da xac thuc', 'Giay phep hanh nghe'],
};
