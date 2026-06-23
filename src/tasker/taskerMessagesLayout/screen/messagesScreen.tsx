import { CheckCheck, MoreVertical, Phone, PlusCircle, Send, Smile } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS, taskerShadow } from '../../taskerTheme';
import type { TaskerScreenProps } from '../../types';

export function MessagesScreen({ onBack }: TaskerScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader
        title="Nguyen Minh Duc"
        subtitle="Đối tác Taskly"
        onBack={onBack}
        right={
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-white">
              <Phone size={19} color={TASKER_COLORS.muted} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-white">
              <MoreVertical size={19} color={TASKER_COLORS.muted} />
            </TouchableOpacity>
          </View>
        }
      />
      <View className="px-4 pt-4">
        <TaskerCard className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <IconTile icon={CheckCheck} />
              <View className="flex-1">
                <Text className="text-[#111C2D] font-bold">Dọn dẹp căn hộ 2 phòng ngủ</Text>
                <Text className="text-[#464555] text-[12px] mt-1">Hôm nay, 14:00</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#3525CD] font-extrabold">500.000đ</Text>
              <Text className="text-[10px] bg-[#DEE8FF] text-[#464555] px-2 py-0.5 rounded-full mt-1 font-bold">ĐANG CHỜ</Text>
            </View>
          </View>
        </TaskerCard>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 py-4 pb-5">
        <View className="items-center my-4">
          <Text className="text-[12px] font-bold px-4 py-1 rounded-full bg-[#E7EEFF] text-[#777587]">HÔM NAY</Text>
        </View>
        {mockTaskerData.messages.map((message) => (
          <View key={message.id} className={`mb-4 ${message.from === 'tasker' ? 'items-end' : 'items-start'}`}>
            <View className={`max-w-[82%] ${message.from === 'tasker' ? 'items-end' : 'items-start'}`}>
              <View
                className={`p-4 shadow-sm ${
                  message.from === 'tasker'
                    ? 'bg-[#3525CD] rounded-2xl rounded-br-none'
                    : 'bg-white border border-[#D8E3FB] rounded-2xl rounded-bl-none'
                }`}
                style={message.from === 'tasker' ? taskerShadow : undefined}
              >
                <Text className={`${message.from === 'tasker' ? 'text-white' : 'text-[#111C2D]'} leading-6`}>
                  {message.text}
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-[10px] text-[#777587]">{message.time}</Text>
                {message.from === 'tasker' ? <CheckCheck size={12} color={TASKER_COLORS.primary} /> : null}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="bg-white/95 px-4 pt-3 pb-6 border-t border-[#E7EEFF]">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="w-12 h-12 rounded-full items-center justify-center">
            <PlusCircle size={24} color={TASKER_COLORS.muted} />
          </TouchableOpacity>
          <View className="flex-1 h-12 rounded-full bg-[#E7EEFF] flex-row items-center px-4">
            <TextInput
              className="flex-1 text-[#111C2D]"
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#777587"
            />
            <Smile size={20} color={TASKER_COLORS.muted} />
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-full bg-[#3525CD] items-center justify-center" style={taskerShadow}>
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
