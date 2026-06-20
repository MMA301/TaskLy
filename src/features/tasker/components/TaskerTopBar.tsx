import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { taskerColors } from '@/src/features/tasker/components/taskerTheme';

type TaskerTopBarProps = {
  title?: string;
  showBack?: boolean;
  rightContent?: ReactNode;
};

export function TaskerTopBar({ rightContent, showBack = false, title }: TaskerTopBarProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      <View style={styles.leftGroup}>
        <Pressable
          onPress={() => (showBack ? router.back() : undefined)}
          style={styles.iconButton}>
          <MaterialIcons
            color={taskerColors.primary}
            name={showBack ? 'arrow-back' : 'menu'}
            size={24}
          />
        </Pressable>
        <Text style={[styles.logoText, title ? styles.titleText : null]}>{title ?? 'Taskly'}</Text>
      </View>
      {rightContent ?? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MD</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: taskerColors.primaryFixed,
    borderColor: taskerColors.primaryContainer,
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: {
    color: taskerColors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  leftGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  logoText: {
    color: taskerColors.primary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  titleText: {
    color: taskerColors.primary,
    fontSize: 22,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: taskerColors.surface,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    marginHorizontal: -16,
    marginTop: -16,
    paddingHorizontal: 16,
  },
});
