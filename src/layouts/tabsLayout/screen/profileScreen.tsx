import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminProfileScreen } from '../../../admin';
import { ClientProfileScreen } from '../../../client';
import { clearAuthSession, getAuthSession } from '../../../session';
import { TaskerProfileScreen } from '../../../tasker';

export function ProfileScreen() {
  const router = useRouter();
  const session = getAuthSession();
  const isClient = session?.role === 'client';
  const isStaff = session?.role === 'staff';

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          clearAuthSession();
          router.replace('/login');
        },
      },
    ]);
  };

  if (!session) {
    return (
      <View className="flex-1 bg-[#1A102F] justify-center p-6">
        <Text className="text-white text-2xl font-bold text-center">
          Bạn chưa đăng nhập
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          className="bg-[#8B5CF6] py-3.5 rounded-xl items-center mt-6"
        >
          <Text className="text-white font-bold text-[16px]">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isStaff) {
    return <TaskerProfileScreen />;
  }

  return (
    <SafeAreaView 
      className={`flex-1 px-6 ${isClient ? 'bg-[#FFF7ED]' : 'bg-[#111827]'}`}
      edges={['top', 'left', 'right']}
    >
      {isClient ? (
        <ClientProfileScreen session={session} />
      ) : (
        <AdminProfileScreen session={session} />
      )}

      <TouchableOpacity
        onPress={handleLogout}
        className={`py-4 rounded-xl items-center flex-row justify-center gap-2 border ${isClient ? 'bg-white border-[#FED7AA]' : 'bg-[#1F2937] border-[#374151]'
          }`}
      >
        <View className="mr-1">
          <LogOut size={20} color="#F87171" />
        </View>
        <Text className="text-[#F87171] font-bold text-[16px]">Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
