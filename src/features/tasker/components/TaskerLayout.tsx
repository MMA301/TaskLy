import type { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { taskerColors } from '@/src/features/tasker/components/taskerTheme';

type TaskerLayoutProps = {
  children: ReactNode;
  bottomBar?: ReactNode;
  fixedFooter?: ReactNode;
  withScroll?: boolean;
};

export function TaskerLayout({
  bottomBar,
  children,
  fixedFooter,
  withScroll = true,
}: TaskerLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {withScroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.staticContent}>{children}</View>
      )}
      {fixedFooter}
      {bottomBar}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: taskerColors.background,
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    padding: 16,
    paddingBottom: 106,
  },
  staticContent: {
    flex: 1,
  },
});
