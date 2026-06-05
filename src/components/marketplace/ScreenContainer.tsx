import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
    return <View style={styles.root}>{content}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {content}
    </ScrollView>
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
