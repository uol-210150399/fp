import { type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useSearchParams } from "@remix-run/react"
import { TextQuestion } from "./components/questions/text-question"
import { ChoiceQuestion } from "./components/questions/choice-question"
import { RatingQuestion } from "./components/questions/rating-question"
import { RankingQuestion } from "./components/questions/ranking-question"
import { MatrixQuestion } from "./components/questions/matrix-question"
import { SurveyFieldTypeEnum, SessionStatus } from "@/backend.types"
import { NumberQuestion } from "./components/questions/number-question"
import { useSurveySession } from "@/hooks/use-survey-session"
import { StatementQuestion } from "./components/questions/statement-question"
import { Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react/hooks';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

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

export function clientLoader({ params }: LoaderFunctionArgs) {
  const { id: surveyKey } = params
  return { surveyKey }
}

export default function RespondentDetail() {
  const { surveyKey } = useLoaderData<typeof clientLoader>()
  const {
    submitQuestionAnswer,
    currentQuestion,
    status,
    error,
    isSubmitting
  } = useSurveySession(surveyKey as string)
  const [searchParams] = useSearchParams()
  const respondentUrlSessionId = searchParams.get('r')

  const handleSubmitAnswer = async (answer: any) => {
    if (!currentQuestion) return
    await submitQuestionAnswer(currentQuestion.id, answer)
  }

  if (error) {
    // Log the actual error for debugging
    console.error("Survey Error:", error);

    // Show user-friendly error message
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border border-destructive/50 p-12 text-center animate-in fade-in duration-300">
            <div className="mb-8">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-medium text-foreground mb-3">
                Unable to Load Survey
              </h1>
              <p className="text-muted-foreground">
                {getUserFriendlyError(error)}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-8"
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === SessionStatus.COMPLETED) {
    const handleStartNewSurvey = () => {
      // Clear the localStorage key for this survey
      localStorage.removeItem(`survey_session_${surveyKey}`)
      // Refresh the page to start a new survey
      window.location.reload()
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border p-12 text-center animate-in fade-in duration-300">
            <div className="mb-8">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-medium text-foreground mb-3">
                Thank You
              </h1>
              <p className="text-muted-foreground">
                Your responses have been successfully recorded.
              </p>
              <p className="text-sm text-muted-foreground/80 mt-6">
                We appreciate your time and valuable feedback. Your responses will help us improve.
              </p>
              {!respondentUrlSessionId && (
                <Button
                  onClick={handleStartNewSurvey}
                  className="mt-8"
                >
                  Start new survey
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border p-12 text-center animate-in fade-in duration-300">
            <div className="mb-8">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-medium text-foreground mb-3">
                Preparing Your Survey
              </h1>
              <p className="text-muted-foreground">
                We're setting up your personalized survey experience
              </p>
              <p className="text-sm text-muted-foreground/80 mt-6">
                This will only take a moment...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case SurveyFieldTypeEnum.TextQuestion:
        return (
          <TextQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            onSubmit={(value) => handleSubmitAnswer(value)}
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.MultipleChoiceQuestion:
        return (
          <ChoiceQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            choices={currentQuestion.choices.map((c: any) => ({
              label: c.text,
              value: c.id
            }))}
            allowMultiple={currentQuestion.allowMultiple}
            onSubmit={(values) => handleSubmitAnswer({ selectedChoices: values })}
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.RatingQuestion:
        return (
          <RatingQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            labels={currentQuestion.labels.map((label: string, i: number) => ({
              value: i,
              label
            }))}
            onSubmit={(value) => handleSubmitAnswer({ rating: value })}
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.RankingQuestion:
        return (
          <RankingQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            options={currentQuestion.choices.map((c: any) => ({
              id: c.id,
              label: c.text
            }))}
            onSubmit={(rankedOptions) =>
              handleSubmitAnswer({
                rankedChoices: rankedOptions
              })
            }
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.MatrixQuestion:
        return (
          <MatrixQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            options={currentQuestion.rows.map((row: string, i: number) => ({
              id: `row-${i}`,
              label: row,
              value: null
            }))}
            columns={currentQuestion.columns.map((col: string, i: number) => ({
              id: `col-${i}`,
              label: col
            }))}
            onSubmit={(answers) => {
              handleSubmitAnswer({ selections: answers })
            }}
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.NumberQuestion:
        return (
          <NumberQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            min={currentQuestion.min}
            max={currentQuestion.max}
            onSubmit={(value) => handleSubmitAnswer({ value })}
            key={currentQuestion.id}
          />
        )

      case SurveyFieldTypeEnum.StatementField:
        return (
          <StatementQuestion
            title={currentQuestion.text}
            description={currentQuestion.description}
            buttonText={currentQuestion.buttonText}
            onSubmit={(value) => handleSubmitAnswer({ acknowledged: value })}
            key={currentQuestion.id}
          />
        )

      default:
        return (
          <div className="text-center text-red-600">
            Unsupported question type: {currentQuestion.type}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8 md:py-16">
        <div className="relative w-full">
          {renderQuestion()}

          {/* Improved Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center gap-4 max-w-[90%] w-[400px] animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-lg font-medium text-foreground">Processing your answer</p>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your next question...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to convert error messages to user-friendly versions
function getUserFriendlyError(error: string): string {
  // Map known error messages to user-friendly versions
  const errorMap: Record<string, string> = {
    "Failed to start survey session": "We're having trouble starting your survey. Please try again in a moment.",
    "Session not found": "This survey session has expired or is no longer available.",
    "Survey not found": "This survey doesn't exist or has been removed.",
    "Network Error": "Please check your internet connection and try again.",
  };

  // Return mapped error or a default message
  return errorMap[error] || "Something went wrong. Please try again later.";
} 