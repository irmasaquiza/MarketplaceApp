import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { useCheckout, type AsientoSeleccionado } from '@/context/CheckoutContext';
import { ASIENTOS_POR_VUELO } from '@/graphql/queries/marketplaceQueries';
import type { AsientosPorVueloData } from '@/graphql/types/marketplaceTypes';
import { formatMoney } from '@/utils/pricing';
import { Brand, Spacing } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function AsientosScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idVuelo = Number(id);
  const { asiento, setAsiento, claseSeleccionada, pasajero } = useCheckout();

  const { data, loading, error } = useQuery<AsientosPorVueloData>(ASIENTOS_POR_VUELO, {
    variables: { idVuelo, clase: claseSeleccionada },
    skip: !idVuelo,
  });

  const asientos = data?.asientosPorVuelo ?? [];

  if (!pasajero) {
    return (
      <ScreenContainer>
        <StateMessage title="Registra el pasajero primero" />
        <PrimaryButton label="Ir a pasajero" onPress={() => router.push(Routes.pasajero)} />
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <StateMessage title="Cargando asientos..." loading />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <StateMessage title="Error al cargar asientos" description={error.message} variant="error" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={3} />

      <ThemedText style={styles.heading}>Selecciona tu asiento</ThemedText>
      <ThemedText style={styles.muted}>
        {pasajero.nombrePasajero} {pasajero.apellidoPasajero} · Clase {claseSeleccionada}
      </ThemedText>

      {asientos.length === 0 ? (
        <StateMessage title="No hay asientos disponibles" />
      ) : (
        <View style={styles.grid}>
          {asientos.map((item: AsientoSeleccionado) => {
            const selected = asiento?.idAsiento === item.idAsiento;
            const disabled = !item.disponible;

            return (
              <Pressable
                key={item.idAsiento}
                disabled={disabled}
                onPress={() => setAsiento(item)}
                style={[
                  styles.seat,
                  selected && styles.seatSelected,
                  disabled && styles.seatDisabled,
                ]}>
                <ThemedText style={[styles.seatNumber, selected && styles.seatNumberSelected]}>
                  {item.numeroAsiento}
                </ThemedText>
                <ThemedText style={styles.seatMeta}>
                  {item.disponible ? formatMoney(item.precioExtra) : 'Ocupado'}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}

      <PrimaryButton
        label="Continuar a equipaje"
        disabled={!asiento}
        onPress={() => router.push(Routes.equipaje)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  seat: {
    width: '30%',
    minWidth: 96,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 16,
    padding: Spacing.two,
    alignItems: 'center',
    gap: 4,
  },
  seatSelected: {
    borderColor: Brand.primary,
    backgroundColor: '#FFF5F5',
  },
  seatDisabled: {
    opacity: 0.45,
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.text,
  },
  seatNumberSelected: {
    color: Brand.primary,
  },
  seatMeta: {
    fontSize: 11,
    color: Brand.textMuted,
    fontWeight: '600',
  },
});
