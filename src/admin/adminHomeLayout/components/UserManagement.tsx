import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Search, UserPlus, X, Trash2 } from 'lucide-react-native';

export type UserItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'staff_operator' | 'staff_support' | 'staff_technician' | 'client' | 'custom_helper' | string;
  roleLabel: string;
  status: 'active' | 'busy' | 'suspended' | string;
  avatar: string;
};

type UserManagementProps = {
  users: UserItem[];
  onAddUser: (user: Omit<UserItem, 'id' | 'avatar'>) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onDeleteUser: (id: string) => void;
};

export function UserManagement({ users, onAddUser, onUpdateStatus, onDeleteUser }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'staff' | 'client'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'busy' | 'suspended'>('All');
  
  // Add User Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('client');
  const [newStatus, setNewStatus] = useState('active');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'staff_operator':
      case 'staff_support':
      case 'staff_technician':
      case 'custom_helper':
        return 'Người giúp việc';
      case 'client':
        return 'Khách hàng';
      default:
        return 'Người dùng';
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
      
    const isStaffType = user.role.startsWith('staff') || user.role === 'custom_helper';
    const matchesRole = 
      roleFilter === 'All' ||
      (roleFilter === 'staff' && isStaffType) ||
      (roleFilter === 'client' && user.role === 'client');

    const matchesStatus = 
      statusFilter === 'All' || 
      user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginated users
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddSubmit = () => {
    if (!newName.trim() || !newEmail.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền tên và email!');
      return;
    }

    onAddUser({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim(),
      role: newRole,
      roleLabel: getRoleLabel(newRole),
      status: newStatus,
    });

    // Reset fields
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('client');
    setNewStatus('active');
    setModalVisible(false);
    
    Alert.alert('Thành công', 'Đã thêm người dùng mới thành công.');
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Xóa người dùng',
      `Bạn có chắc chắn muốn xóa người dùng "${name}" khỏi hệ thống?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            onDeleteUser(id);
            Alert.alert('Thành công', 'Đã xóa người dùng.');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500';
      case 'suspended':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10 gap-5"
    >
      {/* Header and Add button */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="mb-4">
          <Text className="text-[17px] font-bold text-slate-800">Quản lý người dùng</Text>
          <Text className="text-[12px] text-slate-400 mt-0.5">Danh sách tất cả người dùng, cộng tác viên trên hệ thống.</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-purple-600 rounded-xl py-3 flex-row items-center justify-center gap-2 shadow-sm shadow-purple-600/10"
        >
          <UserPlus size={16} color="#FFF" />
          <Text className="text-white font-bold text-sm">Thêm người dùng</Text>
        </TouchableOpacity>
      </View>

      {/* Filters and search box */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50 gap-4">
        {/* Search bar */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3 h-11">
          <Search size={18} color="#94A3B8" />
          <TextInput
            className="flex-1 h-full text-slate-800 text-[13px] ml-2 font-medium"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Dropdown select simulation */}
        <View className="flex-row gap-3">
          {/* Role Filter */}
          <View className="flex-1 gap-1">
            <Text className="text-slate-400 text-[10px] font-bold">VAI TRÒ</Text>
            <View className="flex-row border border-slate-200 rounded-xl overflow-hidden h-9">
              {(['All', 'staff', 'client'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => {
                    setRoleFilter(r);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 items-center justify-center ${
                    roleFilter === r ? 'bg-purple-600' : 'bg-white'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${
                    roleFilter === r ? 'text-white' : 'text-slate-600'
                  }`}>
                    {r === 'All' ? 'Tất cả' : r === 'staff' ? 'Tasker' : 'K.Hàng'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View className="flex-1 gap-1">
            <Text className="text-slate-400 text-[10px] font-bold">TRẠNG THÁI</Text>
            <View className="flex-row border border-slate-200 rounded-xl overflow-hidden h-9">
              {(['All', 'active', 'suspended'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => {
                    setStatusFilter(s);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 items-center justify-center ${
                    statusFilter === s ? 'bg-purple-600' : 'bg-white'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${
                    statusFilter === s ? 'text-white' : 'text-slate-600'
                  }`}>
                    {s === 'All' ? 'Tất cả' : s === 'active' ? 'Mở' : 'Khóa'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Users list */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <Text className="text-[15px] font-bold text-slate-800 mb-4">
          Kết quả ({filteredUsers.length})
        </Text>

        {paginatedUsers.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-slate-400 text-sm">Không tìm thấy người dùng phù hợp.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {paginatedUsers.map((user) => (
              <View 
                key={user.id} 
                className="flex-row items-center justify-between py-2 border-b border-b-slate-50 pb-4"
              >
                {/* Info block */}
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className="relative">
                    <Image 
                      source={{ uri: user.avatar }}
                      className="w-12 h-12 rounded-full bg-slate-100"
                    />
                    {/* Status dot indicator */}
                    <View className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute bottom-0 right-0 ${getStatusColor(user.status)}`} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold text-[14px]">{user.name}</Text>
                    <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>{user.email}</Text>
                    
                    {/* Role badge */}
                    <View className="flex-row mt-1">
                      <View className={`px-2 py-0.5 rounded-full border ${
                        user.role === 'client' 
                          ? 'bg-amber-50 border-amber-100' 
                          : 'bg-purple-50 border-purple-100'
                      }`}>
                        <Text className={`text-[9px] font-extrabold ${
                          user.role === 'client' ? 'text-amber-600' : 'text-purple-600'
                        }`}>{user.roleLabel}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions / Change Status block */}
                <View className="flex-row items-center gap-2">
                  {/* Status Toggle Quick Trigger */}
                  <TouchableOpacity
                    onPress={() => {
                      const next = user.status === 'active' ? 'suspended' : 'active';
                      onUpdateStatus(user.id, next);
                    }}
                    className={`px-2 py-1 rounded-md border ${
                      user.status === 'active' 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <Text className={`text-[10px] font-bold ${
                      user.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {user.status === 'active' ? 'Đang Mở' : 'Đã Khóa'}
                    </Text>
                  </TouchableOpacity>

                  {/* Delete button */}
                  <TouchableOpacity 
                    onPress={() => confirmDelete(user.id, user.name)}
                    className="p-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-100"
                  >
                    <Trash2 size={13} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <View className="flex-row justify-center items-center gap-2 mt-5">
            <TouchableOpacity 
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`w-8 h-8 rounded-lg items-center justify-center border border-slate-200 ${
                currentPage === 1 ? 'opacity-40 bg-slate-50' : 'bg-white'
              }`}
            >
              <Text className="text-slate-500 font-bold text-xs">&lt;</Text>
            </TouchableOpacity>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity
                key={page}
                onPress={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg items-center justify-center border ${
                  currentPage === page 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  currentPage === page ? 'text-white' : 'text-slate-600'
                }`}>{page}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`w-8 h-8 rounded-lg items-center justify-center border border-slate-200 ${
                currentPage === totalPages ? 'opacity-40 bg-slate-50' : 'bg-white'
              }`}
            >
              <Text className="text-slate-500 font-bold text-xs">&gt;</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center pb-2 border-b border-b-slate-100">
              <Text className="text-lg font-bold text-slate-800">Thêm người dùng mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                <Text className="text-slate-400 font-bold text-lg">×</Text>
              </TouchableOpacity>
            </View>

            {/* Form Name */}
            <View className="gap-1">
              <Text className="text-slate-500 text-xs font-semibold">Họ và Tên</Text>
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-[13px] font-medium bg-white"
                placeholder="Nhập họ và tên"
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            {/* Form Email */}
            <View className="gap-1">
              <Text className="text-slate-500 text-xs font-semibold">Email</Text>
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-[13px] font-medium bg-white"
                placeholder="Nhập địa chỉ email"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Form Phone */}
            <View className="gap-1">
              <Text className="text-slate-500 text-xs font-semibold">Số điện thoại</Text>
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-[13px] font-medium bg-white"
                placeholder="Nhập số điện thoại"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Form Role Selector */}
            <View className="gap-1">
              <Text className="text-slate-500 text-xs font-semibold">Vai trò</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setNewRole('client')}
                  className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                    newRole === 'client' 
                      ? 'border-purple-600 bg-purple-50/30' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`text-xs font-bold ${
                    newRole === 'client' ? 'text-purple-600' : 'text-slate-600'
                  }`}>Khách hàng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setNewRole('custom_helper')}
                  className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                    newRole === 'custom_helper' 
                      ? 'border-purple-600 bg-purple-50/30' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`text-xs font-bold ${
                    newRole === 'custom_helper' ? 'text-purple-600' : 'text-slate-600'
                  }`}>Tasker (Người làm)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleAddSubmit}
              className="bg-purple-600 rounded-xl py-3.5 items-center justify-center mt-2 shadow-md shadow-purple-600/10"
            >
              <Text className="text-white font-extrabold text-sm">Lưu thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
