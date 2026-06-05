import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { MIS_FACTURAS } from '@/graphql/queries/marketplaceQueries';
import type { FacturaPortal, MisFacturasData } from '@/graphql/types/marketplaceTypes';
import { formatMoney } from '@/utils/pricing';
import { Brand } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function MisFacturasScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery<MisFacturasData>(MIS_FACTURAS, {
    skip: !isAuthenticated,
  });

  const facturas = data?.misFacturas ?? [];

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <StateMessage title="Inicia sesión" description="Necesitas una cuenta para ver tus facturas." />
        <PrimaryButton label="Iniciar sesión" onPress={() => router.push(Routes.login)} />
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <StateMessage title="Cargando facturas..." loading />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <StateMessage title="Error al cargar facturas" description={error.message} variant="error" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedText style={styles.heading}>Mis facturas</ThemedText>

      {facturas.length === 0 ? (
        <StateMessage title="Sin facturas" description="Aún no tienes facturas emitidas." />
      ) : (
        facturas.map((factura: FacturaPortal) => (
          <SummaryCard key={factura.idFactura} title={factura.numeroFactura}>
            <ThemedText style={styles.muted}>Reserva: {factura.codigoReserva}</ThemedText>
            <ThemedText style={styles.muted}>
              {new Date(factura.fechaEmision).toLocaleString('es-EC')}
            </ThemedText>
            <ThemedText style={styles.price}>{formatMoney(factura.total)}</ThemedText>
            <ThemedText style={styles.muted}>Estado: {factura.estadoFactura}</ThemedText>
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
