import { gql } from '@apollo/client';

export const REGISTRAR_PASAJERO = gql`
  mutation RegistrarPasajero($input: RegistrarPasajeroInput!) {
    registrarPasajero(input: $input) {
      idPasajero
      idCliente
      nombrePasajero
      apellidoPasajero
      tipoDocumentoPasajero
      numeroDocumentoPasajero
      emailContactoPasajero
      telefonoContactoPasajero
      estado
    }
  }
`;

export const CREAR_RESERVA = gql`
  mutation CrearReserva($input: CrearReservaInput!) {
    crearReserva(input: $input) {
      idReserva
      codigoReserva
      idCliente
      idVuelo
      totalReserva
      estadoReserva
      detalles {
        idDetalle
        idPasajero
        idAsiento
        totalLinea
      }
    }
  }
`;

export type CrearReservaPasajeroInput = {
  idCliente?: number | null;
  nombrePasajero: string;
  apellidoPasajero: string;
  tipoDocumentoPasajero: string;
  numeroDocumentoPasajero: string;
  emailContactoPasajero?: string | null;
  telefonoContactoPasajero?: string | null;
  requiereAsistencia?: boolean;
};

export const PAGAR_RESERVA = gql`
  mutation PagarReserva($idReserva: Int!, $input: PagarReservaInput!) {
    pagarReserva(idReserva: $idReserva, input: $input) {
      idReserva
      codigoReserva
      estadoReserva
      totalReserva
      mensaje
    }
  }
`;
