import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { TotalesCheckout } from '@/utils/pricing';



export type VueloResumen = {

  idVuelo: number;

  numeroVuelo: string;

  codigoIataOrigen: string;

  nombreAeropuertoOrigen: string;

  codigoIataDestino: string;

  nombreAeropuertoDestino: string;

  fechaHoraSalida: string;

  fechaHoraLlegada: string;

  duracionMin: number;

  precioBase: number;

  precioTotal: number;

  asientosDisponibles: number;

  estadoVuelo: string;

};



export type VueloDetalle = VueloResumen & {

  capacidadTotal: number;

  disponibilidadPorClase?: Array<{

    clase: string;

    asientosDisponibles: number;

    precioBase: number;

  }>;

};



export type AsientoSeleccionado = {

  idAsiento: number;

  numeroAsiento: string;

  clase: string;

  disponible: boolean;

  precioExtra: number;

  posicion?: string | null;

};



export type PasajeroRegistrado = {

  idPasajero: number;

  idCliente?: number | null;

  nombrePasajero: string;

  apellidoPasajero: string;

  tipoDocumentoPasajero: string;

  numeroDocumentoPasajero: string;

  emailContactoPasajero?: string | null;

  telefonoContactoPasajero?: string | null;

  estado: string;

};



export type ReservaCreada = {

  idReserva: number;

  codigoReserva: string;

  idCliente: number;

  idVuelo: number;

  totalReserva: number;

  estadoReserva: string;

  detalles: Array<{

    idDetalle: number;

    idPasajero: number;

    idAsiento: number;

    totalLinea: number;

  }>;

};



export type PagoResultado = {

  idReserva: number;

  codigoReserva: string;

  estadoReserva: string;

  totalReserva: number;

  mensaje: string;

};



export type EquipajeSeleccion = {

  equipajeMano: boolean;

  equipajeBodega: boolean;

  pesoManoKg: number;

  pesoBodegaKg: number;

  costoBodega: number;

};



type CheckoutSnapshot = {

  vuelo: VueloResumen | null;

  vueloDetalle: VueloDetalle | null;

  asiento: AsientoSeleccionado | null;

  pasajero: PasajeroRegistrado | null;

  reserva: ReservaCreada | null;

  detalle: ReservaCreada['detalles'][number] | null;

  pago: PagoResultado | null;

  equipaje: EquipajeSeleccion;

  claseSeleccionada: string;

  totales: TotalesCheckout | null;

};



type CheckoutContextValue = CheckoutSnapshot & {

  isHydrated: boolean;

  setVuelo: (vuelo: VueloResumen | null) => void;

  setVueloDetalle: (vuelo: VueloDetalle | null) => void;

  setAsiento: (asiento: AsientoSeleccionado | null) => void;

  setPasajero: (pasajero: PasajeroRegistrado | null) => void;

  setReserva: (reserva: ReservaCreada | null) => void;

  setDetalle: (detalle: ReservaCreada['detalles'][number] | null) => void;

  setPago: (pago: PagoResultado | null) => void;

  setEquipaje: (equipaje: EquipajeSeleccion) => void;

  setClaseSeleccionada: (clase: string) => void;

  setTotales: (totales: TotalesCheckout | null) => void;

  resetCheckout: () => void;

};



const CheckoutContext = createContext<CheckoutContextValue | null>(null);

const CHECKOUT_STORAGE_KEY = 'marketplace.checkout';



export const EQUIPAJE_DEFAULT: EquipajeSeleccion = {

  equipajeMano: true,

  equipajeBodega: false,

  pesoManoKg: 10,

  pesoBodegaKg: 23,

  costoBodega: 45,

};



const EMPTY_CHECKOUT: CheckoutSnapshot = {

  vuelo: null,

  vueloDetalle: null,

  asiento: null,

  pasajero: null,

  reserva: null,

  detalle: null,

  pago: null,

  equipaje: EQUIPAJE_DEFAULT,

  claseSeleccionada: 'ECONOMICA',

  totales: null,

};



