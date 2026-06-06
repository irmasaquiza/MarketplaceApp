import { useLazyQuery, useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandHeader } from '@/components/marketplace/BrandHeader';
import { ComboBox } from '@/components/marketplace/ComboBox';
import { DateField, toIsoDateStart } from '@/components/marketplace/DateField';
import { FlightCard } from '@/components/marketplace/FlightCard';
import { LoginModal } from '@/components/marketplace/LoginModal';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { AEROPUERTOS, BUSCAR_VUELOS } from '@/graphql/queries/marketplaceQueries';
import type { AeropuertosData, BuscarVuelosData } from '@/graphql/types/marketplaceTypes';
import { formatGraphqlError } from '@/utils/graphqlError';
import { vueloDetalleHref } from '@/utils/navigation';
import { Brand, CardRadius, Spacing } from '@/constants/theme';

const DEFAULT_ORIGEN = 'UIO';
const DEFAULT_DESTINO = 'GYE';
const CLASE_OPTIONS = [
  { value: 'ECONOMICA', label: 'ECONOMICA' },
  { value: 'PRIMERA', label: 'PRIMERA' },
  { value: 'EJECUTIVA', label: 'EJECUTIVA' },
];

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function BuscarVuelosScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { setVuelo, setClaseSeleccionada, resetCheckout } = useCheckout();

  const [origen, setOrigen] = useState(DEFAULT_ORIGEN);
  const [destino, setDestino] = useState(DEFAULT_DESTINO);
  const [fecha, setFecha] = useState(tomorrowDate());
  const [clase, setClase] = useState('ECONOMICA');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: aeropuertosData,
    loading: loadingAeropuertos,
    error: aeropuertosError,
  } = useQuery<AeropuertosData>(AEROPUERTOS, {
    variables: { limit: 100 },
  });

  const [buscarVuelos, { data, loading, error, called }] =
    useLazyQuery<BuscarVuelosData>(BUSCAR_VUELOS);

  const aeropuertoOptions = useMemo(
    () =>
      (aeropuertosData?.aeropuertos ?? []).map((aeropuerto) => ({
        value: aeropuerto.codigoIata,
        label: `${aeropuerto.codigoIata} - ${aeropuerto.nombre}`,
      })),
    [aeropuertosData],
  );

  const vuelos = data?.buscarVuelos ?? [];
  const canShowResults = isAuthenticated && hasSearched;

  const handleBuscar = () => {
    setSearchError(null);

    if (!origen || !destino) {
      setSearchError('Selecciona aeropuerto de origen y destino.');
      return;
    }

    if (origen === destino) {
      setSearchError('El aeropuerto de origen y destino deben ser diferentes.');
      return;
    }

    if (!fecha) {
      setSearchError('Selecciona la fecha de salida.');
      return;
    }

    resetCheckout();
    setClaseSeleccionada(clase);
    setHasSearched(true);

    buscarVuelos({
      variables: {
        input: {
          origen,
          destino,
          fecha: toIsoDateStart(fecha),
          clase,
          page: 1,
          limit: 10,
        },
      },
    });

    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  const canSearch = Boolean(origen && destino && origen !== destino && fecha && !loadingAeropuertos);

  return (
    <ScreenContainer withTabInset>
      <BrandHeader subtitle="Encuentra tu próximo vuelo" compact />

      <View style={styles.searchCard}>
        <ThemedText style={styles.searchTitle}>Buscar vuelos</ThemedText>

        {aeropuertosError ? (
          <StateMessage
            title="No se cargaron aeropuertos"
            description={formatGraphqlError(aeropuertosError)}
            variant="error"
          />
        ) : null}

        <ComboBox
          label="Origen"
          value={origen}
          options={aeropuertoOptions}
          onChange={setOrigen}
          loading={loadingAeropuertos}
          placeholder="Selecciona aeropuerto de origen"
        />
        <ComboBox
          label="Destino"
          value={destino}
          options={aeropuertoOptions}
          onChange={setDestino}
          loading={loadingAeropuertos}
          placeholder="Selecciona aeropuerto de destino"
        />
        <DateField label="Fecha de salida" value={fecha} onChange={setFecha} minimumDate={new Date()} />
        <ComboBox
          label="Clase"
          value={clase}
          options={CLASE_OPTIONS}
          onChange={setClase}
          placeholder="Selecciona la clase"
          searchPlaceholder="Buscar clase..."
          emptyMessage="No hay clases disponibles."
        />

        {searchError ? (
          <StateMessage title="Búsqueda incompleta" description={searchError} variant="error" />
        ) : null}

        <PrimaryButton
          label={loading ? 'Buscando...' : 'Buscar vuelos'}
          onPress={handleBuscar}
          loading={loading}
          disabled={!canSearch}
        />
      </View>

      <LoginModal
        visible={showLoginModal && !isAuthenticated}
        onAuthenticated={() => setShowLoginModal(false)}
        onCancel={() => setShowLoginModal(false)}
      />

      {loading && hasSearched ? <StateMessage title="Buscando vuelos..." loading /> : null}

      {error && hasSearched ? (
        <StateMessage
          title="No se pudieron cargar los vuelos"
          description={formatGraphqlError(error)}
          variant="error"
        />
      ) : null}

      {called && hasSearched && !loading && !error && !canShowResults ? (
        <StateMessage
          title="Autenticacion requerida"
          description="Inicia sesion para ver los resultados disponibles y continuar con la seleccion de asientos."
        />
      ) : null}

      {called && canShowResults && !loading && !error && vuelos.length === 0 ? (
        <StateMessage
          title="Sin resultados"
          description="No hay vuelos para la ruta y fecha seleccionadas."
        />
      ) : null}

      {canShowResults && vuelos.length > 0 ? (
        <ThemedText style={styles.resultsTitle}>{vuelos.length} vuelos encontrados</ThemedText>
      ) : null}

      {canShowResults ? vuelos.map((vuelo) => (
        <FlightCard
          key={vuelo.idVuelo}
          vuelo={vuelo}
          onPress={() => {
            setVuelo(vuelo);
            router.push(vueloDetalleHref(vuelo.idVuelo));
          }}
        />
      )) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.text,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
