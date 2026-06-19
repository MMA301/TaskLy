import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
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

    setTimeout(() => {
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
      Alert.alert('Thất bại', 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }, 1500);
  };

  const fillDemoAccount = (demoEmail: string) => {
    if (isLoading) return;
    setEmail(demoEmail);
    setPassword('Taskly@123');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Container */}
          <View style={styles.card}>
            {/* Logo and Headings */}
            <View style={styles.headerContainer}>
              <Text style={styles.brandText}>Taskly</Text>
              <Text style={styles.mainTitle}>Chào mừng bạn trở lại</Text>
              <Text style={styles.subTitle}>Đăng nhập để tiếp tục công việc của bạn.</Text>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email/Số điện thoại</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
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
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
                  disabled={isLoading}
                >
                  <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
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
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                  <ArrowRight size={20} color="#FFF" style={styles.arrowIcon} />
                </>
              )}
            </TouchableOpacity>

            {/* Social Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc đăng nhập bằng</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity 
                style={styles.socialButton}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Thông báo', 'Đăng nhập Google')}
                disabled={isLoading}
              >
                <Globe size={18} color="#EA4335" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Thông báo', 'Đăng nhập Apple')}
                disabled={isLoading}
              >
                <Apple size={18} color="#000" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Register Footer */}
            <View style={styles.registerFooter}>
              <Text style={styles.noAccountText}>Chưa có tài khoản? </Text>
              <TouchableOpacity 
                onPress={() => Alert.alert('Thông báo', 'Đăng ký tài khoản mới')}
                disabled={isLoading}
              >
                <Text style={styles.registerText}>Đăng ký tài khoản mới</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick-fill Demo Account Helper */}
          <View style={styles.demoHelperContainer}>
            <TouchableOpacity 
              style={styles.demoCollapseHeader} 
              onPress={() => !isLoading && setShowDemoAccounts(!showDemoAccounts)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {showDemoAccounts ? (
                <ChevronDown size={18} color="#4F46E5" />
              ) : (
                <ChevronRight size={18} color="#4F46E5" />
              )}
              <Text style={styles.demoCollapseTitle}>Tài khoản dùng thử (Nhấn để điền nhanh)</Text>
            </TouchableOpacity>

            {showDemoAccounts && (
              <View style={styles.demoAccountList}>
                <TouchableOpacity 
                  style={styles.demoItem} 
                  onPress={() => fillDemoAccount('quan.va.admin@taskly.com')}
                  disabled={isLoading}
                >
                  <Text style={styles.demoItemRole}>Admin:</Text>
                  <Text style={styles.demoItemEmail}>quan.va.admin@taskly.com</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.demoItem} 
                  onPress={() => fillDemoAccount('contact@techvina.vn')}
                  disabled={isLoading}
                >
                  <Text style={styles.demoItemRole}>Khách hàng:</Text>
                  <Text style={styles.demoItemEmail}>contact@techvina.vn</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.demoItem} 
                  onPress={() => fillDemoAccount('mai.lt@taskly.com')}
                  disabled={isLoading}
                >
                  <Text style={styles.demoItemRole}>Nhân viên:</Text>
                  <Text style={styles.demoItemEmail}>mai.lt@taskly.com</Text>
                </TouchableOpacity>
                <Text style={styles.demoPasswordHint}>Mật khẩu chung: Taskly@123</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopWidth: 5,
    borderTopColor: '#4F46E5', // Purple accent line on top
    marginHorizontal: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    // Shadow / Elevation for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4F46E5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1F2937',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    position: 'absolute',
    right: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 48,
    backgroundColor: '#FFF',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  noAccountText: {
    fontSize: 13,
    color: '#6B7280',
  },
  registerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  demoHelperContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
  },
  demoCollapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoCollapseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  demoAccountList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    gap: 6,
  },
  demoItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoItemRole: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#374151',
    width: 80,
  },
  demoItemEmail: {
    fontSize: 12,
    color: '#4B5563',
  },
  demoPasswordHint: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
});
