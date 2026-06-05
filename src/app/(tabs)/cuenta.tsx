import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandHeader } from '@/components/marketplace/BrandHeader';
import { PrimaryButton } from '@/components/marketplace/PrimaryButton';
import { ScreenContainer } from '@/components/marketplace/ScreenContainer';
import { SummaryCard } from '@/components/marketplace/SummaryCard';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { resolveGraphqlUri } from '@/graphql/apolloClient';
import { Brand, Spacing } from '@/constants/theme';
import { Routes } from '@/utils/navigation';

export default function CuentaScreen() {
  const router = useRouter();
  const { isAuthenticated, usuario, rol, logout } = useAuth();

  const nombre =
    [usuario?.nombres, usuario?.apellidos].filter(Boolean).join(' ') ||
    usuario?.username ||
    'Cliente';

  return (
    <ScreenContainer withTabInset>
      <BrandHeader subtitle="Tu portal de cliente NachoFlights" compact />

      <SummaryCard title="Sesión">
        {isAuthenticated ? (
          <>
            <ThemedText style={styles.line}>{nombre}</ThemedText>
            <ThemedText style={styles.muted}>Usuario: {usuario?.username ?? '—'}</ThemedText>
            <ThemedText style={styles.muted}>Rol: {rol ?? 'CLIENTE'}</ThemedText>
            <PrimaryButton label="Cerrar sesión" onPress={logout} variant="outline" />
          </>
        ) : (
          <>
            <ThemedText style={styles.muted}>
              Inicia sesión para crear reservas, pagar y consultar tu historial.
            </ThemedText>
            <PrimaryButton label="Iniciar sesión" onPress={() => router.push(Routes.login)} />
            <PrimaryButton
              label="Crear cuenta"
              onPress={() => router.push(Routes.registro)}
              variant="secondary"
            />
          </>
        )}
      </SummaryCard>

      <SummaryCard title="Mis documentos">
        <PrimaryButton label="Mis reservas" onPress={() => router.push(Routes.misReservas)} variant="secondary" />
        <PrimaryButton label="Mis boletos" onPress={() => router.push(Routes.misBoletos)} variant="secondary" />
        <PrimaryButton label="Mis facturas" onPress={() => router.push(Routes.misFacturas)} variant="secondary" />
      </SummaryCard>

      <View style={styles.tech}>
        <ThemedText style={styles.techLabel}>GraphQL BFF</ThemedText>
        <ThemedText style={styles.techValue}>{resolveGraphqlUri()}</ThemedText>
      </View>
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
  tech: {
    gap: Spacing.one,
    paddingBottom: Spacing.four,
  },
  techLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  techValue: {
    fontSize: 12,
    color: Brand.textMuted,
  },
});
