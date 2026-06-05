import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { TotalesCheckout } from '@/utils/pricing';
import { formatMoney, IVA_RATE } from '@/utils/pricing';
import { Brand, Spacing } from '@/constants/theme';

type PriceBreakdownProps = {
  totales: TotalesCheckout;
  compact?: boolean;
};

export function PriceBreakdown({ totales, compact = false }: PriceBreakdownProps) {
  const ivaLabel = `IVA ${Math.round(IVA_RATE * 100)}%`;

  return (
    <>
      <ThemedText style={styles.row}>
        Tarifa base: {formatMoney(totales.precioBase)}
      </ThemedText>
      {totales.precioExtraAsiento > 0 ? (
        <ThemedText style={styles.row}>
          Extra asiento: {formatMoney(totales.precioExtraAsiento)}
        </ThemedText>
      ) : null}
      {totales.costoEquipaje > 0 ? (
        <ThemedText style={styles.row}>
          Equipaje bodega: {formatMoney(totales.costoEquipaje)}
        </ThemedText>
      ) : null}

      {!compact ? (
        <>
          <ThemedText style={styles.divider}>Reserva (tarifa + asiento)</ThemedText>
          <ThemedText style={styles.muted}>
            Subtotal: {formatMoney(totales.subtotalReserva)} · {ivaLabel}:{' '}
            {formatMoney(totales.valorIvaReserva)}
          </ThemedText>
          {totales.costoEquipaje > 0 ? (
            <ThemedText style={styles.muted}>
              Equipaje: {formatMoney(totales.subtotalEquipaje)} · {ivaLabel}:{' '}
              {formatMoney(totales.valorIvaEquipaje)}
            </ThemedText>
          ) : null}
        </>
      ) : null}

      <ThemedText style={styles.muted}>
        Subtotal general: {formatMoney(totales.subtotalGeneral)}
      </ThemedText>
      <ThemedText style={styles.muted}>
        {ivaLabel} general: {formatMoney(totales.valorIvaGeneral)}
      </ThemedText>
      {totales.cargoServicio > 0 ? (
        <ThemedText style={styles.muted}>
          Cargo servicio: {formatMoney(totales.cargoServicio)}
        </ThemedText>
      ) : null}
      <ThemedText style={styles.total}>Total: {formatMoney(totales.totalGeneral)}</ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    fontSize: 14,
    color: Brand.text,
    fontWeight: '600',
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  divider: {
    marginTop: Spacing.one,
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  total: {
    marginTop: Spacing.two,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.primary,
  },
});