export function CheckoutProvider({ children }: { children: ReactNode }) {

  const [snapshot, setSnapshot] = useState<CheckoutSnapshot>(EMPTY_CHECKOUT);

  const [isHydrated, setIsHydrated] = useState(false);



  useEffect(() => {

    AsyncStorage.getItem(CHECKOUT_STORAGE_KEY)

      .then((raw) => {

        if (!raw) return;

        const parsed = JSON.parse(raw) as Partial<CheckoutSnapshot>;

        setSnapshot({

          ...EMPTY_CHECKOUT,

          ...parsed,

          equipaje: { ...EQUIPAJE_DEFAULT, ...parsed.equipaje },

        });

      })

      .catch(() => undefined)

      .finally(() => setIsHydrated(true));

  }, []);



  const persist = useCallback(async (next: CheckoutSnapshot) => {

    try {

      await AsyncStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(next));

    } catch {

      // Si falla la persistencia, el flujo en memoria sigue funcionando.

    }

  }, []);



  const updateSnapshot = useCallback(

    (updater: (current: CheckoutSnapshot) => CheckoutSnapshot) => {

      setSnapshot((current) => {

        const next = updater(current);

        void persist(next);

        return next;

      });

    },

    [persist],

  );



  const setVuelo = useCallback(

    (vuelo: VueloResumen | null) => updateSnapshot((current) => ({ ...current, vuelo })),

    [updateSnapshot],

  );



  const setVueloDetalle = useCallback(

    (vueloDetalle: VueloDetalle | null) =>

      updateSnapshot((current) => ({ ...current, vueloDetalle })),

    [updateSnapshot],

  );



  const setAsiento = useCallback(

    (asiento: AsientoSeleccionado | null) => updateSnapshot((current) => ({ ...current, asiento })),

    [updateSnapshot],

  );



  const setPasajero = useCallback(

    (pasajero: PasajeroRegistrado | null) =>

      updateSnapshot((current) => ({ ...current, pasajero })),

    [updateSnapshot],

  );



  const setReserva = useCallback(

    (reserva: ReservaCreada | null) => updateSnapshot((current) => ({ ...current, reserva })),

    [updateSnapshot],

  );



  const setDetalle = useCallback(

    (detalle: ReservaCreada['detalles'][number] | null) =>

      updateSnapshot((current) => ({ ...current, detalle })),

    [updateSnapshot],

  );



  const setPago = useCallback(

    (pago: PagoResultado | null) => updateSnapshot((current) => ({ ...current, pago })),

    [updateSnapshot],

  );



  const setEquipaje = useCallback(

    (equipaje: EquipajeSeleccion) => updateSnapshot((current) => ({ ...current, equipaje })),

    [updateSnapshot],

  );



  const setClaseSeleccionada = useCallback(

    (claseSeleccionada: string) =>

      updateSnapshot((current) => ({ ...current, claseSeleccionada })),

    [updateSnapshot],

  );

  const setTotales = useCallback(
    (totales: TotalesCheckout | null) => updateSnapshot((current) => ({ ...current, totales })),
    [updateSnapshot],
  );

  const resetCheckout = useCallback(() => {

    setSnapshot(EMPTY_CHECKOUT);

    void AsyncStorage.removeItem(CHECKOUT_STORAGE_KEY);

  }, []);



  const value = useMemo(

    () => ({

      ...snapshot,

      isHydrated,

      setVuelo,

      setVueloDetalle,

      setAsiento,

      setPasajero,

      setReserva,

      setDetalle,

      setPago,

      setEquipaje,

      setClaseSeleccionada,

      setTotales,

      resetCheckout,

    }),

    [

      snapshot,

      isHydrated,

      setVuelo,

      setVueloDetalle,

      setAsiento,

      setPasajero,

      setReserva,

      setDetalle,

      setPago,

      setEquipaje,

      setClaseSeleccionada,

      setTotales,

      resetCheckout,

    ],

  );



  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;

}



export function useCheckout() {

  const context = useContext(CheckoutContext);



  if (!context) {

    throw new Error('useCheckout debe usarse dentro de CheckoutProvider');

  }



  return context;

}

