import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckoutStepper } from '@/components/marketplace/CheckoutStepper';
import { FormField } from '@/components/marketplace/FormField';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { REGISTRAR_PASAJERO } from '@/graphql/mutations/marketplaceMutations';
import type { RegistrarPasajeroData } from '@/graphql/types/marketplaceTypes';
import { Routes, vueloAsientosHref } from '@/utils/navigation';

export default function PasajerosScreen() {
  const router = useRouter();
  const { isAuthenticated, idCliente } = useAuth();
  const { setPasajero, vuelo, pasajero } = useCheckout();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CEDULA');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [registrarPasajero, { loading, error }] = useMutation<RegistrarPasajeroData>(REGISTRAR_PASAJERO);

  const irLogin = () => {
    router.push({ pathname: Routes.login, params: { redirect: Routes.pasajero } });
  };

  const handleContinuar = async () => {
    setFormError(null);

    if (!nombre.trim() || !apellido.trim() || !numeroDocumento.trim()) {
      setFormError('Completa nombre, apellido y número de documento.');
      return;
    }

    if (!email.trim()) {
      setFormError('El email de contacto es obligatorio para la reserva.');
      return;
    }

    const input = {
      idCliente: idCliente ?? undefined,
      nombrePasajero: nombre.trim(),
      apellidoPasajero: apellido.trim(),
      tipoDocumentoPasajero: tipoDocumento,
      numeroDocumentoPasajero: numeroDocumento.trim(),
      emailContactoPasajero: email.trim(),
      telefonoContactoPasajero: telefono.trim(),
      requiereAsistencia: false,
    };

    const result = await registrarPasajero({
      variables: { input },
    });

    const pasajeroCreado = result.data?.registrarPasajero;
    if (pasajeroCreado?.idPasajero && vuelo) {
      setPasajero(pasajeroCreado);
      router.push(vueloAsientosHref(vuelo.idVuelo));
      return;
    }

    setFormError('No se pudo registrar el pasajero. Intenta nuevamente.');
  };

  if (!vuelo) {
    return (
      <ScreenContainer>
        <StateMessage title="Selecciona un vuelo primero" />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <CheckoutStepper pasoActual={2} />
        <StateMessage
          title="Inicia sesión para continuar"
          description="Necesitas una cuenta de cliente para registrar pasajeros y crear reservas."
        />
        <PrimaryButton label="Iniciar sesión" onPress={irLogin} />
        <PrimaryButton label="Crear cuenta" onPress={() => router.push(Routes.registro)} variant="secondary" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <CheckoutStepper pasoActual={2} />

      {pasajero?.idPasajero ? (
        <StateMessage
          title="Pasajero registrado"
          description={`${pasajero.nombrePasajero} ${pasajero.apellidoPasajero} ya está listo para continuar.`}
          variant="success"
        />
      ) : null}

      <View style={styles.card}>
        <ThemedText style={styles.title}>Datos del pasajero</ThemedText>
        <ThemedText style={styles.subtitle}>Vuelo {vuelo.numeroVuelo}</ThemedText>

        <FormField label="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
        <FormField label="Apellido" value={apellido} onChangeText={setApellido} autoCapitalize="words" />
        <FormField label="Tipo documento" value={tipoDocumento} onChangeText={setTipoDocumento} />
        <FormField label="Número documento" value={numeroDocumento} onChangeText={setNumeroDocumento} />
        <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormField label="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

        {formError ? (
          <StateMessage title="Datos incompletos" description={formError} variant="error" />
        ) : null}

        {error ? (
          <StateMessage title="No se pudo realizar la reserva" description="Ocurrió un error al registrar el pasajero. Por favor intenta nuevamente." variant="error" />
        ) : null}

        <PrimaryButton
          label={loading ? 'Guardando...' : pasajero?.idPasajero ? 'Actualizar y continuar' : 'Registrar y continuar'}
          onPress={handleContinuar}
          loading={loading}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 14,
    color: Brand.textMuted,
    fontWeight: '600',
  },
});
