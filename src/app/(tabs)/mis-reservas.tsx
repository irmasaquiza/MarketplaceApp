import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { MIS_RESERVAS } from '@/graphql/queries/marketplaceQueries';
import type { MisReservasData, ReservaPortal } from '@/graphql/types/marketplaceTypes';
import { formatMoney } from '@/utils/pricing';
import { Brand } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function MisReservasScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery<MisReservasData>(MIS_RESERVAS, {
    skip: !isAuthenticated,
  });

  const reservas = data?.misReservas ?? [];

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <StateMessage title="Inicia sesión" description="Necesitas una cuenta para ver tus reservas." />
        <PrimaryButton label="Iniciar sesión" onPress={() => router.push(Routes.login)} />
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <StateMessage title="Cargando reservas..." loading />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <StateMessage title="Error al cargar reservas" description={error.message} variant="error" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedText style={styles.heading}>Mis reservas</ThemedText>

      {reservas.length === 0 ? (
        <StateMessage title="Sin reservas" description="Aún no tienes reservas registradas." />
      ) : (
        reservas.map((reserva: ReservaPortal) => (
          <SummaryCard key={reserva.idReserva} title={reserva.codigoReserva}>
            <ThemedText style={styles.line}>Vuelo: {reserva.numeroVuelo}</ThemedText>
            <ThemedText style={styles.muted}>
              {new Date(reserva.fechaReservaUtc).toLocaleString('es-EC')}
            </ThemedText>
            <ThemedText style={styles.price}>{formatMoney(reserva.totalReserva)}</ThemedText>
            <ThemedText style={styles.muted}>Estado: {reserva.estadoReserva}</ThemedText>
          </SummaryCard>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = {
  heading: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Brand.text,
  },
  line: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500' as const,
  },
  price: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Brand.primary,
  },
};
