// @ts-ignore
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';
import { ApolloClient } from '@apollo/client/core';

const GRAPHQL_ENDPOINT = 'http://localhost:3177/graphql';

export function useApolloClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const httpLink = createHttpLink({
      uri: GRAPHQL_ENDPOINT,
    });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          authorization: token || '',
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);
} 