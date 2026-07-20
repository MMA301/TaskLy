import type { LucideIcon } from 'lucide-react-native';

export type TaskerScreenKey =
  | 'dashboard'
  | 'nearby'
  | 'detail'
  | 'accept'
  | 'accepted'
  | 'history'
  | 'messages'
  | 'notifications'
  | 'earnings'
  | 'reviews'
  | 'schedule'
  | 'profile';

export type TaskerBottomTabKey = 'dashboard' | 'nearby' | 'history' | 'profile';

export type TaskerScreenProps = {
  onBack: () => void;
  onNavigate: (screen: TaskerScreenKey) => void;
};

export type TaskerIcon = LucideIcon;
