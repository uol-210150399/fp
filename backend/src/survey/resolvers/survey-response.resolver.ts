import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { SurveyResponseService } from '../services/survey-response.service';
import { Error, ErrorCode, SessionStatus, StartSurveySessionInput, SubmitSurveySessionAnswerInput } from 'src/generated/graphql';

@Resolver()
export class SurveyResponseResolver {
  constructor(
    private readonly surveyResponseService: SurveyResponseService,
  ) { }

  @Mutation()
  async startSurveySession(
    @Args('input') input: StartSurveySessionInput,
    @Context() context: any,
  ): Promise<any> {
    try {
      const { session, nextQuestion, status } = await this.surveyResponseService.startSurveySession(
        { surveyKey: input.surveyKey },
        context?.req?.ip,
      );

      return {
        nextQuestion,
        metadata: {
          sessionId: session.id,
          surveyId: session.surveyId,
          status,
        },
        error: null,
      };
    } catch (error) {
      return {
        nextQuestion: null,
        metadata: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: error.message,
        },
      };
    }
  }

  @Mutation()
  async submitSurveySessionAnswer(
    @Args('input') input: SubmitSurveySessionAnswerInput,
  ): Promise<{
    nextQuestion: any,
    metadata: {
      status: SessionStatus,
      redirectUrl?: string,
    },
    error: Error
  }> {
    try {
      const { nextQuestion, status } = await this.surveyResponseService.submitSurveySessionAnswer(
        input,
      );

      return {
        nextQuestion,
        metadata: {
          status,
          redirectUrl: null,
        },
        error: null,
      };
    } catch (error) {
      return {
        nextQuestion: null,
        metadata: {
          status: SessionStatus.COMPLETED,
          redirectUrl: null,
        },
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: error.message,
        },
      };
    }
  }
} 