import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { Survey } from '@/backend.types';
import { gql } from 'graphql-tag';
import { GET_SURVEY } from '@/lib/survey.queries';

export const GET_SURVEYS = gql`
  query GetSurveys($filter: SurveysFilterInput, $pagination: PaginationInput) {
    surveys(filter: $filter, pagination: $pagination) {
      data  {
        edges {
          cursor
          node {
            id
            title
            description
            projectId
            status
            key
            isDeleted
            createdAt
            updatedAt
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

export function useSurveys(projectId: string) {
  const { data, loading, error } = useQuery(GET_SURVEYS, {
    variables: {
      filter: { projectId },
      pagination: { first: 100 }
    }
  });

  const surveys = data?.surveys?.data?.edges.map((edge: { node: Survey }) => edge.node) as Survey[] ?? [];

  return {
    surveys,
    loading,
    error: error || data?.surveys.error
  };
}

export function useSurvey(surveyId: string) {
  const { data, loading, error } = useQuery(GET_SURVEY, {
    variables: { id: surveyId },
    skip: !surveyId
  });

  return {
    survey: data?.survey?.data,
    loading,
    error: error || data?.survey?.error
  };
} 