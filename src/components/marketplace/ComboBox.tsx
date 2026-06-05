import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

export type ComboBoxOption = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  label: string;
  value: string;
  options: ComboBoxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
};

export function ComboBox({
  label,
  value,
  options,
  onChange,
  placeholder = 'Seleccionar...',
  loading = false,
  disabled = false,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.value.toLowerCase().includes(term),
    );
  }, [filter, options]);

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}>
        <ThemedText style={selected ? styles.value : styles.placeholder}>
          {loading ? 'Cargando...' : selected?.label ?? placeholder}
        </ThemedText>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <ThemedText style={styles.sheetTitle}>{label}</ThemedText>
            <TextInput
              style={styles.search}
              value={filter}
              onChangeText={setFilter}
              placeholder="Buscar aeropuerto..."
              placeholderTextColor={Brand.textMuted}
              autoCapitalize="none"
            />
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              style={styles.list}
              ListEmptyComponent={
                <ThemedText style={styles.empty}>No hay aeropuertos disponibles.</ThemedText>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.option, item.value === value && styles.optionSelected]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                    setFilter('');
                  }}>
                  <ThemedText style={styles.optionText}>{item.label}</ThemedText>
                </Pressable>
              )}
            />
            <Pressable style={styles.closeButton} onPress={() => setOpen(false)}>
              <ThemedText style={styles.closeText}>Cerrar</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trigger: {
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: CardRadius,
    paddingHorizontal: Spacing.two,
    paddingVertical: 14,
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.text,
  },
  placeholder: {
    fontSize: 16,
    color: Brand.textMuted,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Brand.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.three,
    maxHeight: '80%',
    gap: Spacing.two,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.text,
  },
  search: {
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: CardRadius,
    paddingHorizontal: Spacing.two,
    paddingVertical: 12,
    fontSize: 16,
    color: Brand.text,
    backgroundColor: Brand.background,
  },
  list: {
    maxHeight: 360,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  optionSelected: {
    backgroundColor: Brand.inputBg,
  },
  optionText: {
    fontSize: 15,
    color: Brand.text,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: Brand.textMuted,
    paddingVertical: Spacing.three,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeText: {
    color: Brand.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
