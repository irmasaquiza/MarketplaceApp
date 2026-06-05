import type { Href } from 'expo-router';

export const Routes = {
  home: '/',
  cuenta: '/cuenta',
  login: '/login',
  registro: '/registro',
  pasajero: '/pasajero',
  equipaje: '/equipaje',
  reserva: '/reserva',
  pago: '/pago',
  confirmacion: '/confirmacion',
  misReservas: '/mis-reservas',
  misBoletos: '/mis-boletos',
  misFacturas: '/mis-facturas',
} as const satisfies Record<string, Href>;

export function appHref(path: string): Href {
  return path as Href;
}

export function vueloDetalleHref(idVuelo: number): Href {
  return {
    pathname: '/vuelo/[id]',
    params: { id: String(idVuelo) },
  };
}

export function vueloAsientosHref(idVuelo: number): Href {
  return {
    pathname: '/vuelo/[id]/asientos',
    params: { id: String(idVuelo) },
  };
}
