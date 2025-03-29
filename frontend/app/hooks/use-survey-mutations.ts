import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { toast } from 'sonner';
import { UPDATE_SURVEY, UPDATE_SURVEY_FORM_SECTIONS, PUBLISH_SURVEY } from '@/lib/survey.queries';

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

export function useUpdateSurveyFormSections() {
  return useMutation(UPDATE_SURVEY_FORM_SECTIONS, {
    onCompleted: (data) => {
      if (data?.updateSurveySectionsBulk?.error) {
        toast.error("Error", {
          description: data.updateSurveySectionsBulk.error.message,
        });
        return;
      }
      toast.success("Success", {
        description: "Survey sections updated successfully",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
}

export function usePublishSurvey() {
  return useMutation(PUBLISH_SURVEY, {
    onCompleted: (data) => {
      if (data.publishSurvey.error) {
        toast.error("Error", {
          description: data.publishSurvey.error.message,
        });
        return;
      }
      toast.success("Success", {
        description: "Survey published successfully",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
}

export function useInviteRespondent() {
  const [mutate, { loading, error }] = useMutation(gql`
    mutation InviteRespondent($input: InviteRespondentInput!) {
      inviteRespondent(input: $input) {
        id
        respondentData {
          email
          name
          role
        }
      }
    }
  `);

  return [
    mutate,
    { loading, error }
  ] as const;
}
