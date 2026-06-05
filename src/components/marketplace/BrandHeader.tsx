import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';

type BrandHeaderProps = {
  subtitle?: string;
  compact?: boolean;
};

export function BrandHeader({ subtitle, compact = false }: BrandHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.logo, compact && styles.logoCompact]}>
        <ThemedText style={styles.logoText}>NF</ThemedText>
      </View>
      <View>
        <ThemedText style={styles.title}>
          <ThemedText style={styles.titleNavy}>Nacho</ThemedText>
          <ThemedText style={styles.titleGold}> Flights</ThemedText>
        </ThemedText>
        {subtitle ? (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoCompact: {
    width: 56,
    height: 56,
    borderRadius: 18,
  },
  logoText: {
    color: Brand.white,
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  titleNavy: {
    color: Brand.text,
    fontSize: 28,
    fontWeight: '800',
  },
  titleGold: {
    color: Brand.primaryDark,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: Spacing.one,
    textAlign: 'center',
    color: Brand.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
});
