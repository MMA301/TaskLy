import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Menu, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerIcon } from '../../types';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function TaskerHeader({ title = 'Taskly', subtitle, onBack, right }: HeaderProps) {
  return (
    <View className="h-16 bg-[#F9F9FF] border-b border-[#E7EEFF] px-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-[#F0F3FF]"
        >
          {onBack ? <ArrowLeft size={22} color={TASKER_COLORS.primary} /> : <Menu size={22} color={TASKER_COLORS.primary} />}
        </TouchableOpacity>
        <View className="flex-1">
          {title === 'Taskly' ? (
            <Text className="text-[24px] font-extrabold text-[#3525CD]">Taskly</Text>
          ) : (
            <Text className="text-[20px] font-extrabold text-[#111C2D]" numberOfLines={1}>{title}</Text>
          )}
          {subtitle ? <Text className="text-[12px] text-[#464555] mt-0.5" numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>
      {right ?? (
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full bg-white border border-[#D8E3FB] items-center justify-center">
            <Bell size={18} color={TASKER_COLORS.muted} />
          </View>
          <View className="w-10 h-10 rounded-full bg-[#E2DFFF] border-2 border-[#4F46E5] items-center justify-center">
            <UserRound size={18} color={TASKER_COLORS.primary} />
          </View>
        </View>
      )}
    </View>
  );
}

export function TaskerCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <View
      className={`bg-white rounded-xl border border-[#C7C4D8]/60 ${className}`}
      style={taskerShadow}
    >
      {children}
    </View>
  );
}

export function TaskerPill({
  children,
  tone = 'primary',
}: {
  children: ReactNode;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'neutral';
}) {
  const classes = {
    primary: ['bg-[#E2DFFF]', 'text-[#0F0069]'],
    secondary: ['bg-[#F0DBFF]', 'text-[#6800B4]'],
    tertiary: ['bg-[#FFDBCC]', 'text-[#351000]'],
    success: ['bg-green-100', 'text-green-700'],
    error: ['bg-[#FFDAD6]', 'text-[#93000A]'],
    neutral: ['bg-[#E7EEFF]', 'text-[#464555]'],
  }[tone];

  return (
    <View className={`px-3 py-1 rounded-lg ${classes[0]}`}>
      <Text className={`text-[11px] font-bold ${classes[1]}`}>{children}</Text>
    </View>
  );
}

export function IconTile({
  icon: Icon,
  tone = 'primary',
  size = 'md',
}: {
  icon: TaskerIcon;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}) {
  const palette = {
    primary: ['#E2DFFF', TASKER_COLORS.primary],
    secondary: ['#F0DBFF', TASKER_COLORS.secondary],
    tertiary: ['#FFDBCC', TASKER_COLORS.tertiary],
    success: ['#DCFCE7', TASKER_COLORS.success],
    error: ['#FFDAD6', TASKER_COLORS.error],
    neutral: ['#E7EEFF', TASKER_COLORS.muted],
  }[tone];
  const dimensions = size === 'lg' ? 'w-16 h-16 rounded-xl' : size === 'sm' ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl';

  return (
    <View className={`${dimensions} items-center justify-center`} style={{ backgroundColor: palette[0] }}>
      <Icon size={size === 'lg' ? 30 : size === 'sm' ? 18 : 22} color={palette[1]} />
    </View>
  );
}

export function GradientButton({
  children,
  onPress,
  className = '',
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.86} className={`rounded-xl overflow-hidden ${className}`}>
      <LinearGradient
        colors={[TASKER_COLORS.primary, TASKER_COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 py-4 flex-row items-center justify-center"
      >
        {typeof children === 'string' ? <Text className="text-white font-extrabold text-[15px]">{children}</Text> : children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-[#111C2D] text-[20px] font-extrabold">{title}</Text>
      {action ? <Text className="text-[#3525CD] text-[13px] font-bold">{action}</Text> : null}
    </View>
  );
}

export function MiniBarChart({ values }: { values: { label: string; value: number; active?: boolean }[] }) {
  const max = Math.max(...values.map((item) => item.value));
  return (
    <TaskerCard className="p-5 h-72">
      <View className="flex-row items-end justify-between flex-1 gap-2">
        {values.map((item) => {
          const height = Math.max(18, (item.value / max) * 190);
          return (
            <View key={item.label} className="flex-1 items-center justify-end">
              <Text className="text-[10px] text-[#777587] mb-2">{item.value}k</Text>
              <View
                className={`w-full rounded-t-lg ${item.active ? 'bg-[#3525CD]' : 'bg-[#DEE8FF]'}`}
                style={{ height }}
              />
              <Text className={`text-[11px] mt-2 ${item.active ? 'text-[#3525CD] font-bold' : 'text-[#464555]'}`}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </TaskerCard>
  );
}
