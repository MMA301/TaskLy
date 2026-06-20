import { useMemo, useState } from 'react';

import {
  currentLocationMock,
  filterChipsMock,
  nearbyTasksMock,
} from '@/src/mocks/nearbyTasks.mock';
import type { MapPin, NearbyFilterKey } from '@/src/features/tasker/types/nearbyTasks.types';

export function useNearbyTasks() {
  const [activeFilterKey, setActiveFilterKey] = useState<NearbyFilterKey>('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const visibleTasks = useMemo(() => {
    if (activeFilterKey === 'distance') {
      return [...nearbyTasksMock].sort((firstTask, secondTask) => firstTask.distanceKm - secondTask.distanceKm);
    }

    if (activeFilterKey === 'price') {
      return [...nearbyTasksMock].sort((firstTask, secondTask) => firstTask.budget - secondTask.budget);
    }

    if (activeFilterKey === 'category') {
      return nearbyTasksMock.filter((task) => task.category === 'cleaning' || task.category === 'shopping');
    }

    return nearbyTasksMock;
  }, [activeFilterKey]);

  const mapPins: MapPin[] = useMemo(
    () =>
      visibleTasks.map((task) => ({
        taskId: task.id,
        latitude: task.latitude,
        longitude: task.longitude,
        icon: task.categoryIcon,
        color: task.categoryColor,
        isHighlighted: selectedTaskId === task.id,
      })),
    [selectedTaskId, visibleTasks]
  );

  return {
    activeFilterKey,
    currentLocation: currentLocationMock,
    filterChips: filterChipsMock,
    isEmpty: visibleTasks.length === 0,
    isError: false,
    isLoading: false,
    isLocationDenied: false,
    mapPins,
    nearbyTasks: visibleTasks,
    selectedTaskId,
    selectFilter: setActiveFilterKey,
    selectTask: setSelectedTaskId,
  };
}
