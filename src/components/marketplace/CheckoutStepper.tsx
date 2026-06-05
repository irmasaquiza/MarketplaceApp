import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';

const PASOS = [
  'Vuelos',
  'Pasajeros',
  'Asientos',
  'Equipaje',
  'Reserva',
  'Pago',
  'Confirmación',
] as const;

type CheckoutStepperProps = {
  pasoActual: number;
};

export function CheckoutStepper({ pasoActual }: CheckoutStepperProps) {
  const progress = ((pasoActual - 1) / (PASOS.length - 1)) * 100;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.kicker}>Reserva NachoFlights</ThemedText>
          <ThemedText style={styles.heading}>Tu viaje va tomando forma</ThemedText>
        </View>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            Paso {pasoActual} de {PASOS.length}
          </ThemedText>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.stepsRow}>
        {PASOS.map((etiqueta, index) => {
          const numero = index + 1;
          const estado =
            numero < pasoActual ? 'completado' : numero === pasoActual ? 'actual' : 'pendiente';

          return (
            <View
              key={etiqueta}
              style={[
                styles.step,
                estado === 'actual' && styles.stepActual,
                estado === 'completado' && styles.stepCompletado,
              ]}>
              <View
                style={[
                  styles.stepCircle,
                  estado === 'actual' && styles.stepCircleActual,
                  estado === 'completado' && styles.stepCircleCompletado,
                ]}>
                <ThemedText
                  style={[
                    styles.stepNumber,
                    estado === 'actual' && styles.stepNumberActual,
                    estado === 'completado' && styles.stepNumberCompletado,
                  ]}>
                  {estado === 'completado' ? '✓' : numero}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.stepLabel,
                  estado === 'actual' && styles.stepLabelActual,
                ]}
                numberOfLines={1}>
                {etiqueta}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Brand.primary,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  kicker: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heading: {
    color: Brand.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Brand.white,
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  step: {
    flexBasis: '30%',
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 8,
    gap: 4,
  },
  stepActual: {
    backgroundColor: Brand.white,
    borderColor: Brand.white,
  },
  stepCompletado: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActual: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  stepCircleCompletado: {
    backgroundColor: Brand.white,
    borderColor: Brand.white,
  },
  stepNumber: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '800',
  },
  stepNumberActual: {
    color: Brand.white,
  },
  stepNumberCompletado: {
    color: Brand.primary,
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
  },
  stepLabelActual: {
    color: Brand.primary,
  },
});
