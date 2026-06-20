import { MaterialIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { taskerColors, formatCurrency } from '@/src/features/tasker/components/taskerTheme';

export function SurfaceCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  return <View style={[styles.surfaceCard, style]}>{children}</View>;
}

export function GradientCard({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.gradientCard, style]}>{children}</View>;
}

export function SectionTitle({ subtitle, title }: { subtitle?: string; title: string }) {
  return (
    <View style={styles.sectionTitleBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function AvatarInitial({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <View style={[styles.avatar, { borderRadius: size / 2, height: size, width: size }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export function CategoryBadge({ label }: { label: string }) {
  return (
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>{label}</Text>
    </View>
  );
}

export function StatusBadge({
  tone = 'primary',
  label,
}: {
  tone?: 'primary' | 'secondary' | 'success' | 'error' | 'muted';
  label: string;
}) {
  const styleByTone = {
    error: styles.badgeError,
    muted: styles.badgeMuted,
    primary: styles.badgePrimary,
    secondary: styles.badgeSecondary,
    success: styles.badgeSuccess,
  }[tone];

  return (
    <View style={[styles.statusBadge, styleByTone]}>
      <Text style={[styles.statusText, tone === 'error' && styles.statusTextError]}>{label}</Text>
    </View>
  );
}

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons color={taskerColors.muted} name={icon} size={18} />
      <View style={styles.infoTextBlock}>
        {label ? <Text style={styles.infoLabel}>{label}</Text> : null}
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(progress, 100))}%` }]} />
    </View>
  );
}

export function PrimaryButton({
  icon,
  label,
  onPress,
}: {
  icon?: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      {icon ? <MaterialIcons color={taskerColors.white} name={icon} size={20} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({
  icon,
  label,
  onPress,
}: {
  icon?: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.outlineButton}>
      {icon ? <MaterialIcons color={taskerColors.primary} name={icon} size={20} /> : null}
      <Text style={styles.outlineButtonText}>{label}</Text>
    </Pressable>
  );
}

export function AmountText({ amount, muted = false }: { amount: number; muted?: boolean }) {
  const prefix = amount > 0 ? '+' : '';
  return (
    <Text style={[styles.amountText, muted && styles.amountMuted]}>
      {prefix}
      {formatCurrency(amount)}d
    </Text>
  );
}

const styles = StyleSheet.create({
  amountMuted: {
    color: taskerColors.muted,
    textDecorationLine: 'line-through',
  },
  amountText: {
    color: taskerColors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: taskerColors.primaryFixed,
    justifyContent: 'center',
  },
  avatarText: {
    color: taskerColors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  badgeError: {
    backgroundColor: taskerColors.errorContainer,
  },
  badgeMuted: {
    backgroundColor: taskerColors.surfaceContainerHigh,
  },
  badgePrimary: {
    backgroundColor: taskerColors.primaryFixed,
  },
  badgeSecondary: {
    backgroundColor: taskerColors.secondaryFixed,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: taskerColors.primaryFixed,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: {
    color: taskerColors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  gradientCard: {
    backgroundColor: taskerColors.primary,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  infoLabel: {
    color: taskerColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  infoTextBlock: {
    flex: 1,
  },
  infoValue: {
    color: taskerColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    alignItems: 'center',
    borderColor: taskerColors.primary,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  outlineButtonText: {
    color: taskerColors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: taskerColors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: taskerColors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  progressFill: {
    backgroundColor: taskerColors.secondary,
    borderRadius: 999,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: taskerColors.surfaceContainerHigh,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  sectionSubtitle: {
    color: taskerColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: taskerColors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionTitleBlock: {
    gap: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: taskerColors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  statusTextError: {
    color: taskerColors.error,
  },
  surfaceCard: {
    backgroundColor: taskerColors.card,
    borderColor: 'rgba(199,196,216,0.5)',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
});
