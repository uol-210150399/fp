import { gql } from 'graphql-tag';

export const GET_TEAMS = gql`
  query GetTeams($pagination: PaginationInput) {
    teams(pagination: $pagination) {
      data {
        edges {
          node {
            id
            name
            slug
            members {
                id
                userId
                role
                isDeleted
                createdAt
            }
            projects {
              id
              name
              isDeleted
              createdAt
              updatedAt
            }
          }
          cursor
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

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: TeamCreateInput!) {
    createTeam(input: $input) {
      data {
        id
        name
        slug
      }
      error {
        message
        code
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($input: TeamUpdateInput!) {
    updateTeam(input: $input) {
      data {
        id
        name
      }
      error {
        message
        code
      }
    }
  }
`;

export const ADD_TEAM_MEMBER = gql`
  mutation CreateTeamMember($input: TeamMemberCreateInput!) {
    createTeamMember(input: $input) {
      data {
        id
        role
      }
      error {
        message
        code
      }
    }
  }
`;

export const REMOVE_TEAM_MEMBER = gql`
  mutation RemoveTeamMember($input: TeamMemberDeleteInput!) {
    deleteTeamMember(input: $input) {
      data {
        id
        role
      }
      error {
        message
        code
      }
    }
  }
`; 