import { resolveApiBaseUrl } from '@/api/config';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterClientePayload = {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombres: string;
  apellidos?: string;
  correo: string;
  telefono: string;
  direccion: string;
  idCiudadResidencia: number;
  idPaisNacionalidad: number;
  username: string;
  password: string;
  genero?: string;
  fechaNacimiento?: string;
  razonSocial?: string;
};

export type AuthUsuario = {
  idUsuario?: number;
  idCliente?: number;
  username?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  [key: string]: unknown;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type LoginDataRaw = {
  token: string;
  usuario?: string | AuthUsuario;
  rol?: string | string[];
  roles?: string[];
  expiracion?: string;
};

export type LoginResult = {
  token: string;
  usuario: AuthUsuario;
  rol: string | null;
};

async function requestEnvelope<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T> & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message ?? `Error ${response.status} al comunicarse con el servidor.`);
  }

  if (body.data !== undefined) {
    return body.data;
  }

  return body as T;
}

function normalizeUsuario(usuario: string | AuthUsuario | undefined, usernameFallback: string): AuthUsuario {
  if (!usuario) {
    return { username: usernameFallback };
  }

  if (typeof usuario === 'string') {
    return { username: usuario };
  }

  return {
    ...usuario,
    username: usuario.username ?? usernameFallback,
  };
}

function normalizeRol(data: LoginDataRaw): string | null {
  if (Array.isArray(data.roles) && data.roles.length > 0) {
    return data.roles[0];
  }

  if (Array.isArray(data.rol) && data.rol.length > 0) {
    return data.rol[0];
  }

  if (typeof data.rol === 'string') {
    return data.rol;
  }

  return null;
}

export async function loginApi(credentials: LoginCredentials): Promise<LoginResult> {
  const data = await requestEnvelope<LoginDataRaw>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return {
    token: data.token,
    usuario: normalizeUsuario(data.usuario, credentials.username),
    rol: normalizeRol(data),
  };
}

export async function registerClienteApi(payload: RegisterClientePayload) {
  return requestEnvelope<{ idCliente: number; username: string; rolAsignado: string }>(
    '/auth/register-cliente',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function logoutApi(token: string) {
  return fetch(`${resolveApiBaseUrl()}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
