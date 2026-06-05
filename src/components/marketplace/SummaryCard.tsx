import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

type SummaryCardProps = {
  title?: string;
  children: ReactNode;
};

export function SummaryCard({ title, children }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      {title ? <ThemedText style={styles.title}>{title}</ThemedText> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
    paddingBottom: Spacing.two,
  },
  content: {
    gap: Spacing.one,
  },
});
