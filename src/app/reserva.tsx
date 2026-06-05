import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { PriceBreakdown } from '@/components/marketplace/PriceBreakdown';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useCheckout, type PasajeroRegistrado } from '@/context/CheckoutContext';
import { CREAR_RESERVA } from '@/graphql/mutations/marketplaceMutations';
import type { CrearReservaData } from '@/graphql/types/marketplaceTypes';
import { buildCheckoutTotales } from '@/utils/pricing';
import { formatGraphqlError } from '@/utils/graphqlError';
import { Routes } from '@/utils/navigation';
import { Brand } from '@/constants/theme';

const OBSERVACIONES_RESERVA = 'Reserva desde MarketplaceApp';

type PasajeroReservaInput = {
  idCliente?: number | null;
  nombrePasajero: string;
  apellidoPasajero: string;
  tipoDocumentoPasajero: string;
  numeroDocumentoPasajero: string;
  emailContactoPasajero?: string | null;
  telefonoContactoPasajero?: string | null;
  requiereAsistencia: boolean;
};

type CrearReservaInput = {
  idCliente: number;
  idVuelo: number;
  contactoEmail?: string | null;
  contactoTelefono?: string | null;
  observaciones: string;
  subtotalReserva: number;
  valorIva: number;
  totalReserva: number;
  pasajero?: PasajeroReservaInput;
  detalles: Array<{
    idPasajero: number;
    idAsiento: number;
    subtotalLinea: number;
    valorIvaLinea: number;
    totalLinea: number;
    pasajero?: PasajeroReservaInput;
  }>;
};

function buildPasajeroInput(
  pasajero: PasajeroRegistrado,
  idCliente: number | null,
): PasajeroReservaInput {
  return {
    idCliente,
    nombrePasajero: pasajero.nombrePasajero,
    apellidoPasajero: pasajero.apellidoPasajero,
    tipoDocumentoPasajero: pasajero.tipoDocumentoPasajero,
    numeroDocumentoPasajero: pasajero.numeroDocumentoPasajero,
    emailContactoPasajero: pasajero.emailContactoPasajero,
    telefonoContactoPasajero: pasajero.telefonoContactoPasajero,
    requiereAsistencia: false,
  };
}

function validarCrearReservaInput(input: CrearReservaInput): string | null {
  if (!input.idCliente || input.idCliente <= 0) {
    return 'Falta el cliente autenticado (idCliente). Inicia sesión nuevamente.';
  }
  if (!input.idVuelo || input.idVuelo <= 0) {
    return 'Falta el vuelo seleccionado.';
  }
  if (!input.detalles.length) {
    return 'La reserva debe incluir al menos un detalle.';
  }
  if (input.subtotalReserva <= 0 || input.totalReserva <= 0) {
    return 'Los montos de la reserva deben ser mayores a cero.';
  }

  const detalle = input.detalles[0];
  const tienePasajero =
    detalle.idPasajero > 0 || Boolean(input.pasajero ?? detalle.pasajero);
  if (!tienePasajero) {
    return 'Debes registrar el pasajero antes de crear la reserva.';
  }
  if (!detalle.idAsiento || detalle.idAsiento <= 0) {
    return 'Debes seleccionar un asiento antes de crear la reserva.';
  }

  return null;
}

