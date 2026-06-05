import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  error?: string;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  error,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={Brand.textMuted}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: Brand.inputBg,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    color: Brand.text,
  },
  inputError: {
    borderColor: Brand.error,
  },
  error: {
    color: Brand.error,
    fontSize: 12,
    fontWeight: '600',
  },
});
