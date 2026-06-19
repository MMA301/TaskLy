import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// Import chính xác 3 bộ dữ liệu từ thư mục mockdata ngang hàng với src
import { mockAdminsData, mockUsersData, mockClientsData } from '../../../../mockdata';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const txtEmail = email.trim().toLowerCase();
    const txtPassword = password.trim();

    if (!txtEmail || !txtPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    // 1. Kiểm tra trong danh sách ADMINS
    const isAdmin = mockAdminsData.find(
      (a) => (a.email?.toLowerCase() === txtEmail || a.username?.toLowerCase() === txtEmail) && a.password === txtPassword
    );
    if (isAdmin) {
      Alert.alert('Thành công', `Chào mừng Admin: ${isAdmin.name || isAdmin.username}!`, [
        { text: 'Vào Hệ Thống', onPress: () => router.replace('/(tabs)') } // Sửa route theo app của bạn
      ]);
      return;
    }

    // 2. Kiểm tra trong danh sách USERS (Nhân viên vận hành app)
    const isStaff = mockUsersData.find(
      (u) => u.email?.toLowerCase() === txtEmail && u.password === txtPassword
    );
    if (isStaff) {
      Alert.alert('Thành công', `Nhân viên ${isStaff.name} đăng nhập thành công!`, [
        { text: 'Bắt đầu làm việc', onPress: () => router.replace('/(tabs)') }
      ]);
      return;
    }

    // 3. Kiểm tra trong danh sách CLIENTS (Khách hàng doanh nghiệp)
    const isClient = mockClientsData.find(
      (c) => c.email?.toLowerCase() === txtEmail && c.password === txtPassword
    );
    if (isClient) {
      Alert.alert('Thành công', `Xin chào đối tác: ${isClient.companyName}!`, [
        { text: 'Vào ứng dụng', onPress: () => router.replace('/(tabs)') }
      ]);
      return;
    }

    // 4. Nếu chạy hết cả 3 mảng không khớp tài khoản nào
    Alert.alert('Thất bại', 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1A102F', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFF' }}>TASKLY AUTH</Text>
        <Text style={{ color: '#A78BFA', marginTop: 8 }}>Hỗ trợ tài khoản Admin, Nhân viên & Khách hàng</Text>
      </View>

      <View style={{ gap: 16 }}>
        <View>
          <Text style={{ color: '#DDD', marginBottom: 8 }}>Email / Username</Text>
          <TextInput
            style={{ backgroundColor: '#2A1D45', color: '#FFF', padding: 16, borderRadius: 12 }}
            placeholder="Nhập tài khoản..."
            placeholderTextColor="#7B6F96"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text style={{ color: '#DDD', marginBottom: 8 }}>Mật khẩu</Text>
          <TextInput
            style={{ backgroundColor: '#2A1D45', color: '#FFF', padding: 16, borderRadius: 12 }}
            placeholder="Nhập mật khẩu..."
            placeholderTextColor="#7B6F96"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 12, marginTop: 32, alignItems: 'center' }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Đăng Nhập Hệ Thống</Text>
      </TouchableOpacity>

      <Text style={{ color: '#7B6F96', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
        Demo: hoang.nv@taskly.com{'\n'}Mật khẩu: Taskly@123
      </Text>
    </View>
  );
}