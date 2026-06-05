import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useCheckout } from '@/context/CheckoutContext';
import { VUELO_DETALLE } from '@/graphql/queries/marketplaceQueries';
import type { VueloDetalleData } from '@/graphql/types/marketplaceTypes';
import { formatMoney } from '@/utils/pricing';
import { Routes } from '@/utils/navigation';
import { Brand, Spacing } from '@/constants/theme';

export default function DetalleVueloScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idVuelo = Number(id);
  const { setVueloDetalle } = useCheckout();

  const { data, loading, error } = useQuery<VueloDetalleData>(VUELO_DETALLE, {
    variables: { idVuelo },
    skip: !idVuelo,
  });

  const vuelo = data?.vueloDetalle;

  useEffect(() => {
    if (vuelo) {
      setVueloDetalle(vuelo);
    }
  }, [vuelo, setVueloDetalle]);

  if (loading) {
    return (
      <ScreenContainer>
        <StateMessage title="Cargando detalle del vuelo..." loading />
      </ScreenContainer>
    );
  }

  if (error || !vuelo) {
    return (
      <ScreenContainer>
        <StateMessage
          title="No se pudo cargar el vuelo"
          description={error?.message ?? 'Vuelo no encontrado'}
          variant="error"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={1} />

      <SummaryCard title={vuelo.numeroVuelo}>
        <ThemedText style={styles.route}>
          {vuelo.codigoIataOrigen} → {vuelo.codigoIataDestino}
        </ThemedText>
        <ThemedText style={styles.muted}>
          {vuelo.nombreAeropuertoOrigen} · {vuelo.nombreAeropuertoDestino}
        </ThemedText>
        <ThemedText style={styles.line}>
          Salida: {new Date(vuelo.fechaHoraSalida).toLocaleString('es-EC')}
        </ThemedText>
        <ThemedText style={styles.line}>
          Llegada: {new Date(vuelo.fechaHoraLlegada).toLocaleString('es-EC')}
        </ThemedText>
        <ThemedText style={styles.line}>Duración: {vuelo.duracionMin} min</ThemedText>
        <ThemedText style={styles.price}>Desde {formatMoney(vuelo.precioBase)}</ThemedText>
      </SummaryCard>

      {vuelo.disponibilidadPorClase?.map((item) => (
        <SummaryCard key={item.clase} title={item.clase}>
          <ThemedText style={styles.line}>
            {item.asientosDisponibles} asientos disponibles
          </ThemedText>
          <ThemedText style={styles.muted}>Precio base {formatMoney(item.precioBase)}</ThemedText>
        </SummaryCard>
      ))}

      <PrimaryButton
        label="Continuar con pasajero"
        onPress={() => router.push(Routes.pasajero)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  route: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  line: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  price: {
    marginTop: Spacing.one,
    fontSize: 22,
    fontWeight: '800',
    color: Brand.primary,
  },
});
