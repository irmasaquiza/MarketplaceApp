import { Tabs } from 'expo-router';

import { Brand } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: Brand.textMuted,
        tabBarStyle: {
          backgroundColor: Brand.surface,
          borderTopColor: Brand.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vuelos',
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Mi cuenta',
        }}
      />
      <Tabs.Screen
        name="mis-reservas"
        options={{
          href: null,
          title: 'Mis reservas',
          headerShown: true,
          headerStyle: { backgroundColor: Brand.primary },
          headerTintColor: Brand.white,
        }}
      />
      <Tabs.Screen
        name="mis-boletos"
        options={{
          href: null,
          title: 'Mis boletos',
          headerShown: true,
          headerStyle: { backgroundColor: Brand.primary },
          headerTintColor: Brand.white,
        }}
      />
      <Tabs.Screen
        name="mis-facturas"
        options={{
          href: null,
          title: 'Mis facturas',
          headerShown: true,
          headerStyle: { backgroundColor: Brand.primary },
          headerTintColor: Brand.white,
        }}
      />
    </Tabs>
  );
}
