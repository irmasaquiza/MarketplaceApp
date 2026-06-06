import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';
import type { AsientoSeleccionado } from '@/context/CheckoutContext';
import { formatMoney } from '@/utils/pricing';

type SeatMapProps = {
  seats: AsientoSeleccionado[];
  selectedSeatId?: number | null;
  onSelectSeat: (seat: AsientoSeleccionado) => void;
};

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];
const AVAILABLE_COLOR = '#22C55E';
const OCCUPIED_COLOR = '#EF4444';
const SELECTED_COLOR = '#2563EB';

function parseSeatNumber(numeroAsiento: string) {
  const match = numeroAsiento.match(/^(\d+)\s*([A-Za-z])$/);

  if (!match) {
    return null;
  }

  return {
    row: Number(match[1]),
    column: match[2].toUpperCase(),
  };
}

function statusLabel(seat: AsientoSeleccionado, selected: boolean) {
  if (selected) return 'Seleccionado';
  if (!seat.disponible) return 'Ocupado';
  return formatMoney(seat.precioExtra);
}

export function SeatMap({ seats, selectedSeatId, onSelectSeat }: SeatMapProps) {
  const rows = useMemo(() => {
    const grouped = new Map<number, Map<string, AsientoSeleccionado>>();

    seats.forEach((seat, index) => {
      const parsed = parseSeatNumber(seat.numeroAsiento);
      const row = parsed?.row ?? Math.floor(index / SEAT_COLUMNS.length) + 1;
      const column = parsed?.column ?? SEAT_COLUMNS[index % SEAT_COLUMNS.length];

      if (!grouped.has(row)) {
        grouped.set(row, new Map());
      }

      grouped.get(row)?.set(column, seat);
    });

    return Array.from(grouped.entries()).sort(([left], [right]) => left - right);
  }, [seats]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.nose}>
        <ThemedText style={styles.noseText}>Cabina</ThemedText>
      </View>

      <View style={styles.legend}>
        <LegendDot color={AVAILABLE_COLOR} label="Disponible" />
        <LegendDot color={OCCUPIED_COLOR} label="Ocupado" />
        <LegendDot color={SELECTED_COLOR} label="Seleccionado" />
      </View>

      <View style={styles.columnHeader}>
        {SEAT_COLUMNS.map((column, index) => (
          <View key={column} style={[styles.headerCell, index === 3 && styles.aisleLeft]}>
            <ThemedText style={styles.headerText}>{column}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.cabin}>
        {rows.map(([rowNumber, rowSeats]) => (
          <View key={rowNumber} style={styles.row}>
            <ThemedText style={styles.rowNumber}>{rowNumber}</ThemedText>

            <View style={styles.seatRow}>
              {SEAT_COLUMNS.map((column, index) => {
                const seat = rowSeats.get(column);
                const selected = seat?.idAsiento === selectedSeatId;
                const disabled = !seat || !seat.disponible;

                return (
                  <Pressable
                    key={`${rowNumber}-${column}`}
                    disabled={disabled}
                    onPress={() => seat && onSelectSeat(seat)}
                    accessibilityRole="button"
                    accessibilityState={{ selected, disabled }}
                    accessibilityLabel={
                      seat
                        ? `Asiento ${seat.numeroAsiento}, ${statusLabel(seat, selected)}`
                        : `Espacio sin asiento ${rowNumber}${column}`
                    }
                    style={({ pressed }) => [
                      styles.seat,
                      seat?.disponible ? styles.availableSeat : styles.occupiedSeat,
                      selected && styles.selectedSeat,
                      !seat && styles.emptySeat,
                      index === 3 && styles.aisleLeft,
                      pressed && !disabled && styles.pressedSeat,
                    ]}>
                    <ThemedText style={[styles.seatNumber, selected && styles.selectedSeatText]}>
                      {seat?.numeroAsiento ?? ''}
                    </ThemedText>
                    {seat ? (
                      <ThemedText style={[styles.seatMeta, selected && styles.selectedSeatText]}>
                        {statusLabel(seat, selected)}
                      </ThemedText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText style={styles.legendText}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  nose: {
    alignSelf: 'center',
    width: '72%',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Brand.border,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    alignItems: 'center',
  },
  noseText: {
    color: Brand.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: Brand.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  columnHeader: {
    flexDirection: 'row',
    paddingLeft: 34,
    gap: Spacing.one,
  },
  headerCell: {
    width: 46,
    alignItems: 'center',
  },
  headerText: {
    color: Brand.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  cabin: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowNumber: {
    width: 26,
    textAlign: 'center',
    color: Brand.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  seatRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flex: 1,
  },
  seat: {
    width: 46,
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  availableSeat: {
    backgroundColor: AVAILABLE_COLOR,
    borderColor: '#16A34A',
  },
  occupiedSeat: {
    backgroundColor: OCCUPIED_COLOR,
    borderColor: '#DC2626',
    opacity: 0.72,
  },
  selectedSeat: {
    backgroundColor: SELECTED_COLOR,
    borderColor: '#1D4ED8',
    transform: [{ scale: 1.04 }],
  },
  emptySeat: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    opacity: 0,
  },
  aisleLeft: {
    marginLeft: Spacing.three,
  },
  pressedSeat: {
    transform: [{ scale: 0.96 }],
  },
  seatNumber: {
    color: Brand.white,
    fontSize: 12,
    fontWeight: '900',
  },
  selectedSeatText: {
    color: Brand.white,
  },
  seatMeta: {
    color: Brand.white,
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
  },
});
