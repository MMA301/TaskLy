import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { taskerColors } from '@/src/features/tasker/components/taskerTheme';

type ActiveTab = 'home' | 'search' | 'create' | 'history' | 'profile' | 'notifications';

export function TaskerBottomTabBar({ activeTab }: { activeTab: ActiveTab }) {
  const router = useRouter();

  return (
    <View style={styles.bottomBar}>
      <TabButton
        active={activeTab === 'home'}
        icon="home"
        label="Home"
        onPress={() => router.push('/')}
      />
      <TabButton
        active={activeTab === 'search'}
        icon="search"
        label="Search"
        onPress={() => router.push('/explore')}
      />
      <Pressable style={styles.centerButton} onPress={() => router.push('/tasker/my-accepted')}>
        <MaterialIcons color={taskerColors.white} name="add" size={30} />
      </Pressable>
      <TabButton
        active={activeTab === 'history'}
        icon="history"
        label="History"
        onPress={() => router.push('/tasker/task-history')}
      />
      <TabButton
        active={activeTab === 'profile'}
        icon="person"
        label="Profile"
        onPress={() => router.push('/tasker/profile')}
      />
    </View>
  );
}

function TabButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <MaterialIcons color={active ? taskerColors.primary : taskerColors.muted} name={icon} size={24} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    alignItems: 'center',
    backgroundColor: taskerColors.surface,
    borderTopColor: taskerColors.surfaceContainerHigh,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    height: 78,
    justifyContent: 'space-around',
    left: 0,
    paddingBottom: 8,
    paddingHorizontal: 8,
    position: 'absolute',
    right: 0,
    shadowColor: '#1e293b',
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  centerButton: {
    alignItems: 'center',
    backgroundColor: taskerColors.secondary,
    borderColor: taskerColors.white,
    borderRadius: 28,
    borderWidth: 4,
    height: 56,
    justifyContent: 'center',
    marginTop: -28,
    width: 56,
  },
  tabButton: {
    alignItems: 'center',
    gap: 4,
    minWidth: 54,
  },
  tabLabel: {
    color: taskerColors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: taskerColors.primary,
  },
});
