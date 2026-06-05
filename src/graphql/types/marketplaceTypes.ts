import type {
  AsientoSeleccionado,
  PasajeroRegistrado,
  PagoResultado,
  ReservaCreada,
  VueloDetalle,
  VueloResumen,
} from '@/context/CheckoutContext';

export type AeropuertoItem = {
  idAeropuerto: number;
  codigoIata: string;
  nombre: string;
  ciudad?: string | null;
  pais?: string | null;
};

export type AeropuertosData = {
  aeropuertos: AeropuertoItem[];
};

export type BuscarVuelosData = {
  buscarVuelos: VueloResumen[];
};

export type VueloDetalleData = {
  vueloDetalle: VueloDetalle;
};

export type AsientosPorVueloData = {
  asientosPorVuelo: AsientoSeleccionado[];
};

export type MisReservasData = {
  misReservas: ReservaPortal[];
};

export type MisBoletosData = {
  misBoletos: BoletoPortal[];
};

export type MisFacturasData = {
  misFacturas: FacturaPortal[];
};

export type RegistrarPasajeroData = {
  registrarPasajero: PasajeroRegistrado;
};

export type CrearReservaData = {
  crearReserva: ReservaCreada;
};

export type PagarReservaData = {
  pagarReserva: PagoResultado;
};

export type ReservaPortal = {
  idReserva: number;
  codigoReserva: string;
  idVuelo: number;
  numeroVuelo: string;
  fechaReservaUtc: string;
  totalReserva: number;
  estadoReserva: string;
};

export type BoletoPortal = {
  idBoleto: number;
  codigoBoleto: string;
  idVuelo: number;
  numeroVuelo: string;
  numeroAsiento: string;
  clase: string;
  precioFinal: number;
  estadoBoleto: string;
  codigoReserva: string;
};

export type FacturaPortal = {
  idFactura: number;
  numeroFactura: string;
  codigoReserva: string;
  fechaEmision: string;
  subtotal: number;
  valorIva: number;
  total: number;
  estadoFactura: string;
};
