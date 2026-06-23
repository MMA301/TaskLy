import { Clock3, Home, Plus, Search, UserRound } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { TASKER_COLORS, taskerShadow } from '../taskerTheme';
import type { TaskerBottomTabKey, TaskerIcon } from '../types';

type TaskerBottomNavProps = {
  active: TaskerBottomTabKey;
  onSelect: (tab: TaskerBottomTabKey) => void;
};

const navItems: { key: Exclude<TaskerBottomTabKey, 'accept'>; label: string; icon: TaskerIcon }[] = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'nearby', label: 'Search', icon: Search },
  { key: 'history', label: 'History', icon: Clock3 },
  { key: 'profile', label: 'Profile', icon: UserRound },
];

export function TaskerBottomNav({ active, onSelect }: TaskerBottomNavProps) {
  return (
    <View className="bg-white rounded-t-xl border-t border-[#E7EEFF] px-1 pt-2 pb-3" style={taskerShadow}>
      <View className="h-16 flex-row items-center">
        <NavItem item={navItems[0]} active={active === 'dashboard'} onPress={() => onSelect('dashboard')} />
        <NavItem item={navItems[1]} active={active === 'nearby'} onPress={() => onSelect('nearby')} />
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => onSelect('accept')}
          className="flex-1 items-center justify-center"
        >
          <View className="-mt-7 w-12 h-12 rounded-full bg-[#3525CD] border-4 border-white items-center justify-center shadow-lg">
            <Plus size={24} color="#FFFFFF" strokeWidth={2.6} />
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            className={`text-[9px] font-bold mt-1 text-center ${active === 'accept' ? 'text-[#3525CD]' : 'text-[#464555]'}`}
          >
            Create
          </Text>
        </TouchableOpacity>
        <NavItem item={navItems[2]} active={active === 'history'} onPress={() => onSelect('history')} />
        <NavItem item={navItems[3]} active={active === 'profile'} onPress={() => onSelect('profile')} />
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
  const color = active ? TASKER_COLORS.primary : TASKER_COLORS.muted;

  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} className="flex-1 items-center justify-center px-0.5">
      <Icon size={19} color={color} strokeWidth={active ? 2.8 : 2} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        className={`text-[9px] font-bold mt-1 text-center w-full ${active ? 'text-[#3525CD]' : 'text-[#464555]'}`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}
