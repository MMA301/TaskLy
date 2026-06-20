import { useMemo, useState } from 'react';

import {
  monthlyPerformanceMock,
  taskerBottomNavigationMock,
  taskerDashboardMock,
  upcomingTasksMock,
  weeklyPerformanceMock,
} from '@/src/mocks/taskerDashboard.mock';
import type { PerformancePeriod } from '@/src/features/tasker/types/taskerDashboard.types';

export function useTaskerDashboard() {
  const [isOnline, setIsOnline] = useState(taskerDashboardMock.isOnline);
  const [selectedPeriod, setSelectedPeriod] = useState<PerformancePeriod>('week');

  const summary = useMemo(
    () => ({
      ...taskerDashboardMock,
      isOnline,
    }),
    [isOnline]
  );

  return {
    bottomNavigation: taskerBottomNavigationMock,
    isEmpty: upcomingTasksMock.length === 0,
    isError: false,
    isLoading: false,
    performance: selectedPeriod === 'week' ? weeklyPerformanceMock : monthlyPerformanceMock,
    selectedPeriod,
    setSelectedPeriod,
    summary,
    toggleOnlineStatus: () => setIsOnline((currentValue) => !currentValue),
    upcomingTasks: upcomingTasksMock,
  };
}
