import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AvatarInitial } from '@/src/features/tasker/components/TaskerCards';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';
import { ChatMessage } from '@/src/features/tasker/types/tasker.types';
import { chatMessagesMock, messageTaskMock } from '@/src/mocks/messages.mock';

export function MessagesScreen() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessagesMock);
  const task = messageTaskMock.task;

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages((current) => [
      ...current,
      {
        id: `msg_${Date.now()}`,
        message: inputValue.trim(),
        sender: 'tasker',
        timestamp: 'Vua xong',
      },
    ]);
    setInputValue('');
  };

  return (
    <TaskerLayout
      fixedFooter={
        <View style={styles.inputBar}>
          <Pressable style={styles.attachButton}>
            <MaterialIcons color={taskerColors.muted} name="add-circle-outline" size={28} />
          </Pressable>
          <TextInput
            onChangeText={setInputValue}
            placeholder="Nhap tin nhan..."
            placeholderTextColor={taskerColors.outline}
            style={styles.input}
            value={inputValue}
          />
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <MaterialIcons color={taskerColors.white} name="send" size={22} />
          </Pressable>
        </View>
      }
      withScroll={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.headerIcon}>
            <MaterialIcons color={taskerColors.primary} name="arrow-back" size={24} />
          </Pressable>
          <AvatarInitial initials={messageTaskMock.customerInitials} />
          <View>
            <Text style={styles.customerName}>{messageTaskMock.customerName}</Text>
            <Text style={styles.partnerLabel}>Doi tac Taskly</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <MaterialIcons color={taskerColors.muted} name="call" size={23} />
          <MaterialIcons color={taskerColors.muted} name="more-vert" size={23} />
        </View>
      </View>

      <View style={styles.taskMiniCard}>
        <View style={styles.taskIcon}>
          <MaterialIcons color={taskerColors.primary} name="cleaning-services" size={24} />
        </View>
        <View style={styles.taskMiniText}>
          <Text style={styles.taskMiniTitle}>{task.title}</Text>
          <Text style={styles.taskMiniMeta}>{task.scheduledDateLabel}, {task.scheduledTime}</Text>
        </View>
        <View style={styles.taskAmountBlock}>
          <Text style={styles.taskAmount}>{formatCurrency(task.budget)}d</Text>
          <Text style={styles.pendingBadge}>DANG CHO</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.datePill}>HOM NAY</Text>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>
    </TaskerLayout>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isTasker = message.sender === 'tasker';

  return (
    <View style={[styles.messageRow, isTasker && styles.messageRowRight]}>
      {!isTasker ? <AvatarInitial initials="TV" size={32} /> : null}
      <View style={[styles.messageBlock, isTasker && styles.messageBlockRight]}>
        <View style={[styles.bubble, isTasker ? styles.taskerBubble : styles.customerBubble]}>
          {message.imageLabel ? <View style={styles.imageMock}><Text style={styles.imageText}>{message.imageLabel}</Text></View> : null}
          <Text style={[styles.messageText, isTasker && styles.taskerMessageText]}>{message.message}</Text>
        </View>
        <Text style={[styles.timestamp, isTasker && styles.timestampRight]}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  attachButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  bubble: { borderRadius: 20, maxWidth: '100%', padding: 14 },
  chatContent: { gap: 14, padding: 16, paddingBottom: 112 },
  customerBubble: { backgroundColor: taskerColors.white, borderBottomLeftRadius: 4, borderColor: taskerColors.surfaceContainerHigh, borderWidth: 1 },
  customerName: { color: taskerColors.text, fontSize: 14, fontWeight: '900' },
  datePill: { alignSelf: 'center', backgroundColor: taskerColors.surfaceContainer, borderRadius: 999, color: taskerColors.outline, fontSize: 12, fontWeight: '900', paddingHorizontal: 16, paddingVertical: 5 },
  header: { alignItems: 'center', backgroundColor: taskerColors.surface, flexDirection: 'row', height: 64, justifyContent: 'space-between', paddingHorizontal: 16 },
  headerActions: { flexDirection: 'row', gap: 16 },
  headerIcon: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  headerLeft: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  imageMock: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 14, height: 150, justifyContent: 'center', marginBottom: 8 },
  imageText: { color: taskerColors.primary, fontWeight: '900' },
  input: { backgroundColor: taskerColors.surfaceContainer, borderRadius: 22, color: taskerColors.text, flex: 1, height: 44, paddingHorizontal: 16 },
  inputBar: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderTopColor: taskerColors.surfaceContainerHigh, borderTopWidth: 1, bottom: 0, flexDirection: 'row', gap: 8, left: 0, padding: 16, position: 'absolute', right: 0 },
  messageBlock: { maxWidth: '75%' },
  messageBlockRight: { alignItems: 'flex-end' },
  messageRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 8 },
  messageRowRight: { flexDirection: 'row-reverse' },
  messageText: { color: taskerColors.text, fontSize: 15, lineHeight: 22 },
  partnerLabel: { color: taskerColors.primary, fontSize: 10, fontWeight: '900' },
  pendingBadge: { backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 999, color: taskerColors.muted, fontSize: 10, fontWeight: '900', marginTop: 2, paddingHorizontal: 8, paddingVertical: 2 },
  sendButton: { alignItems: 'center', backgroundColor: taskerColors.primary, borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  taskAmount: { color: taskerColors.primary, fontWeight: '900' },
  taskAmountBlock: { alignItems: 'flex-end' },
  taskIcon: { alignItems: 'center', backgroundColor: taskerColors.primaryFixed, borderRadius: 12, height: 48, justifyContent: 'center', width: 48 },
  taskMiniCard: { alignItems: 'center', backgroundColor: taskerColors.surfaceContainer, borderColor: 'rgba(216,227,251,0.3)', borderRadius: 18, flexDirection: 'row', gap: 12, margin: 16, marginBottom: 0, padding: 14 },
  taskMiniMeta: { color: taskerColors.muted, fontSize: 12, fontWeight: '700' },
  taskMiniText: { flex: 1 },
  taskMiniTitle: { color: taskerColors.text, fontSize: 14, fontWeight: '900' },
  taskerBubble: { backgroundColor: taskerColors.primary, borderBottomRightRadius: 4 },
  taskerMessageText: { color: taskerColors.white },
  timestamp: { color: taskerColors.outline, fontSize: 10, marginLeft: 4, marginTop: 4 },
  timestampRight: { marginRight: 4 },
});
