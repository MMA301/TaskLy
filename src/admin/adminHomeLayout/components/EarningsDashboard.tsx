import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { CreditCard, Landmark, ArrowUpRight, ArrowDownLeft, FileText, ChevronRight, TrendingUp } from 'lucide-react-native';

export type TransactionItem = {
  id: string;
  title: string;
  amount: string;
  type: 'inflow' | 'outflow';
  time: string;
  status?: string;
  badge?: string;
};

type EarningsDashboardProps = {
  balance: number;
  transactions: TransactionItem[];
  onWithdraw: (amount: number, bank: string) => void;
};

export function EarningsDashboard({ balance, transactions, onWithdraw }: EarningsDashboardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('Vietcombank');
  
  const handleWithdrawSubmit = () => {
    const amountNum = parseFloat(withdrawAmount.replace(/[^0-9]/g, ''));
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền rút hợp lệ!');
      return;
    }

    if (amountNum > balance) {
      Alert.alert('Lỗi', 'Số dư hiện tại không đủ để thực hiện giao dịch!');
      return;
    }

    onWithdraw(amountNum, selectedBank);
    setWithdrawAmount('');
    setModalVisible(false);
    Alert.alert('Thành công', `Yêu cầu rút ${amountNum.toLocaleString()}đ về ngân hàng ${selectedBank} đã được xử lý.`);
  };

  const revenueData = [
    { day: 'T2', amount: 800 },
    { day: 'T3', amount: 1200 },
    { day: 'T4', amount: 1000 },
    { day: 'T5', amount: 1600 },
    { day: 'T6', amount: 1400 },
    { day: 'T7', amount: 2100 },
    { day: 'CN', amount: 1800 },
  ];
  
  const maxAmount = Math.max(...revenueData.map(d => d.amount));

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10 gap-5"
    >
      {/* Balance Card */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <Text className="text-slate-400 text-xs font-semibold">Số dư hiện tại</Text>
        <Text className="text-[32px] font-extrabold text-slate-800 my-1">{balance.toLocaleString()}đ</Text>

        {/* Client / Tasker Share grid */}
        <View className="flex-row gap-3 my-4">
          <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Text className="text-[11px] font-semibold text-slate-400">Khách hàng</Text>
            <Text className="text-[15px] font-bold text-slate-700 mt-0.5">7.200.000đ</Text>
          </View>
          <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Text className="text-[11px] font-semibold text-slate-400">Tasker nhận</Text>
            <Text className="text-[15px] font-bold text-slate-700 mt-0.5">1.250.000đ</Text>
          </View>
        </View>

        {/* Withdraw button */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-purple-600 rounded-xl py-3.5 items-center justify-center flex-row gap-2 shadow-sm shadow-purple-600/20"
        >
          <Landmark size={18} color="#FFF" />
          <Text className="text-white font-bold text-sm">Rút tiền</Text>
        </TouchableOpacity>
      </View>

      {/* 7-day revenue chart */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-[15px] font-bold text-slate-800">Thu nhập 7 ngày qua</Text>
          <View className="flex-row gap-3 items-center">
            <View className="flex-row items-center gap-1">
              <View className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <Text className="text-[10px] text-slate-500 font-bold">Tổng</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <Text className="text-[10px] text-slate-500 font-bold">Tip</Text>
            </View>
          </View>
        </View>

        {/* Visual Bar Chart */}
        <View className="flex-row justify-between items-end h-[120px] px-2">
          {revenueData.map((item, index) => {
            const barHeight = (item.amount / maxAmount) * 90;
            return (
              <View key={index} className="items-center gap-1.5" style={{ width: '10%' }}>
                <Text className="text-[9px] text-slate-400 font-semibold">{item.amount > 1000 ? `${(item.amount / 1000).toFixed(1)}M` : `${item.amount}k`}</Text>
                {/* Stacked bar or double bar */}
                <View className="w-full gap-0.5">
                  <View 
                    className="w-full bg-purple-600 rounded-t-sm" 
                    style={{ height: `${barHeight * 0.8}%` }} 
                  />
                  <View 
                    className="w-full bg-purple-400 rounded-b-sm" 
                    style={{ height: `${barHeight * 0.2}%` }} 
                  />
                </View>
                <Text className="text-xs text-slate-500 font-medium">{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Allocation Segment */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <Text className="text-[15px] font-bold text-slate-800 mb-4">Phân bổ</Text>
        
        <View className="gap-3">
          {/* Allocation item 1 */}
          <View className="flex-row items-center justify-between py-3 border-b border-b-slate-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center">
                <CreditCard size={20} color="#7C3AED" />
              </View>
              <View>
                <Text className="text-slate-700 text-sm font-bold">Tổng thu nhập</Text>
                <Text className="text-slate-400 text-xs">42 công việc</Text>
              </View>
            </View>
            <Text className="text-slate-800 font-extrabold text-sm">6.800.000đ</Text>
          </View>

          {/* Allocation item 2 */}
          <View className="flex-row items-center justify-between py-3 border-b border-b-slate-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                <FileText size={20} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-slate-700 text-sm font-bold">Tiền Tips</Text>
                <Text className="text-slate-400 text-xs">Từ khách hàng</Text>
              </View>
            </View>
            <Text className="text-slate-800 font-extrabold text-sm">1.250.000đ</Text>
          </View>

          {/* Allocation item 3 */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
                <TrendingUp size={20} color="#D97706" />
              </View>
              <View>
                <Text className="text-slate-700 text-sm font-bold">Thưởng nóng</Text>
                <Text className="text-slate-400 text-xs">Nhiệm vụ tuần</Text>
              </View>
            </View>
            <Text className="text-slate-800 font-extrabold text-sm">400.000đ</Text>
          </View>
        </View>

        <TouchableOpacity className="mt-4 pt-3 border-t border-t-slate-50 flex-row justify-center items-center gap-1">
          <Text className="text-purple-600 font-bold text-xs">Xem chi tiết lịch sử</Text>
          <ChevronRight size={12} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Recent transactions */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
        <Text className="text-[15px] font-bold text-slate-800 mb-4">Giao dịch gần đây</Text>

        {transactions.length === 0 ? (
          <Text className="text-slate-400 text-center py-4">Không có giao dịch nào.</Text>
        ) : (
          <View className="gap-4">
            {transactions.map((tx) => (
              <View key={tx.id} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ${
                    tx.type === 'inflow' ? 'bg-emerald-50' : 'bg-rose-50'
                  }`}>
                    {tx.type === 'inflow' ? (
                      <ArrowDownLeft size={20} color="#10B981" />
                    ) : (
                      <ArrowUpRight size={20} color="#EF4444" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-700 text-sm font-bold" numberOfLines={1}>
                      {tx.title}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <Text className="text-slate-400 text-[11px] font-medium">{tx.time}</Text>
                      {tx.badge && (
                        <View className="bg-purple-50 px-1 rounded">
                          <Text className="text-[9px] font-bold text-purple-600">{tx.badge}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className={`font-extrabold text-sm ${
                    tx.type === 'inflow' ? 'text-emerald-500' : 'text-slate-800'
                  }`}>
                    {tx.type === 'inflow' ? '+' : '-'}{tx.amount}
                  </Text>
                  {tx.status && (
                    <Text className="text-emerald-500 text-[9px] font-bold mt-0.5">{tx.status}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Interactive simulated withdrawal modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center pb-2 border-b border-b-slate-100">
              <Text className="text-lg font-bold text-slate-800">Yêu cầu rút tiền</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                <Text className="text-slate-400 font-bold text-lg">×</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-1">
              <Text className="text-slate-500 text-xs font-semibold">Số tiền muốn rút (đ)</Text>
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-[15px] font-bold"
                placeholder="Nhập số tiền cần rút"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
              <Text className="text-slate-400 text-[11px] mt-1">
                Số dư tối đa khả dụng: <Text className="font-bold text-slate-600">{balance.toLocaleString()}đ</Text>
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-slate-500 text-xs font-semibold">Chọn ngân hàng thụ hưởng</Text>
              <View className="flex-row gap-2">
                {['Vietcombank', 'BIDV', 'Techcombank'].map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    onPress={() => setSelectedBank(bank)}
                    className={`flex-1 py-3 px-2 rounded-xl border items-center justify-center ${
                      selectedBank === bank 
                        ? 'border-purple-600 bg-purple-50/35' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      selectedBank === bank ? 'text-purple-600' : 'text-slate-600'
                    }`}>{bank}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleWithdrawSubmit}
              className="bg-purple-600 rounded-xl py-3.5 items-center justify-center mt-2 shadow-md shadow-purple-600/10"
            >
              <Text className="text-white font-extrabold text-sm">Xác nhận giao dịch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
