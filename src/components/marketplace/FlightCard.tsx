import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { type VueloResumen } from '@/context/CheckoutContext';
import { formatMoney } from '@/utils/pricing';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

type FlightCardProps = {
  vuelo: VueloResumen;
  onPress: () => void;
};

export function FlightCard({ vuelo, onPress }: FlightCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View style={styles.card}>
        <View style={styles.accent} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.flightCode}>{vuelo.numeroVuelo}</ThemedText>
            <View style={styles.directBadge}>
              <ThemedText style={styles.directText}>Directo</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.route}>
            {vuelo.codigoIataOrigen} → {vuelo.codigoIataDestino}
          </ThemedText>
          <ThemedText style={styles.airports}>
            {vuelo.nombreAeropuertoOrigen} · {vuelo.nombreAeropuertoDestino}
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText style={styles.meta}>
              {new Date(vuelo.fechaHoraSalida).toLocaleString('es-EC', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>
            <ThemedText style={styles.meta}>{vuelo.duracionMin} min</ThemedText>
          </View>

          <View style={styles.footerRow}>
            <ThemedText style={styles.price}>{formatMoney(vuelo.precioTotal)}</ThemedText>
            <ThemedText style={styles.seats}>
              {vuelo.asientosDisponibles} asientos
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  accent: {
    width: 8,
    backgroundColor: Brand.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  directBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  directText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  route: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  airports: {
    fontSize: 13,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.primary,
  },
  seats: {
    fontSize: 13,
    color: Brand.textMuted,
    fontWeight: '600',
  },
});
