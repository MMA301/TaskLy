import { Bell, Briefcase, CheckCheck, MessageCircle, Settings, WalletCards } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockTaskerData } from '../../../../mockdata';
import { IconTile, TaskerCard, TaskerHeader, TaskerPill } from '../../taskerHomeLayout/components/TaskerPrimitives';
import type { TaskerIcon, TaskerScreenProps } from '../../types';

const notificationIcons: Record<string, { icon: TaskerIcon; tone: 'primary' | 'secondary' | 'tertiary' | 'neutral' }> = {
  work: { icon: Briefcase, tone: 'primary' },
  message: { icon: MessageCircle, tone: 'secondary' },
  wallet: { icon: WalletCards, tone: 'tertiary' },
  settings: { icon: Settings, tone: 'neutral' },
};

export function NotificationsScreen({ onBack }: TaskerScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]" edges={["top"]}>
      <TaskerHeader
        title="Thông báo"
        subtitle="Cập nhật hoạt động mới nhất"
        onBack={onBack}
        right={
          <TouchableOpacity className="flex-row items-center gap-2">
            <CheckCheck size={16} color="#3525CD" />
            <Text className="text-[#3525CD] text-[12px] font-bold">Đánh dấu đã đọc</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pt-6 pb-28">
        <View className="mb-6">
          <Text className="text-[#111C2D] text-[30px] font-extrabold">Thông báo</Text>
          <Text className="text-[#464555] mt-1">Cập nhật những hoạt động mới nhất của bạn</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 mb-6">
          <TaskerPill>Tất cả</TaskerPill>
          <TaskerPill tone="neutral">Công việc</TaskerPill>
          <TaskerPill tone="neutral">Thanh toán</TaskerPill>
          <TaskerPill tone="neutral">Tin nhắn</TaskerPill>
        </ScrollView>
        <Text className="text-[#777587] text-[12px] font-bold uppercase mb-3">Công việc</Text>
        <View className="gap-4 mb-7">
          {mockTaskerData.notifications.slice(0, 2).map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>
        <Text className="text-[#777587] text-[12px] font-bold uppercase mb-3">Chung</Text>
        <View className="gap-4">
          {mockTaskerData.notifications.slice(2).map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>
        <TaskerCard className="mt-8 p-8 items-center bg-[#F0F3FF]">
          <Bell size={42} color="#777587" />
          <Text className="text-[#111C2D] text-[18px] font-extrabold mt-4">Mọi thứ đều yên tĩnh</Text>
          <Text className="text-[#464555] text-center mt-2">Empty state mẫu từ Stitch khi chưa có thông báo mới.</Text>
        </TaskerCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({ item }: { item: typeof mockTaskerData.notifications[number] }) {
  const meta = notificationIcons[item.type] ?? notificationIcons.settings;
  return (
    <TaskerCard className={`p-4 ${item.unread ? '' : 'opacity-70'}`}>
      <View className="flex-row items-start gap-3">
        <IconTile icon={meta.icon} tone={meta.tone} />
        <View className="flex-1">
          <View className="flex-row justify-between items-start gap-2">
            <Text className="text-[#111C2D] font-bold flex-1">{item.title}</Text>
            <Text className="text-[#777587] text-[11px]">{item.time}</Text>
          </View>
          <Text className="text-[#464555] mt-1 leading-5">{item.body}</Text>
          {item.tags.length > 0 ? (
            <View className="flex-row gap-2 mt-3">
              {item.tags.map((tag) => (
                <TaskerPill key={tag} tone="neutral">{tag}</TaskerPill>
              ))}
            </View>
          ) : null}
        </View>
        {item.unread ? <View className="w-2 h-2 rounded-full bg-[#3525CD] mt-2" /> : null}
      </View>
    </TaskerCard>
  );
}
