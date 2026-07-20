import { Clock3, Home, Search, UserRound } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { TASKER_COLORS, taskerShadow } from '../taskerTheme';
import type { TaskerBottomTabKey, TaskerIcon } from '../types';

type TaskerBottomNavProps = {
  active: TaskerBottomTabKey;
  onSelect: (tab: TaskerBottomTabKey) => void;
};

const navItems: { key: TaskerBottomTabKey; label: string; icon: TaskerIcon }[] = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'nearby', label: 'Tìm việc', icon: Search },
  { key: 'history', label: 'Lịch sử', icon: Clock3 },
  { key: 'profile', label: 'Hồ sơ', icon: UserRound },
];

export function TaskerBottomNav({ active, onSelect }: TaskerBottomNavProps) {
  return (
    <View
      className="bg-white border-t border-[#E7EEFF] px-2 pt-2 pb-3"
      style={taskerShadow}
    >
      <View className="h-14 flex-row items-stretch">
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            active={active === item.key}
            onPress={() => onSelect(item.key)}
          />
        ))}
      </View>
    </View>
  );
}

function NavItem({
  item,
  active,
  onPress,
}: {
  item: { label: string; icon: TaskerIcon };
  active: boolean;
  onPress: () => void;
}) {
  const Icon = item.icon;
  const color = active ? TASKER_COLORS.primary : '#777587';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="flex-1 items-center justify-center gap-0.5"
    >
      <View
        className={`w-10 h-8 rounded-full items-center justify-center ${active ? 'bg-[#E2DFFF]' : ''}`}
      >
        <Icon size={20} color={color} strokeWidth={active ? 2.8 : 2} />
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        className={`text-[10px] font-bold text-center ${active ? 'text-[#3525CD]' : 'text-[#777587]'}`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}
