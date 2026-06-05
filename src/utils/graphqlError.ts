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

  if (apolloError.networkError?.message) {
    if (apolloError.networkError.message.includes('AbortError')) {
      return 'La solicitud tardó demasiado. Verifica tu conexión e inténtalo de nuevo.';
    }
    return apolloError.networkError.message;
  }

  if (error instanceof Error && error.message) {
    if (error.message.includes('Cannot return null for non-nullable field')) {
      return 'El servidor devolvió datos incompletos. Reinicia el BFF y vuelve a intentar.';
    }
    return error.message;
  }

  return 'No se pudo completar la operación GraphQL.';
}
