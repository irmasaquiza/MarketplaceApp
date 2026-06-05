import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

type StateMessageProps = {
  title: string;
  description?: string;
  loading?: boolean;
  variant?: 'default' | 'error' | 'success';
};

export function StateMessage({
  title,
  description,
  loading = false,
  variant = 'default',
}: StateMessageProps) {
  return (
    <View
      style={[
        styles.container,
        variant === 'error' && styles.error,
        variant === 'success' && styles.success,
      ]}>
      {loading ? <ActivityIndicator size="large" color={Brand.primary} /> : null}
      <ThemedText style={styles.title}>{title}</ThemedText>
      {description ? <ThemedText style={styles.description}>{description}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    borderRadius: CardRadius,
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Brand.textMuted,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
});
