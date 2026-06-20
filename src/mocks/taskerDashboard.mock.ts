import type {
  BottomNavigationItem,
  PerformanceData,
  TaskerDashboardSummary,
  UpcomingTask,
} from '@/src/features/tasker/types/taskerDashboard.types';

export const taskerDashboardMock: TaskerDashboardSummary = {
  taskerId: 'tasker_001',
  taskerName: 'Nam',
  avatarUrl: 'mock-avatar-tasker.png',
  greetingMessage: 'Chao buoi sang, Nam!',
  todayTaskCount: 3,
  todayEarnings: 1250000,
  earningsChangePercent: 15,
  completedTaskCount: 24,
  successRate: 98,
  isOnline: true,
};

export const weeklyPerformanceMock: PerformanceData = {
  period: 'week',
  items: [
    { label: 'Th 2', value: 400000, isCurrentDay: false },
    { label: 'Th 3', value: 650000, isCurrentDay: false },
    { label: 'Th 4', value: 500000, isCurrentDay: false },
    { label: 'Th 5', value: 300000, isCurrentDay: false },
    { label: 'Hom nay', value: 850000, isCurrentDay: true },
    { label: 'Th 7', value: 0, isCurrentDay: false },
    { label: 'CN', value: 0, isCurrentDay: false },
  ],
};

export const monthlyPerformanceMock: PerformanceData = {
  period: 'month',
  items: [
    { label: 'T1', value: 2600000, isCurrentDay: false },
    { label: 'T2', value: 3200000, isCurrentDay: false },
    { label: 'T3', value: 2800000, isCurrentDay: false },
    { label: 'T4', value: 3900000, isCurrentDay: false },
    { label: 'Nay', value: 1250000, isCurrentDay: true },
  ],
};

export const upcomingTasksMock: UpcomingTask[] = [
  {
    id: 'task_001',
    title: 'Don dep can ho 2PN - Quan 7',
    category: 'Don dep nha',
    budget: 350000,
    scheduledTime: '14:00',
    scheduledDateLabel: 'Hom nay',
    distanceKm: 2.5,
    status: 'Accepted',
    address: 'Quan 7',
  },
  {
    id: 'task_002',
    title: 'Giao ho so gap - Quan 1',
    category: 'Giao hang',
    budget: 120000,
    scheduledTime: '16:30',
    scheduledDateLabel: 'Hom nay',
    distanceKm: 0.8,
    status: 'Accepted',
    address: 'Quan 1',
  },
  {
    id: 'task_003',
    title: 'Lap ke sach treo tuong',
    category: 'Lap dat',
    budget: 500000,
    scheduledTime: '09:00',
    scheduledDateLabel: 'Ngay mai',
    distanceKm: 4.2,
    status: 'Accepted',
    address: 'Quan 3',
  },
];

export const taskerBottomNavigationMock: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', icon: 'home', routeName: 'TaskerDashboard', isActive: true },
  { key: 'search', label: 'Search', icon: 'search', routeName: 'NearbyTasks', isActive: false },
  { key: 'tasks', label: 'Tasks', icon: 'assignment', routeName: 'MyAcceptedTasks', isActive: false },
  { key: 'history', label: 'History', icon: 'history', routeName: 'TaskHistory', isActive: false },
  { key: 'profile', label: 'Profile', icon: 'person', routeName: 'TaskerProfile', isActive: false },
];
