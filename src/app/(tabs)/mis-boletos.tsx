import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { MIS_BOLETOS } from '@/graphql/queries/marketplaceQueries';
import type { BoletoPortal, MisBoletosData } from '@/graphql/types/marketplaceTypes';
import { formatMoney } from '@/utils/pricing';
import { Brand } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function MisBoletosScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery<MisBoletosData>(MIS_BOLETOS, {
    skip: !isAuthenticated,
  });

  const boletos = data?.misBoletos ?? [];

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <StateMessage title="Inicia sesión" description="Necesitas una cuenta para ver tus boletos." />
        <PrimaryButton label="Iniciar sesión" onPress={() => router.push(Routes.login)} />
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <StateMessage title="Cargando boletos..." loading />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <StateMessage title="Error al cargar boletos" description={error.message} variant="error" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedText style={styles.heading}>Mis boletos</ThemedText>

      {boletos.length === 0 ? (
        <StateMessage title="Sin boletos" description="Aún no tienes boletos emitidos." />
      ) : (
        boletos.map((boleto: BoletoPortal) => (
          <SummaryCard key={boleto.idBoleto} title={boleto.codigoBoleto}>
            <ThemedText style={styles.line}>Reserva: {boleto.codigoReserva}</ThemedText>
            <ThemedText style={styles.muted}>
              Vuelo {boleto.numeroVuelo} · Asiento {boleto.numeroAsiento}
            </ThemedText>
            <ThemedText style={styles.price}>{formatMoney(boleto.precioFinal)}</ThemedText>
            <ThemedText style={styles.muted}>Estado: {boleto.estadoBoleto}</ThemedText>
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
