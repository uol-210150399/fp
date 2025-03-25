import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { SurveyResponseService } from '../services/survey-response.service';
import {
  StartSurveySessionResponse,
  SubmitSurveySessionAnswerResponse,
  ErrorCode,
} from '../types';
import { StartSurveySessionInput, SubmitSurveySessionAnswerInput } from 'src/generated/graphql';

@Resolver()
export class SurveyResponseResolver {
  constructor(
    private readonly surveyResponseService: SurveyResponseService,
  ) { }

  @Mutation(() => StartSurveySessionResponse)
  async startSurveySession(
    @Args('input') input: StartSurveySessionInput,
    @Context() context: any,
  ): Promise<StartSurveySessionResponse> {
    try {
      const session = await this.surveyResponseService.startSurveySession(
        { surveyKey: input.surveyKey },
        context?.req?.ip,
      );

      return {
        questions: [],
        metadata: {
          sessionId: session.id,
        },
        error: null,
      };
    } catch (error) {
      return {
        questions: [],
        metadata: null,
        error: {
          code: ErrorCode.SESSION_START_ERROR,
          message: error.message,
        },
      };
    }
  }

  @Mutation(() => SubmitSurveySessionAnswerResponse)
  async submitSurveySessionAnswer(
    @Args('input') input: SubmitSurveySessionAnswerInput,
  ): Promise<SubmitSurveySessionAnswerResponse> {
    try {
      const session = await this.surveyResponseService.submitSurveySessionAnswer(
        { sessionId: input.sessionId, answer: input.answer },
      );

      return {
        nextQuestions: [],
        error: null,
      };
    } catch (error) {
      return {
        nextQuestions: [],
        error: {
          code: ErrorCode.ANSWER_SUBMISSION_ERROR,
          message: error.message,
        },
      };
    }
  }
} 