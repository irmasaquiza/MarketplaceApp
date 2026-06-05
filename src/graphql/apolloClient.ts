import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const GRAPHQL_TIMEOUT_MS = 130_000;

export function resolveGraphqlUri(): string {
  if (process.env.EXPO_PUBLIC_GRAPHQL_URL) {
    return process.env.EXPO_PUBLIC_GRAPHQL_URL;
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return 'https://10.0.2.2:7299/graphql';
  }

  return 'https://localhost:7299/graphql';
}

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRAPHQL_TIMEOUT_MS);

  const mergedInit: RequestInit = {
    ...init,
    signal: controller.signal,
  };

  return fetch(input, mergedInit).finally(() => clearTimeout(timeoutId));
}

export function createApolloClient(getToken: () => string | null) {
  const authLink = setContext((_, { headers }) => {
    const token = getToken();

    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const httpLink = new HttpLink({
    uri: resolveGraphqlUri(),
    fetch: fetchWithTimeout,
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}
