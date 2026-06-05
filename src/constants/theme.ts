import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  primary: '#D71920',
  primaryDark: '#B9151B',
  primaryDarker: '#8F1116',
  background: '#FFF7F7',
  surface: '#FFFFFF',
  border: '#F3D6D8',
  borderLight: '#FECACA',
  inputBg: '#FEF2F2',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
} as const;

export const Colors = {
  light: {
    text: Brand.text,
    background: Brand.background,
    backgroundElement: Brand.surface,
    backgroundSelected: Brand.inputBg,
    textSecondary: Brand.textMuted,
    primary: Brand.primary,
    primaryDark: Brand.primaryDark,
    border: Brand.border,
    error: Brand.error,
    success: Brand.success,
  },
  dark: {
    text: '#F9FAFB',
    background: '#1F1111',
    backgroundElement: '#2A1515',
    backgroundSelected: '#3D1A1A',
    textSecondary: '#D1D5DB',
    primary: Brand.primary,
    primaryDark: Brand.primaryDark,
    border: '#4A2020',
    error: Brand.error,
    success: Brand.success,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const CardRadius = 28;
export const ButtonRadius = 16;
