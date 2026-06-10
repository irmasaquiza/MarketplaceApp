import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Brand, MaxContentWidth, Spacing } from '@/constants/theme';

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  withTabInset?: boolean;
};

export function ScreenContainer({
  children,
  scroll = true,
  withTabInset = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.inner,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + (withTabInset ? BottomTabInset : 0) + Spacing.three,
        },
      ]}>
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {content}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
});
