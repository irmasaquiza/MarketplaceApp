import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { LoginModal } from '@/components/marketplace/LoginModal';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { SeatMap } from '@/components/marketplace/SeatMap';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { ASIENTOS_POR_VUELO } from '@/graphql/queries/marketplaceQueries';
import type { AsientosPorVueloData } from '@/graphql/types/marketplaceTypes';
import { Brand } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function AsientosScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idVuelo = Number(id);
  const { isAuthenticated } = useAuth();
  const { asiento, setAsiento, claseSeleccionada, pasajero } = useCheckout();

  const { data, loading, error } = useQuery<AsientosPorVueloData>(ASIENTOS_POR_VUELO, {
    variables: { idVuelo, clase: claseSeleccionada },
    skip: !idVuelo || !isAuthenticated,
  });

  const asientos = data?.asientosPorVuelo ?? [];

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <CheckoutStepper pasoActual={3} />
        <LoginModal
          visible
          onAuthenticated={() => undefined}
          onCancel={() => router.replace(Routes.home)}
        />
        <StateMessage
          title="Autenticacion requerida"
          description="Inicia sesion para ver y seleccionar asientos."
        />
      </ScreenContainer>
    );
  }

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
        <SeatMap
          seats={asientos}
          selectedSeatId={asiento?.idAsiento}
          onSelectSeat={setAsiento}
        />
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
});
