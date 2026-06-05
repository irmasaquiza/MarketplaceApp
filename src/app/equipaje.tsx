import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PriceBreakdown } from '@/components/marketplace/PriceBreakdown';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useCheckout } from '@/context/CheckoutContext';
import { buildCheckoutTotales, COSTO_BODEGA, formatMoney } from '@/utils/pricing';
import { Routes } from '@/utils/navigation';
import { Brand, Spacing } from '@/constants/theme';

export default function EquipajeScreen() {
  const router = useRouter();
  const { vuelo, vueloDetalle, pasajero, asiento, equipaje, setEquipaje, setTotales } =
    useCheckout();
  const [bodega, setBodega] = useState(equipaje.equipajeBodega);

  const precioBase = vueloDetalle?.precioBase ?? vuelo?.precioBase ?? 0;

  const totalesPreview = useMemo(() => {
    if (!asiento) return null;
    return buildCheckoutTotales({
      precioBase,
      precioExtraAsiento: asiento.precioExtra,
      equipajeBodega: bodega,
      costoBodega: COSTO_BODEGA,
    });
  }, [asiento, precioBase, bodega]);

  if (!pasajero || !asiento || !vuelo) {
    return (
      <ScreenContainer>
        <StateMessage
          title="Checkout incompleto"
          description="Selecciona un vuelo, registra el pasajero y elige un asiento antes del equipaje."
        />
      </ScreenContainer>
    );
  }

  const nombre = `${pasajero.nombrePasajero} ${pasajero.apellidoPasajero}`.trim();

  const continuar = () => {
    const nextEquipaje = {
      equipajeMano: true,
      equipajeBodega: bodega,
      pesoManoKg: 10,
      pesoBodegaKg: 23,
      costoBodega: COSTO_BODEGA,
    };

    setEquipaje(nextEquipaje);

    if (totalesPreview) {
      setTotales(totalesPreview);
    }

    router.push(Routes.reserva);
  };

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={4} />

      <SummaryCard title="Pasajero">
        <ThemedText style={styles.line}>{nombre}</ThemedText>
        <ThemedText style={styles.muted}>
          Asiento {asiento.numeroAsiento} · {asiento.clase}
        </ThemedText>
      </SummaryCard>

      <View style={styles.optionCard}>
        <View style={styles.optionHeader}>
          <ThemedText style={styles.optionTitle}>Equipaje de mano</ThemedText>
          <ThemedText style={styles.included}>Incluido</ThemedText>
        </View>
        <ThemedText style={styles.muted}>Hasta 10 kg por pasajero</ThemedText>
      </View>

      <Pressable
        onPress={() => setBodega((value) => !value)}
        style={[styles.optionCard, bodega && styles.optionSelected]}>
        <View style={styles.optionHeader}>
          <ThemedText style={styles.optionTitle}>Maleta de bodega</ThemedText>
          <ThemedText style={styles.price}>{formatMoney(COSTO_BODEGA)}</ThemedText>
        </View>
        <ThemedText style={styles.muted}>
          Hasta 23 kg · {bodega ? 'Agregada' : 'Toca para agregar'}
        </ThemedText>
      </Pressable>

      <SummaryCard title="Total estimado del viaje">
        {totalesPreview ? <PriceBreakdown totales={totalesPreview} compact /> : null}
      </SummaryCard>

      <PrimaryButton label="Continuar a reserva" onPress={continuar} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  optionCard: {
    backgroundColor: Brand.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  optionSelected: {
    borderColor: Brand.primary,
    backgroundColor: '#FFF5F5',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.text,
  },
  included: {
    color: Brand.success,
    fontWeight: '800',
    fontSize: 13,
  },
  price: {
    color: Brand.primary,
    fontWeight: '800',
    fontSize: 16,
  },
});
