import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SurveyService } from '../survey.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ErrorCode,
  PaginationInput,
  SurveyResponse,
  SurveysFilterInput,
  SurveysResponse,
  SurveyStatus,
} from '../../generated/graphql';
import { SurveyNotFoundException, SurveyPermissionDeniedException } from '../exceptions/survey.exceptions';
import { SurveyDTOMapper } from '../dtos/survey-dto-mapper';
import { SurveySessionEntity } from '../model/survey-response.entity';

@Resolver('Query')
@UseGuards(AuthGuard)
export class SurveyQueryResolver {
  constructor(private readonly surveyService: SurveyService) { }

  @Query('survey')
  async survey(
    @Args('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyService.getSurvey(id, userId);
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof SurveyNotFoundException
            ? error.message
            : error.message || 'Failed to get survey',
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Query('surveys')
  async surveys(
    @CurrentUser() userId: string,
    @Args('filter') filter?: SurveysFilterInput,
    @Args('pagination') pagination?: PaginationInput,
  ): Promise<SurveysResponse> {
    try {
      const { surveys, hasNextPage } = await this.surveyService.listSurveys({
        filter: {
          userId,
          projectId: filter?.projectId,
        },
        pagination: { first: pagination?.first || 10, after: pagination?.after },
      });

      return {
        data: {
          edges: surveys.map(survey => ({
            cursor: "1",
            node: SurveyDTOMapper.toGraphQL(survey),
          })),
          pageInfo: {
            hasNextPage,
            endCursor: null,
          },
        },
        error: null,
      };
    } catch (error) {
      return {
        data: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
        error: {
          message: error instanceof Error ? error.message : 'Failed to list surveys',
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Query('listSurveyRespondents')
  async listSurveyRespondents(
    @Args('surveyId') surveyId: string,
    @CurrentUser() userId: string,
  ): Promise<SurveySessionEntity[]> {
    try {
      return this.surveyService.listSurveyRespondents(surveyId, userId);
    } catch (error) {
      throw error;
    }
  }
} 