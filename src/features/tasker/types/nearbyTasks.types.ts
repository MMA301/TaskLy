export type NearbyTaskCategory = 'cleaning' | 'delivery' | 'repair' | 'shopping';

export type CategoryColor = 'primary' | 'secondary' | 'tertiary';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  district: string;
  city: string;
  addressLabel: string;
};

export type NearbyTask = {
  id: string;
  title: string;
  category: NearbyTaskCategory;
  categoryLabel: string;
  categoryIcon: string;
  categoryColor: CategoryColor;
  budget: number;
  distanceKm: number;
  postedTimeLabel: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'Open';
  createdAt: string;
};

export type NearbyFilterKey = 'all' | 'distance' | 'price' | 'category';

export type FilterChip = {
  key: NearbyFilterKey;
  label: string;
  icon: string;
};

export type NearbyFilterState = {
  selectedCategory: NearbyTaskCategory | null;
  selectedDistance: string | null;
  selectedPriceRange: string | null;
  sortBy: 'distance';
  isFilterActive: boolean;
};

export type MapPin = {
  taskId: string;
  latitude: number;
  longitude: number;
  icon: string;
  color: CategoryColor;
  isHighlighted: boolean;
};
