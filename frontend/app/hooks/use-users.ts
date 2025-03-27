import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { gql } from 'graphql-tag';
import { User } from '@/backend.types';

export const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput!, $filter: UsersFilterInput) {
    users(pagination: $pagination, filter: $filter) {
      data {
        edges {
          cursor
          node {
            id
            email
            firstName
            lastName
            imageUrl
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      error {
        message
        code
      }
    }
  }
`;

export function useUsers(search?: string) {
  const { data, loading, error } = useQuery(GET_USERS, {
    variables: {
      pagination: { first: 100 },
      filter: search ? { search } : undefined
    }
  });

  const users = data?.users?.data?.edges.map((edge: { node: User }) => edge.node) as User[] ?? [];

  return {
    users,
    loading,
    error: error || data?.users?.error
  };
} 