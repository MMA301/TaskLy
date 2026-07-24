import { Tabs } from 'expo-router';
import { BarChart2, Clock, Home, PlusCircle, Search, User, Wallet } from 'lucide-react-native';
import { getAuthSession } from '../../src/session';

export default function TabsLayout() {
  const session = getAuthSession();
  const isClient = session?.role === 'client';
  const isStaff = session?.role === 'staff';

  const activeTint = isClient ? '#EA580C' : isStaff ? '#3525CD' : '#38BDF8';
  const inactiveTint = isClient ? '#9CA3AF' : isStaff ? '#777587' : '#94A3B8';
  const barBackground = isClient || isStaff ? '#FFFFFF' : '#111827';
  const barBorder = isClient ? '#FED7AA' : isStaff ? '#E7EEFF' : '#374151';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: barBackground,
          borderTopColor: barBorder,
          display: 'flex',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isClient || isStaff ? 'Trang chủ' : 'Quản trị',
          tabBarIcon: ({ color, size }) => (
            isClient || isStaff ? (
              <Home size={size} color={color} />
            ) : (
              <BarChart2 size={size} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm việc',
          href: isStaff ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Ví TaskLy',
          href: undefined,
          tabBarIcon: ({ color, size }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Đăng Task',
          href: isClient ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Hoạt động',
          href: undefined,
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isStaff ? 'Cá nhân' : 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      {/* Hide sub-flow routes from tab bar */}
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="job-details" options={{ href: null }} />
      <Tabs.Screen name="ai-smart-price" options={{ href: null }} />
    </Tabs>
  );
}
