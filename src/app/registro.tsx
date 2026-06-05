import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BrandHeader } from '@/components/marketplace/BrandHeader';
import { FormField } from '@/components/marketplace/FormField';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Brand, CardRadius, Spacing } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function RegistroScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [tipoIdentificacion, setTipoIdentificacion] = useState('CEDULA');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('Quito, Ecuador');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombres.trim() || !numeroIdentificacion.trim() || !correo.trim() || !username.trim()) {
      setError('Completa los campos obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        tipoIdentificacion,
        numeroIdentificacion: numeroIdentificacion.trim(),
        nombres: nombres.trim(),
        apellidos: apellidos.trim() || undefined,
        correo: correo.trim(),
        telefono: telefono.trim() || '0999999999',
        direccion: direccion.trim(),
        idCiudadResidencia: 1,
        idPaisNacionalidad: 1,
        username: username.trim(),
        password,
      });

      router.replace(Routes.cuenta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <BrandHeader subtitle="Crea tu cuenta para completar tu reserva" />

      <View style={styles.card}>
        {error ? <StateMessage title={error} variant="error" /> : null}

        <ThemedText style={styles.section}>Datos de identificación</ThemedText>
        <FormField label="Tipo identificación" value={tipoIdentificacion} onChangeText={setTipoIdentificacion} />
        <FormField label="Número identificación" value={numeroIdentificacion} onChangeText={setNumeroIdentificacion} />
        <FormField label="Nombres" value={nombres} onChangeText={setNombres} autoCapitalize="words" />
        <FormField label="Apellidos" value={apellidos} onChangeText={setApellidos} autoCapitalize="words" />

        <ThemedText style={styles.section}>Contacto</ThemedText>
        <FormField label="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        <FormField label="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <FormField label="Dirección" value={direccion} onChangeText={setDireccion} />

        <ThemedText style={styles.section}>Cuenta de acceso</ThemedText>
        <FormField label="Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <FormField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <FormField
          label="Confirmar contraseña"
          value={confirmarPassword}
          onChangeText={setConfirmarPassword}
          secureTextEntry
        />

        <PrimaryButton label="Crear cuenta" onPress={handleRegistro} loading={loading} />

        <Pressable onPress={() => router.push(Routes.login)}>
          <ThemedText style={styles.link}>
            ¿Ya tienes cuenta? <ThemedText style={styles.linkBold}>Inicia sesión</ThemedText>
          </ThemedText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
    paddingBottom: Spacing.one,
    marginTop: Spacing.one,
  },
  link: {
    textAlign: 'center',
    color: Brand.textMuted,
    fontSize: 14,
  },
  linkBold: {
    color: Brand.primary,
    fontWeight: '800',
  },
});
