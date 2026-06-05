import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Usuario y contraseña son requeridos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ username: username.trim(), password });

      if (typeof redirect === 'string' && redirect.length > 0) {
        router.replace(redirect as never);
        return;
      }

      router.replace(Routes.cuenta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <BrandHeader subtitle="Inicia sesión en tu cuenta" />

      <View style={styles.card}>
        {error ? <StateMessage title={error} variant="error" /> : null}

        <FormField
          label="Usuario"
          value={username}
          onChangeText={setUsername}
          placeholder="Ingresa tu usuario"
          autoCapitalize="none"
        />
        <FormField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
        />

        <PrimaryButton
          label="Iniciar sesión"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <Pressable onPress={() => router.push(Routes.registro)}>
          <ThemedText style={styles.link}>
            ¿No tienes cuenta? <ThemedText style={styles.linkBold}>Regístrate</ThemedText>
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
  link: {
    textAlign: 'center',
    color: Brand.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  linkBold: {
    color: Brand.primary,
    fontWeight: '800',
  },
});
