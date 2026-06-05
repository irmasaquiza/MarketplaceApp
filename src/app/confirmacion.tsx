import { useRouter } from 'expo-router';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PriceBreakdown } from '@/components/marketplace/PriceBreakdown';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useCheckout } from '@/context/CheckoutContext';
import { formatMoney } from '@/utils/pricing';
import { Brand } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function ConfirmacionReservaScreen() {
  const router = useRouter();
  const { pago, reserva, pasajero, asiento, vuelo, equipaje, totales, resetCheckout } =
    useCheckout();

  if (!pago) {
    return (
      <ScreenContainer>
        <StateMessage title="Sin confirmación" description="Aún no se ha completado un pago." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={7} />

      <StateMessage title="¡Reserva confirmada!" description={pago.mensaje} variant="success" />

      <SummaryCard title={pago.codigoReserva}>
        <ThemedText style={styles.line}>Estado: {pago.estadoReserva}</ThemedText>
        <ThemedText style={styles.total}>Total pagado: {formatMoney(pago.totalReserva)}</ThemedText>
        {vuelo ? <ThemedText style={styles.muted}>Vuelo: {vuelo.numeroVuelo}</ThemedText> : null}
        {vuelo ? (
          <ThemedText style={styles.muted}>
            Ruta: {vuelo.codigoIataOrigen} → {vuelo.codigoIataDestino}
          </ThemedText>
        ) : null}
        {asiento ? <ThemedText style={styles.muted}>Asiento: {asiento.numeroAsiento}</ThemedText> : null}
        {pasajero ? (
          <ThemedText style={styles.muted}>
            Pasajero: {pasajero.nombrePasajero} {pasajero.apellidoPasajero}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.muted}>
          Equipaje: {equipaje.equipajeBodega ? 'Mano + bodega' : 'Solo mano'}
        </ThemedText>
        {reserva ? <ThemedText style={styles.muted}>ID reserva: {reserva.idReserva}</ThemedText> : null}
        {totales ? <PriceBreakdown totales={totales} /> : null}
      </SummaryCard>

      <PrimaryButton label="Ver mis reservas" onPress={() => router.push(Routes.misReservas)} />
      <PrimaryButton
        label="Nueva búsqueda"
        variant="secondary"
        onPress={() => {
          resetCheckout();
          router.push(Routes.home);
        }}
      />
    </ScreenContainer>
  );
}

const styles = {
  line: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500' as const,
  },
  total: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Brand.primary,
  },
};
