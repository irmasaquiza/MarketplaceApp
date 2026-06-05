import { Stack } from 'expo-router';

import { AppProviders } from '@/providers/AppProviders';
import { Brand } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Brand.primary },
          headerTintColor: Brand.white,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: Brand.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
        <Stack.Screen name="vuelo/[id]" options={{ title: 'Detalle del vuelo' }} />
        <Stack.Screen name="vuelo/[id]/asientos" options={{ title: 'Seleccionar asiento' }} />
        <Stack.Screen name="pasajero" options={{ title: 'Datos del pasajero' }} />
        <Stack.Screen name="equipaje" options={{ title: 'Equipaje' }} />
        <Stack.Screen name="reserva" options={{ title: 'Crear reserva' }} />
        <Stack.Screen name="pago" options={{ title: 'Pagar reserva' }} />
        <Stack.Screen name="confirmacion" options={{ title: 'Confirmación' }} />
      </Stack>
    </AppProviders>
  );
}
