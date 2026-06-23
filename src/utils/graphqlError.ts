type GraphQLErrorLike = {
  message?: string;
  extensions?: {
    message?: string;
    code?: string;
  };
};

type ErrorWithGraphql = Error & {
  graphQLErrors?: GraphQLErrorLike[];
  networkError?: Error | null;
};

export function formatGraphqlError(error: unknown): string {
  if (!error) return 'Ocurrió un error inesperado.';

  const apolloError = error as ErrorWithGraphql;
  const graphQLErrors = apolloError.graphQLErrors ?? [];

  if (graphQLErrors.length > 0) {
    const messages = graphQLErrors
      .map((item) => item.extensions?.message ?? item.message)
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join('\n');
    }
  }

  if (apolloError.networkError) {
    const netMsg = apolloError.networkError.message ?? '';
    if (netMsg.includes('AbortError')) {
      return 'La solicitud tardó demasiado. Verifica tu conexión e inténtalo de nuevo.';
    }
    // Network error or 500 — hide technical details
    return 'No se pudo realizar la reserva. Por favor intenta nuevamente.';
  }

  if (error instanceof Error && error.message) {
    if (error.message.includes('Cannot return null for non-nullable field')) {
      return 'El servidor devolvió datos incompletos. Reinicia el BFF y vuelve a intentar.';
    }
    // If the message looks like a status code error, replace with friendly message
    if (/\b5\d{2}\b/.test(error.message) || error.message.toLowerCase().includes('network')) {
      return 'No se pudo realizar la reserva. Por favor intenta nuevamente.';
    }
    return error.message;
  }

  return 'No se pudo realizar la reserva. Por favor intenta nuevamente.';
}
