import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PriceBreakdown } from '@/components/marketplace/PriceBreakdown';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { PAGAR_RESERVA } from '@/graphql/mutations/marketplaceMutations';
import type { PagarReservaData } from '@/graphql/types/marketplaceTypes';
import { CARGO_SERVICIO_DEFAULT, formatMoney } from '@/utils/pricing';
import { formatGraphqlError } from '@/utils/graphqlError';
import { Routes } from '@/utils/navigation';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

const PASOS_PAGO = [
  'Generando factura y boleto',
  'Registrando equipaje',
  'Bloqueando asiento',
  'Finalizando emisión',
] as const;

export default function PagoScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { reserva, detalle, equipaje, totales, setPago } = useCheckout();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [pasoPago, setPasoPago] = useState(0);

  const [pagarReserva, { loading, error }] = useMutation<PagarReservaData>(PAGAR_RESERVA);

  const totalEstimado = useMemo(() => {
    if (totales) return totales.totalGeneral;
    return reserva?.totalReserva ?? 0;
  }, [totales, reserva]);

  const handlePagar = async () => {
    setValidationError(null);
    setPasoPago(0);

    if (!reserva?.idReserva) {
      setValidationError('No hay reserva creada. Vuelve al paso anterior.');
      return;
    }

    const idDetalle = detalle?.idDetalle ?? reserva.detalles[0]?.idDetalle;
    if (!idDetalle) {
      setValidationError('No se encontró el detalle de la reserva para procesar el pago.');
      return;
    }

    const equipajePayload = [];

    if (equipaje.equipajeBodega) {
      equipajePayload.push({
        idDetalle,
        tipo: 'BODEGA',
        pesoKg: equipaje.pesoBodegaKg,
        descripcionEquipaje: 'Maleta de bodega',
      });
    }

    const avancePasos = setInterval(() => {
      setPasoPago((actual) => Math.min(actual + 1, PASOS_PAGO.length - 1));
    }, 12000);

    try {
      const result = await pagarReserva({
        variables: {
          idReserva: reserva.idReserva,
          input: {
            cargoServicio: CARGO_SERVICIO_DEFAULT,
            equipaje: equipajePayload,
          },
        },
      });

      const pago = result.data?.pagarReserva;
      if (pago) {
        setPago(pago);
        router.push(Routes.confirmacion);
      }
    } finally {
      clearInterval(avancePasos);
      setPasoPago(0);
    }
  };

  if (!reserva) {
    return (
      <ScreenContainer>
        <StateMessage
          title="No hay reserva"
          description="Crea una reserva antes de pagar. El flujo es: pasajero → reserva → pago."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={6} />

      <StateMessage
        title="Paso 2 de 2: Pagar reserva"
        description={`La reserva ${reserva.codigoReserva} ya fue creada. Ahora procesamos el pago y la emisión.`}
        variant="success"
      />

      <SummaryCard title="Pasarela simulada">
        <ThemedText style={styles.line}>{reserva.codigoReserva}</ThemedText>
        <ThemedText style={styles.muted}>Estado: {reserva.estadoReserva}</ThemedText>
        <ThemedText style={styles.muted}>ID reserva: {reserva.idReserva}</ThemedText>
        <ThemedText style={styles.muted}>
          ID detalle: {detalle?.idDetalle ?? reserva.detalles[0]?.idDetalle ?? '—'}
        </ThemedText>
        <ThemedText style={styles.muted}>
          Reserva (tarifa + asiento): {formatMoney(reserva.totalReserva)}
        </ThemedText>
        {totales ? <PriceBreakdown totales={totales} compact /> : null}
        <ThemedText style={styles.total}>Total estimado a pagar: {formatMoney(totalEstimado)}</ThemedText>
        <ThemedText style={styles.muted}>
          Equipaje: {equipaje.equipajeBodega ? 'Maleta de bodega incluida' : 'Solo equipaje de mano'}
        </ThemedText>
      </SummaryCard>

      {loading ? (
        <View style={styles.processingCard}>
          <StateMessage
            title="Procesando pago..."
            description="Estamos generando factura, boleto, equipaje y bloqueo de asiento. Este paso puede tardar hasta 2 minutos. No cierres la app."
            loading
          />
          <ThemedText style={styles.processingStep}>{PASOS_PAGO[pasoPago]}</ThemedText>
        </View>
      ) : null}

      {validationError ? (
        <StateMessage title="No se puede pagar" description={validationError} variant="error" />
      ) : null}

      {error ? (
        <StateMessage
          title="Error al pagar"
          description={`${formatGraphqlError(error)}. Si la reserva ya fue creada, puedes reintentar el pago sin volver a crear la reserva.`}
          variant="error"
        />
      ) : null}

      <PrimaryButton
        label={loading ? 'Procesando pago...' : 'Confirmar pago'}
        onPress={handlePagar}
        loading={loading}
        disabled={!isAuthenticated || loading}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  total: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.primary,
  },
  processingCard: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  processingStep: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primary,
  },
});
