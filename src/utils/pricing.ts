export const IVA_RATE = 0.15;
export const COSTO_BODEGA = 45;
export const CARGO_SERVICIO_DEFAULT = 0;

export type LineaReserva = {
  subtotalLinea: number;
  valorIvaLinea: number;
  totalLinea: number;
};

export type TotalesCheckout = {
  precioBase: number;
  precioExtraAsiento: number;
  costoEquipaje: number;
  subtotalReserva: number;
  valorIvaReserva: number;
  totalReserva: number;
  subtotalEquipaje: number;
  valorIvaEquipaje: number;
  totalEquipaje: number;
  subtotalGeneral: number;
  valorIvaGeneral: number;
  cargoServicio: number;
  totalGeneral: number;
};

export function calcularLineaReserva(
  precioBase: number,
  precioExtra: number,
  costoEquipaje = 0,
): LineaReserva {
  const subtotalLinea = round2(precioBase + precioExtra + costoEquipaje);
  const valorIvaLinea = round2(subtotalLinea * IVA_RATE);
  const totalLinea = round2(subtotalLinea + valorIvaLinea);

  return {
    subtotalLinea,
    valorIvaLinea,
    totalLinea,
  };
}

/** Tarifa + asiento para crearReserva (sin equipaje de bodega). */
export function calcularLineaReservaApi(precioBase: number, precioExtra: number): LineaReserva {
  return calcularLineaReserva(precioBase, precioExtra, 0);
}

export function calcularTotalesCheckout(params: {
  precioBase: number;
  precioExtraAsiento: number;
  equipajeBodega: boolean;
  costoBodega?: number;
  cargoServicio?: number;
}): TotalesCheckout {
  const costoEquipaje = params.equipajeBodega ? (params.costoBodega ?? COSTO_BODEGA) : 0;
  const cargoServicio = params.cargoServicio ?? CARGO_SERVICIO_DEFAULT;

  const lineaReserva = calcularLineaReservaApi(params.precioBase, params.precioExtraAsiento);
  const lineaEquipaje =
    costoEquipaje > 0
      ? calcularLineaReserva(0, 0, costoEquipaje)
      : { subtotalLinea: 0, valorIvaLinea: 0, totalLinea: 0 };

  const subtotalGeneral = round2(lineaReserva.subtotalLinea + lineaEquipaje.subtotalLinea);
  const valorIvaGeneral = round2(lineaReserva.valorIvaLinea + lineaEquipaje.valorIvaLinea);
  const totalGeneral = round2(subtotalGeneral + valorIvaGeneral + cargoServicio);

  return {
    precioBase: params.precioBase,
    precioExtraAsiento: params.precioExtraAsiento,
    costoEquipaje,
    subtotalReserva: lineaReserva.subtotalLinea,
    valorIvaReserva: lineaReserva.valorIvaLinea,
    totalReserva: lineaReserva.totalLinea,
    subtotalEquipaje: lineaEquipaje.subtotalLinea,
    valorIvaEquipaje: lineaEquipaje.valorIvaLinea,
    totalEquipaje: lineaEquipaje.totalLinea,
    subtotalGeneral,
    valorIvaGeneral,
    cargoServicio,
    totalGeneral,
  };
}

export function buildCheckoutTotales(params: {
  precioBase: number;
  precioExtraAsiento: number;
  equipajeBodega: boolean;
  costoBodega?: number;
}): TotalesCheckout {
  return calcularTotalesCheckout({
    precioBase: params.precioBase,
    precioExtraAsiento: params.precioExtraAsiento,
    equipajeBodega: params.equipajeBodega,
    costoBodega: params.costoBodega,
  });
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
