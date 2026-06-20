import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AvatarInitial, SectionTitle, SurfaceCard } from '@/src/features/tasker/components/TaskerCards';
import { TaskerBottomTabBar } from '@/src/features/tasker/components/TaskerBottomTabBar';
import { TaskerLayout } from '@/src/features/tasker/components/TaskerLayout';
import { taskerColors } from '@/src/features/tasker/components/taskerTheme';
import { TaskerTopBar } from '@/src/features/tasker/components/TaskerTopBar';
import { taskerProfileMock } from '@/src/mocks/tasker.mock';

export function TaskerProfileScreen() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(taskerProfileMock.isAvailable);

  return (
    <TaskerLayout bottomBar={<TaskerBottomTabBar activeTab="profile" />}>
      <TaskerTopBar />
      <SurfaceCard style={styles.profileHero}>
        <View style={styles.avatarWrap}>
          <AvatarInitial initials={taskerProfileMock.avatarInitials} size={132} />
          <View style={styles.verifiedBadge}>
            <MaterialIcons color={taskerColors.white} name="verified" size={18} />
          </View>
        </View>
        <View style={styles.profileCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{taskerProfileMock.fullName}</Text>
            <Text style={styles.levelPill}>{taskerProfileMock.title}</Text>
          </View>
          <Text style={styles.bio}>{taskerProfileMock.bio}</Text>
          <View style={styles.statsRow}>
            <ProfileStat label="Cong viec hoan thanh" value={taskerProfileMock.completedTaskCount.toString()} />
            <ProfileStat label="Danh gia trung binh" value={`${taskerProfileMock.ratingAverage}/5`} />
            <ProfileStat label="Ti le phan hoi" value={`${taskerProfileMock.responseRate}%`} />
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle title="Ky nang" />
        <View style={styles.chipWrap}>
          {taskerProfileMock.skills.map((skill) => (
            <Text key={skill} style={styles.skillChip}>{skill}</Text>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle title="Xac thuc" />
        <View style={styles.listStack}>
          {taskerProfileMock.verificationItems.map((item) => (
            <View key={item} style={styles.verificationRow}>
              <MaterialIcons color={taskerColors.primary} name="check-circle" size={22} />
              <Text style={styles.settingTitle}>{item}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <View style={styles.quickGrid}>
        <Pressable onPress={() => router.push('/explore')} style={styles.switchRoleCard}>
          <View>
            <Text style={styles.quickTitle}>Chuyen sang Khach</Text>
            <Text style={styles.quickText}>Tim kiem dich vu khac</Text>
          </View>
          <MaterialIcons color={taskerColors.white} name="swap-horiz" size={30} />
        </Pressable>
        <SurfaceCard style={styles.availabilityCard}>
          <View>
            <Text style={styles.quickTitleDark}>Trang thai ranh</Text>
            <Text style={styles.quickTextDark}>{isAvailable ? 'Dang nhan viec moi' : 'Dang nghi ngoi'}</Text>
          </View>
          <Switch
            onValueChange={setIsAvailable}
            thumbColor={taskerColors.white}
            trackColor={{ false: taskerColors.outline, true: taskerColors.primary }}
            value={isAvailable}
          />
        </SurfaceCard>
      </View>

      <SurfaceCard>
        <SectionTitle title="Cai dat tai khoan" />
        <SettingsItem icon="person-outline" title="Chinh sua ho so ca nhan" />
        <SettingsItem icon="notifications" title="Thong bao" value="Dang bat" />
        <SettingsItem icon="account-balance-wallet" title="Phuong thuc thanh toan" onPress={() => router.push('/tasker/earnings')} />
        <SettingsItem icon="lock" title="Bao mat & Mat khau" />
        <SettingsItem icon="star" title="Danh gia cua toi" onPress={() => router.push('/tasker/reviews')} />
        <SettingsItem icon="event" title="Lich lam viec" onPress={() => router.push('/tasker/schedule')} />
      </SurfaceCard>

      <SurfaceCard style={styles.supportCard}>
        <View style={styles.supportIcon}>
          <MaterialIcons color={taskerColors.primary} name="headset-mic" size={30} />
        </View>
        <View style={styles.supportText}>
          <Text style={styles.quickTitleDark}>Ban can tro giup?</Text>
          <Text style={styles.quickTextDark}>Doi ngu ho tro 24/7 luon san sang giai dap.</Text>
        </View>
        <Pressable style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Lien he</Text>
        </Pressable>
      </SurfaceCard>
    </TaskerLayout>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileStat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsItem({
  icon,
  onPress,
  title,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  title: string;
  value?: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <MaterialIcons color={taskerColors.primary} name={icon} size={22} />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
        <MaterialIcons color={taskerColors.outline} name="chevron-right" size={22} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: 'center', alignSelf: 'center' },
  availabilityCard: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  bio: { color: taskerColors.muted, fontSize: 14, lineHeight: 21 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  levelPill: { alignSelf: 'flex-start', backgroundColor: taskerColors.surfaceContainerHigh, borderRadius: 999, color: taskerColors.primary, fontSize: 12, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 5 },
  listStack: { gap: 12, marginTop: 14 },
  nameRow: { gap: 8 },
  profileCopy: { gap: 12 },
  profileHero: { gap: 18 },
  profileName: { color: taskerColors.text, fontSize: 28, fontWeight: '900' },
  profileStat: { alignItems: 'center', flex: 1 },
  quickGrid: { gap: 12 },
  quickText: { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: '700' },
  quickTextDark: { color: taskerColors.muted, fontSize: 13, fontWeight: '700' },
  quickTitle: { color: taskerColors.white, fontSize: 18, fontWeight: '900' },
  quickTitleDark: { color: taskerColors.text, fontSize: 18, fontWeight: '900' },
  settingIcon: { alignItems: 'center', backgroundColor: taskerColors.primaryFixed, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  settingItem: { alignItems: 'center', borderTopColor: taskerColors.surfaceContainerHigh, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 },
  settingLeft: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 12 },
  settingRight: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  settingTitle: { color: taskerColors.text, flex: 1, fontSize: 15, fontWeight: '800' },
  settingValue: { color: taskerColors.primary, fontSize: 13, fontWeight: '900' },
  skillChip: { backgroundColor: taskerColors.primaryFixed, borderRadius: 10, color: taskerColors.primary, fontSize: 14, fontWeight: '800', paddingHorizontal: 14, paddingVertical: 10 },
  statLabel: { color: taskerColors.muted, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 6 },
  statValue: { color: taskerColors.primary, fontSize: 22, fontWeight: '900' },
  supportButton: { borderColor: taskerColors.primary, borderRadius: 14, borderWidth: 2, paddingHorizontal: 16, paddingVertical: 10 },
  supportButtonText: { color: taskerColors.primary, fontWeight: '900' },
  supportCard: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  supportIcon: { alignItems: 'center', backgroundColor: taskerColors.white, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  supportText: { flex: 1 },
  switchRoleCard: { alignItems: 'center', backgroundColor: taskerColors.primary, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  verificationRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  verifiedBadge: { alignItems: 'center', backgroundColor: taskerColors.primary, borderColor: taskerColors.white, borderRadius: 18, borderWidth: 2, bottom: 4, height: 36, justifyContent: 'center', position: 'absolute', right: 4, width: 36 },
});
