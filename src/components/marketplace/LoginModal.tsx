import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { FormField } from '@/components/marketplace/FormField';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { StateMessage } from '@/components/marketplace/StateMessage';
import { ThemedText } from '@/components/themed-text';
import { Brand, CardRadius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

type LoginModalProps = {
  visible: boolean;
  onAuthenticated: () => void;
  onCancel?: () => void;
};

export function LoginModal({ visible, onAuthenticated, onCancel }: LoginModalProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Usuario y contrasena son requeridos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ username: username.trim(), password });
      setPassword('');
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>Inicia sesion</ThemedText>
              <ThemedText style={styles.subtitle}>
                Autenticate para ver vuelos y elegir asientos.
              </ThemedText>
            </View>

            {onCancel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar login"
                onPress={onCancel}
                style={styles.closeButton}>
                <ThemedText style={styles.closeText}>X</ThemedText>
              </Pressable>
            ) : null}
          </View>

          {error ? <StateMessage title={error} variant="error" /> : null}

          <FormField
            label="Usuario"
            value={username}
            onChangeText={setUsername}
            placeholder="Ingresa tu usuario"
            autoCapitalize="none"
          />
          <FormField
            label="Contrasena"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contrasena"
            secureTextEntry
          />

          <PrimaryButton
            label={loading ? 'Ingresando...' : 'Iniciar sesion'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: Brand.surface,
    borderRadius: CardRadius,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#111827',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.text,
  },
  subtitle: {
    marginTop: Spacing.one,
    fontSize: 14,
    fontWeight: '500',
    color: Brand.textMuted,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.inputBg,
  },
  closeText: {
    color: Brand.textMuted,
    fontWeight: '800',
  },
});