export default function CrearReservaScreen() {
  const router = useRouter();
  const { isAuthenticated, idCliente } = useAuth();
  const {
    vuelo,
    vueloDetalle,
    asiento,
    pasajero,
    equipaje,
    totales,
    setReserva,
    setDetalle,
    setTotales,
  } = useCheckout();
  const [validationError, setValidationError] = useState<string | null>(null);

  const [crearReserva, { loading, error }] = useMutation<CrearReservaData>(CREAR_RESERVA);

  const totalesCalculados = useMemo(() => {
    if (totales) return totales;
    if (!asiento) return null;
    const precioBase = vueloDetalle?.precioBase ?? vuelo?.precioBase ?? 0;
    return buildCheckoutTotales({
      precioBase,
      precioExtraAsiento: asiento.precioExtra,
      equipajeBodega: equipaje.equipajeBodega,
      costoBodega: equipaje.costoBodega,
    });
  }, [totales, asiento, vueloDetalle, vuelo, equipaje]);

  const missingStepMessage = useMemo(() => {
    if (!vuelo) return 'Selecciona un vuelo para continuar.';
    if (!pasajero) return 'Registra el pasajero antes de crear la reserva.';
    if (!asiento?.idAsiento) return 'Selecciona un asiento antes de crear la reserva.';
    if (!totalesCalculados) return 'No se pudo calcular el total de la reserva.';
    return null;
  }, [vuelo, pasajero, asiento, totalesCalculados]);

  const handleCrear = async () => {
    setValidationError(null);

    if (!vuelo || !asiento || !pasajero || !totalesCalculados) {
      setValidationError(missingStepMessage ?? 'Checkout incompleto.');
      return;
    }

    setTotales(totalesCalculados);

    const pasajeroInput = buildPasajeroInput(pasajero, idCliente);
    const lineaApi = {
      subtotalLinea: totalesCalculados.subtotalReserva,
      valorIvaLinea: totalesCalculados.valorIvaReserva,
      totalLinea: totalesCalculados.totalReserva,
    };

    const input: CrearReservaInput = {
      idCliente: idCliente ?? pasajero.idCliente ?? 0,
      idVuelo: vuelo.idVuelo,
      contactoEmail: pasajero.emailContactoPasajero,
      contactoTelefono: pasajero.telefonoContactoPasajero,
      observaciones: OBSERVACIONES_RESERVA,
      subtotalReserva: lineaApi.subtotalLinea,
      valorIva: lineaApi.valorIvaLinea,
      totalReserva: lineaApi.totalLinea,
      pasajero: pasajeroInput,
      detalles: [
        {
          idPasajero: pasajero.idPasajero ?? 0,
          idAsiento: asiento.idAsiento,
          subtotalLinea: lineaApi.subtotalLinea,
          valorIvaLinea: lineaApi.valorIvaLinea,
          totalLinea: lineaApi.totalLinea,
          pasajero: pasajeroInput,
        },
      ],
    };

    const validationMessage = validarCrearReservaInput(input);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const result = await crearReserva({
      variables: { input },
    });

    const reserva = result.data?.crearReserva;
    if (reserva) {
      setReserva(reserva);
      setDetalle(reserva.detalles[0] ?? null);
      router.push(Routes.pago);
    }
  };

  if (missingStepMessage) {
    return (
      <ScreenContainer>
        <StateMessage title="Checkout incompleto" description={missingStepMessage} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={5} />

      <StateMessage
        title="Paso 1 de 2: Crear reserva"
        description="Generamos la reserva con tarifa y asiento. El equipaje de bodega se cobra al confirmar el pago."
      />

      <SummaryCard title="Resumen de reserva">
        <ThemedText style={styles.line}>{vuelo?.numeroVuelo}</ThemedText>
        <ThemedText style={styles.muted}>
          {pasajero?.nombrePasajero} {pasajero?.apellidoPasajero}
        </ThemedText>
        <ThemedText style={styles.muted}>Asiento {asiento?.numeroAsiento}</ThemedText>
        <ThemedText style={styles.muted}>
          Equipaje bodega: {equipaje.equipajeBodega ? 'Sí (se cobra en el pago)' : 'No'}
        </ThemedText>
        {totalesCalculados ? <PriceBreakdown totales={totalesCalculados} /> : null}
      </SummaryCard>

      {loading ? (
        <StateMessage
          title="Creando reserva..."
          description="Estamos registrando tu reserva. Este paso suele tardar unos segundos."
          loading
        />
      ) : null}

      {!isAuthenticated ? (
        <StateMessage title="Sesión requerida" description="Inicia sesión para crear la reserva." />
      ) : null}

      {!idCliente ? (
        <StateMessage
          title="Cliente no identificado"
          description="Tu sesión no contiene idCliente. Cierra sesión e ingresa nuevamente."
          variant="error"
        />
      ) : null}

      {validationError ? (
        <StateMessage title="Datos incompletos" description={validationError} variant="error" />
      ) : null}

      {error ? (
        <StateMessage
          title="Error al crear reserva"
          description={formatGraphqlError(error)}
          variant="error"
        />
      ) : null}

      <PrimaryButton
        label={loading ? 'Creando reserva...' : 'Crear reserva'}
        onPress={handleCrear}
        loading={loading}
        disabled={!isAuthenticated || !idCliente || loading}
      />
    </ScreenContainer>
  );
}

const styles = {
  line: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Brand.text,
  },
  muted: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '500' as const,
  },
};
