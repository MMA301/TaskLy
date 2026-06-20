export type TaskStatus = 'Open' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled' | 'Disputed';

export type PaymentStatus = 'Paid' | 'Pending' | 'Processing' | 'Cancelled';

export type TaskCategory =
  | 'cleaning'
  | 'delivery'
  | 'repair'
  | 'shopping'
  | 'installation'
  | 'painting'
  | 'teaching';

export type CustomerProfile = {
  id: string;
  fullName: string;
  avatarInitials: string;
  ratingAverage: number;
  reviewCount: number;
  label?: string;
};

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  categoryLabel: string;
  categoryIcon: string;
  priorityLabel?: string;
  description: string;
  requirements: { icon: string; title: string; description: string }[];
  address: string;
  distanceKm: number;
  estimatedTravelTime: string;
  budget: number;
  serviceFee?: number;
  urgentFee?: number;
  platformFee?: number;
  totalEarning: number;
  scheduledTime: string;
  scheduledDateLabel: string;
  durationLabel: string;
  postedTimeLabel: string;
  status: TaskStatus;
  progress?: number;
  paymentStatus?: PaymentStatus;
  customer: CustomerProfile;
};

export type TaskerProfile = {
  id: string;
  fullName: string;
  avatarInitials: string;
  title: string;
  bio: string;
  completedTaskCount: number;
  ratingAverage: number;
  responseRate: number;
  reputationScore: number;
  isAvailable: boolean;
  skills: string[];
  verificationItems: string[];
};

export type ChatMessage = {
  id: string;
  sender: 'customer' | 'tasker';
  message: string;
  timestamp: string;
  imageLabel?: string;
};

export type TaskerNotification = {
  id: string;
  group: 'Task' | 'Message' | 'Payment' | 'System' | 'Review';
  type: 'task' | 'message' | 'payment' | 'system' | 'review';
  icon: string;
  title: string;
  message: string;
  timeLabel: string;
  isRead: boolean;
  amount?: number;
  locationLabel?: string;
};

export type PaymentTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: PaymentStatus;
  type: 'earning' | 'withdraw';
  icon: string;
};

export type EarningsChartItem = {
  label: string;
  value: number;
  color: 'primary' | 'secondary' | 'surface';
};

export type Review = {
  id: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  comment: string;
  taskTitle: string;
  timeLabel: string;
  tags: string[];
};

export type ScheduleDay = {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  markers: ('primary' | 'secondary')[];
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  customerName: string;
  customerInitials: string;
  address: string;
  budget: number;
  status: TaskStatus | 'Free';
  color: 'primary' | 'secondary';
};
