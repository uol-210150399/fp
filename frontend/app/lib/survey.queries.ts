import { gql } from 'graphql-tag';

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyCreateInput!) {
    createSurvey(input: $input) {
      data {
        id
        title
        description
        projectId
        status
        key
        form {
            id
            sections {
              id
              title
              description
              fields
              order
            }
            context
            welcomeMessage
            updatedAt
        }
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

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($input: SurveyUpdateInput!) {
    updateSurvey(input: $input) {
      data {
        id
        title
        description
        projectId
        status
        key
        form {
            id
            sections {
            id
            title
            description
            fields
            order
            }
            context
            welcomeMessage
            updatedAt
        }
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

export const DELETE_SURVEY = gql`
  mutation DeleteSurvey($id: ID!) {
    deleteSurvey(id: $id) {
      data {
        id
        title
        description
        projectId
        status
        key
        form {
            id
            sections {
            id
            title
            description
            fields
            order
            }
            context
            welcomeMessage
            updatedAt
        }
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

export const PUBLISH_SURVEY = gql`
  mutation PublishSurvey($input: SurveyPublishInput!) {
    publishSurvey(input: $input) {
      data {
        id
        status
      }
      error {
        message
        code
      }
    }
  }
`;

export const GET_SURVEY = gql`
  query GetSurvey($id: ID!) {
    survey(id: $id) {
      data {
        id
        title
        description
        projectId
        status
        key
        form {
            id
            sections {
            id
            title
            description
            fields
            order
            }
            context
            welcomeMessage
            updatedAt
        }
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

export const UPDATE_SURVEY_FORM_SECTIONS = gql`
  mutation UpdateSurveySectionsBulk($input: SurveySectionBulkCreateInput!) {
    updateSurveySectionsBulk(input: $input) {
      data {
          id
          title
          description
          projectId
          status
          key
          form {
              id
              sections {
              id
              title
              description
              fields
              order
              }
              context
              welcomeMessage
              updatedAt
          }
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