import { Platform, StyleSheet, TextInput, View } from 'react-native';

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
  editable?: boolean;
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
  editable = true,
  error,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={Brand.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        spellCheck={false}
        secureTextEntry={secureTextEntry}
        editable={editable}
        selectionColor={Brand.primary}
        underlineColorAndroid="transparent"
        style={[
          styles.input,
          error ? styles.inputError : null,
          !editable ? styles.inputDisabled : null,
          // Android necesita color explícito en el propio estilo inline
          Platform.OS === 'android' ? { color: Brand.text } : null,
        ]}
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
    paddingVertical: Platform.OS === 'android' ? 10 : Spacing.two,
    fontSize: 16,
    color: Brand.text,
    minHeight: 48,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: Brand.border,
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
