export type PerformancePeriod = 'week' | 'month';

export type TaskerDashboardSummary = {
  taskerId: string;
  taskerName: string;
  avatarUrl: string;
  greetingMessage: string;
  todayTaskCount: number;
  todayEarnings: number;
  earningsChangePercent: number;
  completedTaskCount: number;
  successRate: number;
  isOnline: boolean;
};

export type PerformanceItem = {
  label: string;
  value: number;
  isCurrentDay: boolean;
};

export type PerformanceData = {
  period: PerformancePeriod;
  items: PerformanceItem[];
};

export type UpcomingTask = {
  id: string;
  title: string;
  category: string;
  budget: number;
  scheduledTime: string;
  scheduledDateLabel: string;
  distanceKm: number;
  status: 'Accepted';
  address: string;
};

export type BottomNavigationItem = {
  key: string;
  label: string;
  icon: string;
  routeName: string;
  isActive: boolean;
};
