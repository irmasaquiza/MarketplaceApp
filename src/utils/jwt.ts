export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;

    const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

    if (typeof globalThis.atob === 'function') {
      return JSON.parse(globalThis.atob(padded)) as Record<string, unknown>;
    }

    return null;
  } catch {
    return null;
  }
}

export function extractIdClienteFromPayload(
  payload: Record<string, unknown> | null,
): number | null {
  if (!payload) return null;

  const raw =
    payload.id_cliente ??
    payload.idCliente ??
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function extractRoleFromPayload(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;

  const role =
    payload.role ??
    payload.rol ??
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  if (Array.isArray(role)) {
    return String(role[0] ?? '');
  }

  return role ? String(role) : null;
}
