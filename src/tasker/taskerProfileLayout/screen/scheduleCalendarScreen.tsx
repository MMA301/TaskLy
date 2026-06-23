import { CalendarCheck, ChevronLeft, ChevronRight, Clock, MapPin, WalletCards } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTaskerData } from '../../../../mockdata';
import { GradientButton, IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import { TASKER_COLORS } from '../../taskerTheme';
import type { TaskerScreenProps } from '../../types';

const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const calendarCells = ['25', '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '23', '24', '25', '26', '27', '28', '29'];

export function ScheduleCalendarScreen({ onBack }: TaskerScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F9FF]">
      <TaskerHeader
        title="Lịch Trình"
        subtitle="Quản lý lịch rảnh"
        onBack={onBack}
        right={
          <TouchableOpacity className="bg-[#4F46E5] rounded-full px-3 py-2 flex-row items-center gap-2">
            <CalendarCheck size={16} color="#FFFFFF" />
            <Text className="text-white text-[12px] font-bold">Quản lý</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-5 pb-10">
        <TaskerCard className="p-5 mb-5">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[#111C2D] text-[22px] font-extrabold">Tháng 10, 2023</Text>
              <Text className="text-[#464555] mt-1">Hôm nay là Thứ Tư, ngày 25</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="w-9 h-9 rounded-lg border border-[#C7C4D8] items-center justify-center">
                <ChevronLeft size={18} color="#464555" />
              </TouchableOpacity>
              <TouchableOpacity className="w-9 h-9 rounded-lg border border-[#C7C4D8] items-center justify-center">
                <ChevronRight size={18} color="#464555" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-row mb-2">
            {days.map((day) => (
              <Text key={day} className={`flex-1 text-center text-[12px] font-bold ${day === 'T4' ? 'text-[#3525CD]' : day === 'T7' || day === 'CN' ? 'text-[#BA1A1A]' : 'text-[#777587]'}`}>
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {calendarCells.map((day, index) => {
              const active = index === 16;
              const muted = index < 6;
              const marked = ['2', '4', '24'].includes(day);
              return (
                <View key={`${day}-${index}`} className="w-[14.285%] aspect-square p-1">
                  <View className={`flex-1 rounded-xl items-center justify-center ${active ? 'bg-[#3525CD]' : ''}`}>
                    <Text className={`${active ? 'text-white text-[20px] font-extrabold' : muted ? 'text-[#C7C4D8]' : 'text-[#111C2D]'}`}>{day}</Text>
                    {marked && !active ? <View className="w-1 h-1 bg-[#3525CD] rounded-full mt-1" /> : null}
                  </View>
                </View>
              );
            })}
          </View>
        </TaskerCard>

        <View className="flex-row gap-4 mb-5">
          <TaskerCard className="flex-1 p-4">
            <View className="flex-row items-center gap-3">
              <IconTile icon={Clock} />
              <View className="flex-1">
                <Text className="text-[#464555] text-[12px]">Tổng thời gian làm</Text>
                <Text className="text-[#3525CD] text-[20px] font-extrabold">32h / tuần</Text>
              </View>
            </View>
          </TaskerCard>
          <TaskerCard className="flex-1 p-4">
            <View className="flex-row items-center gap-3">
              <IconTile icon={WalletCards} tone="secondary" />
              <View className="flex-1">
                <Text className="text-[#464555] text-[12px]">Thu nhập dự kiến</Text>
                <Text className="text-[#831ADA] text-[20px] font-extrabold">4.200.000đ</Text>
              </View>
            </View>
          </TaskerCard>
        </View>

        <TaskerCard className="overflow-hidden">
          <View className="p-5 border-b border-[#E7EEFF] flex-row items-center justify-between">
            <Text className="text-[#111C2D] text-[21px] font-extrabold">Chương trình ngày</Text>
            <TaskerPill tone="neutral">3 Công việc</TaskerPill>
          </View>
          <View className="p-5">
            {mockTaskerData.schedule.map((item) => (
              <View key={item.id} className="flex-row gap-4 mb-5">
                <View className="items-center">
                  <Text className="text-[#777587] text-[12px] font-bold">{item.time}</Text>
                  <View className="w-[2px] flex-1 bg-[#DEE8FF] mt-2" />
                </View>
                <View className={`flex-1 rounded-xl p-4 ${item.tone === 'empty' ? 'border-2 border-dashed border-[#C7C4D8] items-center' : 'bg-[#E7EEFF] border-l-4'}`}>
                  {item.tone === 'empty' ? (
                    <>
                      <Text className="text-[#464555] font-bold">{item.title}</Text>
                      <Text className="text-[#3525CD] font-extrabold mt-2">{item.price}</Text>
                    </>
                  ) : (
                    <>
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-[#111C2D] font-extrabold flex-1">{item.title}</Text>
                        <Text className={`${item.tone === 'secondary' ? 'text-[#831ADA]' : 'text-[#3525CD]'} font-bold`}>{item.price}</Text>
                      </View>
                      <View className="flex-row items-center gap-1 mb-3">
                        <MapPin size={14} color={TASKER_COLORS.muted} />
                        <Text className="text-[#464555] text-[12px] flex-1">{item.location}</Text>
                      </View>
                      <Text className={`${item.tone === 'secondary' ? 'text-[#831ADA]' : 'text-[#3525CD]'} text-[12px] font-bold text-right`}>Chi tiết →</Text>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View className="p-5 bg-[#F0F3FF]">
            <GradientButton>
              <Text className="text-white text-[18px] font-extrabold">Quản lý lịch rảnh</Text>
            </GradientButton>
          </View>
        </TaskerCard>
      </ScrollView>
    </View>
  );
}
