import { Banknote, Briefcase, MoreHorizontal, Package, WalletCards, Wrench, X, ArrowDownRight, CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, MiniBarChart, TaskerCard, TaskerHeader } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

const txIcons: Record<string, TaskerIcon> = {
  cleaning: Briefcase,
  delivery: Package,
  repair: Wrench,
  bank: Banknote,
};

const weekly = [
  { label: 'T2', value: 450 },
  { label: 'T3', value: 720 },
  { label: 'T4', value: 1200, active: true },
  { label: 'T5', value: 380 },
  { label: 'T6', value: 600 },
  { label: 'T7', value: 950 },
  { label: 'CN', value: 210 },
];

export function EarningsDashboardScreen({ onBack }: TaskerScreenProps) {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500000');
  const [selectedBank, setSelectedBank] = useState<string>('Vietcombank - **** 8892');
  const [transactionsList, setTransactionsList] = useState(mockTaskerData.transactions);
  const [balance, setBalance] = useState<string>(mockTaskerData.profile.balance);

  const handleWithdraw = () => {
    const amountNum = parseInt(withdrawAmount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(amountNum) || amountNum < 50000) {
      Alert.alert('Lỗi', 'Số tiền rút tối thiểu là 50.000đ');
      return;
    }

    // Add transaction
    const newTx = {
      id: `tx_${Date.now()}`,
      title: `Rút tiền về ${selectedBank.split(' - ')[0]}`,
      subtitle: `Vừa xong • Yêu cầu rút tiền`,
      amount: `-${amountNum.toLocaleString('vi-VN')}đ`,
      status: 'Đang xử lý',
      type: 'outflow',
      icon: 'bank',
    };

    setTransactionsList([newTx, ...transactionsList]);
    const currentNum = parseInt(balance.replace(/[^0-9]/g, ''), 10) || 15450000;
    const newBalNum = Math.max(0, currentNum - amountNum);
    setBalance(`${newBalNum.toLocaleString('vi-VN')}đ`);

    Alert.alert('Thành công', `Yêu cầu rút ${amountNum.toLocaleString('vi-VN')}đ đã được chuyển tới ngân hàng!`);
    setWithdrawModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader title="Bảng điều khiển thu nhập" subtitle="Chào, Minh Anh" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-28">
        <View className="rounded-xl bg-[#3525CD] p-6 mb-4 overflow-hidden">
          <View className="absolute -right-5 -top-3 opacity-20">
            <WalletCards size={120} color="#FFFFFF" />
          </View>
          <Text className="text-white/80 text-[12px] font-bold uppercase">Tổng số dư</Text>
          <Text className="text-white text-[38px] font-extrabold mt-2">{balance}</Text>
          <Text className="text-white/80 text-[12px] font-medium mt-1">Ví Escrow tạm giữ: {mockTaskerData.profile.escrowBalance || '1.250.000đ'}</Text>
          <View className="flex-row gap-2 mt-5">
            <TouchableOpacity onPress={() => setWithdrawModalVisible(true)} className="bg-white px-4 py-3 rounded-lg flex-row items-center gap-2">
              <Banknote size={18} color={TASKER_COLORS.primary} />
              <Text className="text-[#3525CD] font-bold">Rút tiền ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/20 px-4 py-3 rounded-lg">
              <MoreHorizontal size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-4 mb-5">
          <TaskerCard className="flex-1 p-4">
            <Text className="text-[#464555] text-[12px]">Thu nhập tháng này</Text>
            <Text className="text-[#3525CD] text-[22px] font-extrabold mt-1">+4.2tr</Text>
          </TaskerCard>
          <TaskerCard className="flex-1 p-4">
            <Text className="text-[#464555] text-[12px]">Số việc đã làm</Text>
            <Text className="text-[#831ADA] text-[22px] font-extrabold mt-1">24</Text>
          </TaskerCard>
        </View>

        <View className="mb-5">
          <View className="mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Tổng quan thu nhập tuần</Text>
            <Text className="text-[#464555]">01 Thg 5 - 07 Thg 5, 2024</Text>
          </View>
          <MiniBarChart values={weekly} />
        </View>

        <TaskerCard className="p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#111C2D] text-[20px] font-extrabold">Giao dịch gần đây</Text>
            <Text className="text-[#3525CD] font-bold">Xem tất cả</Text>
          </View>
          {transactionsList.map((tx) => {
            const Icon = txIcons[tx.icon] ?? Briefcase;
            const tone = tx.type === 'outflow' ? 'error' : tx.icon === 'delivery' ? 'secondary' : 'primary';
            return (
              <View key={tx.id} className="flex-row items-center justify-between py-4 border-b border-[#E7EEFF]">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <IconTile icon={Icon} tone={tone} />
                  <View className="flex-1">
                    <Text className="text-[#111C2D] font-bold" numberOfLines={1}>{tx.title}</Text>
                    <Text className="text-[#464555] text-[12px] mt-1" numberOfLines={1}>{tx.subtitle}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`font-extrabold ${tx.type === 'inflow' ? 'text-[#3525CD]' : 'text-[#111C2D]'}`}>{tx.amount}</Text>
                  <Text className={`text-[10px] px-2 py-0.5 rounded mt-1 font-bold ${tx.status === 'Thành công' ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>{tx.status}</Text>
                </View>
              </View>
            );
          })}
        </TaskerCard>
      </ScrollView>

      {/* Payout Withdrawal Modal */}
      <Modal visible={withdrawModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <View className="flex-row items-center gap-2">
                <Banknote size={22} color="#3525CD" />
                <Text className="text-[#111C2D] text-[18px] font-bold">Rút tiền về Tài khoản</Text>
              </View>
              <TouchableOpacity onPress={() => setWithdrawModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 text-xs mb-3">Chọn ngân hàng / Ví điện tử liên kết:</Text>

            {['Vietcombank - **** 8892', 'MB Bank - **** 6612', 'Ví MoMo - 0988***123'].map((bank) => (
              <TouchableOpacity
                key={bank}
                onPress={() => setSelectedBank(bank)}
                className={`p-3 rounded-xl border mb-2 flex-row items-center justify-between ${selectedBank === bank ? 'border-[#3525CD] bg-[#F0F3FF]' : 'border-gray-200'}`}
              >
                <Text className={`font-semibold text-sm ${selectedBank === bank ? 'text-[#3525CD]' : 'text-gray-700'}`}>{bank}</Text>
                {selectedBank === bank ? <CheckCircle2 size={18} color="#3525CD" /> : null}
              </TouchableOpacity>
            ))}

            <Text className="text-gray-600 text-xs mt-3 mb-1">Nhập số tiền muốn rút (VNĐ):</Text>
            <View className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mb-4 flex-row items-center">
              <TextInput
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
                className="flex-1 text-base font-bold text-gray-800"
                placeholder="500000"
              />
              <Text className="text-gray-500 font-bold">VNĐ</Text>
            </View>

            <TouchableOpacity
              onPress={handleWithdraw}
              className="bg-[#3525CD] py-3.5 rounded-xl items-center flex-row justify-center gap-2"
            >
              <ArrowDownRight size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">Xác nhận rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
