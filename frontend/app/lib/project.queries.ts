import { gql } from 'graphql-tag';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectCreateInput!) {
    createProject(input: $input) {
      data {
        id
        name
        isDeleted
        createdAt
        updatedAt
      }
      error {
        message
        code
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($input: ProjectUpdateInput!) {
    updateProject(input: $input) {
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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($input: ProjectDeleteInput!) {
    deleteProject(input: $input) {
      data {
        id
      }
      error {
        message
        code
      }
    }
  }
`; 