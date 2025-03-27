import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { SurveyResponseService } from '../services/survey-response.service';
import { Error, ErrorCode, SessionStatus, StartSurveySessionInput, SubmitSurveySessionAnswerInput, SurveySession } from 'src/generated/graphql';
import { SurveyResponseDTOMapper } from '../dtos/survey-response-dto-mapper';

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
        { surveyKey: input.surveyKey, sessionId: input.sessionId },
        context?.req?.ip,
      );

      return {
        nextQuestion,
        metadata: {
          sessionId: session.id,
          surveyId: session.surveyId,
          status,
          session: SurveyResponseDTOMapper.toGraphQL(session),
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
      session: SurveySession,
    },
    error: Error
  }> {
    try {
      const { nextQuestion, status, session } = await this.surveyResponseService.submitSurveySessionAnswer(
        input,
      );

      return {
        nextQuestion,
        metadata: {
          status,
          session: SurveyResponseDTOMapper.toGraphQL(session),
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
} 