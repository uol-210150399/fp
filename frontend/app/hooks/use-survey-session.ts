import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react/hooks';
import { useState, useEffect } from 'react';
import { SessionStatus } from '@/backend.types';

const START_SURVEY_SESSION = gql`
  mutation StartSurveySession($input: StartSurveySessionInput!) {
    startSurveySession(input: $input) {
      nextQuestion
      metadata
      error {
        message
        code
      }
    }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitSurveySessionAnswer($input: SubmitSurveySessionAnswerInput!) {
    submitSurveySessionAnswer(input: $input) {
      nextQuestion
      metadata
      error {
        message
        code
      }
    }
  }
`;

export function useSurveySession(surveyKey: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.STARTED);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [startSession] = useMutation(START_SURVEY_SESSION);
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check URL first for sessionId
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('r');

        // If no URL sessionId, check localStorage
        const storedSessionId = !urlSessionId ?
          localStorage.getItem(`survey_session_${surveyKey}`) :
          null;

        const { data } = await startSession({
          variables: {
            input: {
              surveyKey,
              sessionId: urlSessionId || storedSessionId || undefined
            }
          }
        });

        if (data.startSurveySession.error) {
          setError(data.startSurveySession.error.message);
          return;
        }

        const newSessionId = data.startSurveySession.metadata?.session?.id;
        if (newSessionId && !urlSessionId) {
          localStorage.setItem(`survey_session_${surveyKey}`, newSessionId);
        }

        setSessionId(newSessionId);
        setCurrentQuestion(data.startSurveySession.nextQuestion);
        setStatus(data.startSurveySession.metadata?.status || SessionStatus.STARTED);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start survey session');
      }
    };

    initializeSession();
  }, [surveyKey]);

  const submitQuestionAnswer = async (questionId: string, answer: any) => {
    if (!sessionId) return;
    setIsSubmitting(true);

    try {
      const { data } = await submitAnswer({
        variables: {
          input: {
            sessionId,
            questionId,
            answer
          }
        }
      });

      if (data.submitSurveySessionAnswer.error) {
        setError(data.submitSurveySessionAnswer.error.message);
        return;
      }

      setError(null);
      setCurrentQuestion(data.submitSurveySessionAnswer.nextQuestion);

      if (!data.submitSurveySessionAnswer.nextQuestion ||
        data.submitSurveySessionAnswer.metadata?.status === SessionStatus.COMPLETED) {
        setStatus(SessionStatus.COMPLETED);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuestionAnswer,
    currentQuestion,
    status,
    error,
    sessionId,
    isSubmitting
  };
} 