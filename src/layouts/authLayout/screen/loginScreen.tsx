import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockAdminsData, mockClientsData, mockUsersData } from '../../../../mockdata';
import { setAuthSession } from '../../../session';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToTabs = () => router.replace('/(tabs)');

  const handleLogin = () => {
    const txtEmail = email.trim().toLowerCase();
    const txtPassword = password.trim();

    if (!txtEmail || !txtPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    const isAdmin = mockAdminsData.find(
      (admin) =>
        (admin.email?.toLowerCase() === txtEmail ||
          admin.username?.toLowerCase() === txtEmail) &&
        admin.password === txtPassword
    );

    if (isAdmin) {
      setAuthSession({ role: 'admin', account: isAdmin });
      Alert.alert('Thành công', `Chào mừng Admin: ${isAdmin.name || isAdmin.username}!`, [
        { text: 'Vào hệ thống', onPress: goToTabs },
      ]);
      return;
    }

    const isStaff = mockUsersData.find(
      (user) => user.email?.toLowerCase() === txtEmail && user.password === txtPassword
    );

    if (isStaff) {
      setAuthSession({ role: 'staff', account: isStaff });
      Alert.alert('Thành công', `Nhân viên ${isStaff.name} đăng nhập thành công!`, [
        { text: 'Bắt đầu làm việc', onPress: goToTabs },
      ]);
      return;
    }

    const isClient = mockClientsData.find(
      (client) => client.email?.toLowerCase() === txtEmail && client.password === txtPassword
    );

    if (isClient) {
      setAuthSession({ role: 'client', account: isClient });
      Alert.alert('Thành công', `Xin chào đối tác: ${isClient.companyName}!`, [
        { text: 'Vào ứng dụng', onPress: goToTabs },
      ]);
      return;
    }

    Alert.alert('Thất bại', 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1A102F', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFF' }}>TASKLY AUTH</Text>
        <Text style={{ color: '#A78BFA', marginTop: 8 }}>
          Hỗ trợ tài khoản Admin, Nhân viên & Khách hàng
        </Text>
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
        style={{
          backgroundColor: '#8B5CF6',
          paddingVertical: 16,
          borderRadius: 12,
          marginTop: 32,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
          Đăng nhập hệ thống
        </Text>
      </TouchableOpacity>

      <Text style={{ color: '#7B6F96', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
        Admin: quan.va.admin@taskly.com{'\n'}
        Client: contact@techvina.vn{'\n'}
        Mật khẩu: Taskly@123
      </Text>
    </View>
  );
}
