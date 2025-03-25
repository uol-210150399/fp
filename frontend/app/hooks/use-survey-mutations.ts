import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { toast } from 'sonner';
import { UPDATE_SURVEY } from '@/lib/survey.queries';

const CREATE_SURVEY = gql(/* GraphQL */ `
  mutation CreateSurvey($input: SurveyCreateInput!) {
    createSurvey(input: $input) {
      data {
        id
        title
        description
      }
      error {
        message
        code
      }
    }
  }
`);

export function useCreateSurvey() {
  return useMutation(CREATE_SURVEY, {
    onCompleted: (data) => {
      if (data.createSurvey.error) {
        toast.error("Error", {
          description: data.createSurvey.error.message,
        });
        return;
      }
      toast.success("Success", {
        description: "Survey created successfully",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
}

export function useUpdateSurvey() {
  return useMutation(UPDATE_SURVEY, {
    onCompleted: (data) => {
      if (data.updateSurvey.error) {
        toast.error("Error", {
          description: data.updateSurvey.error.message,
        });
        return;
      }
      toast.success("Success", {
        description: "Survey updated successfully",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
}