import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1A102F' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64, gap: 16 }}>
        <View>
          <Text style={{ color: '#A78BFA', fontSize: 16 }}>Chào mừng trở lại</Text>
          <Text style={{ color: '#FFF', fontSize: 28, fontWeight: 'bold' }}>Taskly</Text>
        </View>

        <View
          style={{
            backgroundColor: '#2A1D45',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#8B5CF6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark-done" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              Công việc hôm nay
            </Text>
            <Text style={{ color: '#A78BFA', fontSize: 13, marginTop: 4 }}>
              Chưa có dữ liệu công việc nào
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#2A1D45',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#8B5CF6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Thông báo</Text>
            <Text style={{ color: '#A78BFA', fontSize: 13, marginTop: 4 }}>
              Không có thông báo mới
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
