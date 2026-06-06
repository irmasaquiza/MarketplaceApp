import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
};

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('es-EC', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function toIsoDateStart(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

export function DateField({ label, value, onChange, minimumDate }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selected) {
      onChange(selected);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.wrapper}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <input
          type="date"
          value={toDateInputValue(value)}
          min={minimumDate ? toDateInputValue(minimumDate) : undefined}
          onChange={(event) => {
            const selected = fromDateInputValue(event.currentTarget.value);

            if (selected) {
              onChange(selected);
            }
          }}
          style={webStyles.dateInput}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable style={styles.trigger} onPress={() => setShowPicker(true)}>
        <ThemedText style={styles.value}>{formatDisplayDate(value)}</ThemedText>
      </Pressable>

      {showPicker ? (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      ) : null}

      {Platform.OS === 'ios' && showPicker ? (
        <Pressable style={styles.doneButton} onPress={() => setShowPicker(false)}>
          <ThemedText style={styles.doneText}>Listo</ThemedText>
        </Pressable>
      ) : null}
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
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.text,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  doneText: {
    color: Brand.primary,
    fontWeight: '700',
  },
});

const webStyles = {
  dateInput: {
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Brand.border,
    borderRadius: CardRadius,
    padding: '14px 8px',
    fontSize: 16,
    fontWeight: 600,
    color: Brand.text,
    outlineColor: Brand.primary,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  } satisfies CSSProperties,
};
