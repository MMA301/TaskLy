import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { getAuthSession } from '../../src/session';

export default function TabsLayout() {
  const session = getAuthSession();
  const isClient = session?.role === 'client';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isClient ? '#EA580C' : '#38BDF8',
        tabBarInactiveTintColor: isClient ? '#9CA3AF' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isClient ? '#FFFFFF' : '#111827',
          borderTopColor: isClient ? '#FED7AA' : '#374151',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isClient ? 'Dự án' : 'Quản trị',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isClient ? 'briefcase' : 'analytics'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isClient ? 'business' : 'person'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
