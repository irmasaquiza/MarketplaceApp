import { gql } from '@apollo/client';

export const AEROPUERTOS = gql`
  query Aeropuertos($nombre: String, $idPais: Int, $limit: Int) {
    aeropuertos(nombre: $nombre, idPais: $idPais, limit: $limit) {
      idAeropuerto
      codigoIata
      nombre
      ciudad
      pais
    }
  }
`;

export const BUSCAR_VUELOS = gql`
  query BuscarVuelos($input: BuscarVuelosInput!) {
    buscarVuelos(input: $input) {
      idVuelo
      numeroVuelo
      codigoIataOrigen
      nombreAeropuertoOrigen
      codigoIataDestino
      nombreAeropuertoDestino
      fechaHoraSalida
      fechaHoraLlegada
      duracionMin
      precioBase
      precioTotal
      asientosDisponibles
      estadoVuelo
    }
  }
`;

export const VUELO_DETALLE = gql`
  query VueloDetalle($idVuelo: Int!) {
    vueloDetalle(idVuelo: $idVuelo) {
      idVuelo
      numeroVuelo
      codigoIataOrigen
      nombreAeropuertoOrigen
      codigoIataDestino
      nombreAeropuertoDestino
      fechaHoraSalida
      fechaHoraLlegada
      duracionMin
      precioBase
      capacidadTotal
      estadoVuelo
      disponibilidadPorClase {
        clase
        asientosDisponibles
        precioBase
      }
    }
  }
`;

export const ASIENTOS_POR_VUELO = gql`
  query AsientosPorVuelo($idVuelo: Int!, $clase: String) {
    asientosPorVuelo(idVuelo: $idVuelo, clase: $clase) {
      idAsiento
      numeroAsiento
      clase
      disponible
      precioExtra
      posicion
    }
  }
`;

export const MIS_RESERVAS = gql`
  query MisReservas {
    misReservas {
      idReserva
      codigoReserva
      idVuelo
      numeroVuelo
      fechaReservaUtc
      totalReserva
      estadoReserva
    }
  }
`;

export const MIS_BOLETOS = gql`
  query MisBoletos {
    misBoletos {
      idBoleto
      codigoBoleto
      idVuelo
      numeroVuelo
      numeroAsiento
      clase
      precioFinal
      estadoBoleto
      codigoReserva
    }
  }
`;

export const MIS_FACTURAS = gql`
  query MisFacturas {
    misFacturas {
      idFactura
      numeroFactura
      codigoReserva
      fechaEmision
      subtotal
      valorIva
      total
      estadoFactura
    }
  }
`;
