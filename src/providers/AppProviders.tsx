import { ApolloProvider } from '@apollo/client/react';
import { ReactNode, useMemo } from 'react';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { createApolloClient } from '@/graphql/apolloClient';

function ApolloProviderWithAuth({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createApolloClient(getToken),
    [getToken],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProviderWithAuth>
        <CheckoutProvider>{children}</CheckoutProvider>
      </ApolloProviderWithAuth>
    </AuthProvider>
  );
}
