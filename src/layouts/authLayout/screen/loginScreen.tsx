import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Lock, ArrowRight, ChevronDown, ChevronRight, Apple, Globe } from 'lucide-react-native';
import { mockAdminsData, mockClientsData, mockUsersData } from '../../../../mockdata';
import { setAuthSession } from '../../../session';
import { authApi } from '../../../../service/api';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const goToTabs = () => router.replace('/(tabs)');

  const handleLogin = () => {
    const txtEmail = email.trim().toLowerCase();
    const txtPassword = password.trim();

    if (!txtEmail || !txtPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    setIsLoading(true);

    authApi.login({ email: txtEmail, password: txtPassword })
      .then((result: any) => {
        const { user, tokens } = result;

        // Map backend role to frontend role
        let mappedRole: 'admin' | 'staff' | 'client';
        if (user.role === 'admin') {
          mappedRole = 'admin';
        } else if (user.role === 'tasker') {
          mappedRole = 'staff';
        } else {
          mappedRole = 'client';
        }

        const account = {
          id: user._id || user.id,
          name: user.fullName || user.username || user.email,
          email: user.email,
          role: user.role,
          phone: user.phone,
        };

        setAuthSession({
          role: mappedRole,
          account,
          accessToken: tokens.access,
          refreshToken: tokens.refresh
        });

        goToTabs();
      })
      .catch((apiError: any) => {
        // Fallback to local mock data if the user does not exist in backend database
        // This keeps the quick-fill demo buttons working even if database doesn't have the records.
        const isAdmin = mockAdminsData.find(
          (admin) =>
            (admin.email?.toLowerCase() === txtEmail ||
              admin.username?.toLowerCase() === txtEmail) &&
            admin.password === txtPassword
        );

        if (isAdmin) {
          setAuthSession({ role: 'admin', account: isAdmin });
          goToTabs();
          return;
        }

        const isStaff = mockUsersData.find(
          (user) => user.email?.toLowerCase() === txtEmail && user.password === txtPassword
        );

        if (isStaff) {
          setAuthSession({ role: 'staff', account: isStaff });
          goToTabs();
          return;
        }

        const isClient = mockClientsData.find(
          (client) => client.email?.toLowerCase() === txtEmail && client.password === txtPassword
        );

        if (isClient) {
          setAuthSession({ role: 'client', account: isClient });
          goToTabs();
          return;
        }

        setIsLoading(false);
        const errMsg = apiError.message || 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
        Alert.alert('Thất bại', errMsg);
      });
  };

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    if (isLoading) return;
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="py-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Container */}
          <View className="bg-white rounded-2xl border-t-4 border-t-[#4F46E5] mx-5 py-8 px-6 shadow-md shadow-black/5 elevation-3">
            {/* Logo and Headings */}
            <View className="items-center mb-7">
              <Text className="text-3xl font-bold text-[#4F46E5] mb-4 tracking-wider">Taskly</Text>
              <Text className="text-xl font-bold text-[#1F2937] mb-1">Chào mừng bạn trở lại</Text>
              <Text className="text-sm text-[#6B7280] text-center">Đăng nhập để tiếp tục công việc của bạn.</Text>
            </View>

            {/* Email Field */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-[#374151] mb-2">Email/Số điện thoại</Text>
              <View className="flex-row items-center border-[1.5px] border-[#E5E7EB] rounded-lg px-4 h-[52px] bg-white">
                <View className="mr-2.5">
                  <User size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 h-full text-[#1F2937] text-[15px]"
                  placeholder="Nhập email hoặc số điện thoại"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-[#374151]">Mật khẩu</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
                  disabled={isLoading}
                >
                  <Text className="text-[13px] font-semibold text-[#4F46E5]">Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center border-[1.5px] border-[#E5E7EB] rounded-lg px-4 h-[52px] bg-white">
                <View className="mr-2.5">
                  <Lock size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 h-full text-[#1F2937] text-[15px]"
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              className={`h-[52px] rounded-lg flex-row justify-center items-center mt-2.5 relative shadow-md ${
                isLoading 
                  ? 'bg-[#9CA3AF] shadow-none' 
                  : 'bg-[#4F46E5] shadow-[#4F46E5]/20'
              }`}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text className="text-white text-[16px] font-bold">Đăng nhập</Text>
                  <View className="absolute right-[18px]">
                    <ArrowRight size={20} color="#FFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Social Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
              <Text className="mx-3 text-[12px] text-[#9CA3AF] font-semibold">hoặc đăng nhập bằng</Text>
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 flex-row justify-center items-center border-[1.5px] border-[#E5E7EB] rounded-lg h-[48px] bg-white"
                activeOpacity={0.7}
                onPress={() => Alert.alert('Thông báo', 'Đăng nhập Google')}
                disabled={isLoading}
              >
                <View className="mr-2">
                  <Globe size={18} color="#EA4335" />
                </View>
                <Text className="text-[#4B5563] font-semibold text-sm">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 flex-row justify-center items-center border-[1.5px] border-[#E5E7EB] rounded-lg h-[48px] bg-white"
                activeOpacity={0.7}
                onPress={() => Alert.alert('Thông báo', 'Đăng nhập Apple')}
                disabled={isLoading}
              >
                <View className="mr-2">
                  <Apple size={18} color="#000" />
                </View>
                <Text className="text-[#4B5563] font-semibold text-sm">Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Register Footer */}
            <View className="flex-row justify-center items-center mt-7">
              <Text className="text-[13px] text-[#6B7280]">Chưa có tài khoản? </Text>
              <TouchableOpacity 
                onPress={() => Alert.alert('Thông báo', 'Đăng ký tài khoản mới')}
                disabled={isLoading}
              >
                <Text className="text-[13px] font-semibold text-[#4F46E5]">Đăng ký tài khoản mới</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick-fill Demo Account Helper */}
          <View className="mt-6 mx-5 bg-[#F3F4F6] border-[1px] border-[#E5E7EB] border-dashed rounded-lg p-3">
            <TouchableOpacity 
              className="flex-row items-center gap-2"
              onPress={() => !isLoading && setShowDemoAccounts(!showDemoAccounts)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {showDemoAccounts ? (
                <ChevronDown size={18} color="#4F46E5" />
              ) : (
                <ChevronRight size={18} color="#4F46E5" />
              )}
              <Text className="text-[13px] font-semibold text-[#4F46E5]">Tài khoản dùng thử (Nhấn để điền nhanh)</Text>
            </TouchableOpacity>

            {showDemoAccounts && (
              <View className="mt-2.5 border-t border-t-[#E5E7EB] pt-2 gap-1.5">
                <TouchableOpacity 
                  className="flex-row py-1.5 px-2 bg-white rounded-md border border-[#E5E7EB]"
                  onPress={() => fillDemoAccount('customer@taskly.com', 'customerpassword')}
                  disabled={isLoading}
                >
                  <Text className="font-bold text-[12px] text-[#374151] w-[80px]">Khách hàng:</Text>
                  <Text className="text-[12px] text-[#4B5563]">customer@taskly.com (customerpassword)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row py-1.5 px-2 bg-white rounded-md border border-[#E5E7EB]"
                  onPress={() => fillDemoAccount('tasker@taskly.com', 'taskerpassword')}
                  disabled={isLoading}
                >
                  <Text className="font-bold text-[12px] text-[#374151] w-[80px]">Người làm:</Text>
                  <Text className="text-[12px] text-[#4B5563]">tasker@taskly.com (taskerpassword)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row py-1.5 px-2 bg-white rounded-md border border-[#E5E7EB]"
                  onPress={() => fillDemoAccount('admin@taskly.com', 'adminpassword')}
                  disabled={isLoading}
                >
                  <Text className="font-bold text-[12px] text-[#374151] w-[80px]">Admin:</Text>
                  <Text className="text-[12px] text-[#4B5563]">admin@taskly.com (adminpassword)</Text>
                </TouchableOpacity>
                <Text className="text-[11px] text-[#6B7280] italic mt-1 text-center">Mật khẩu tương ứng hiển thị bên cạnh email</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
