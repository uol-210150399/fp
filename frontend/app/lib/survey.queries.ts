import { gql } from 'graphql-tag';

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyCreateInput!) {
    createSurvey(input: $input) {
      data {
        id
        title
        description
        status
        key
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
        status
        key
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
            fields {
              ... on TextQuestion {
                id
                text
                description
                required
                type
                order
              }
              ... on MultipleChoiceQuestion {
                id
                text
                description
                required
                choices
                allowMultiple
                allowOther
                randomize
                type
                order
              }
              ... on RatingQuestion {
                id
                text
                description
                required
                labels
                steps
                startAtOne
                type
                order
              }
              ... on RankingQuestion {
                id
                text
                description
                required
                choices
                randomize
                type
                order
              }
              ... on MatrixQuestion {
                id
                text
                description
                required
                rows
                columns
                allowMultiplePerRow
                type
                order
              }
              ... on NumberQuestion {
                id
                text
                description
                required
                min
                max
                allowDecimals
                unitLabel
                type
                order
              }
              ... on StatementField {
                id
                text
                buttonText
                textSize
                type
                order
              }
              ... on Checkpoint {
                id
                title
                condition
                target {
                  type
                  value
                }
                type
                order
              }
            }
            order
          }
          context
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