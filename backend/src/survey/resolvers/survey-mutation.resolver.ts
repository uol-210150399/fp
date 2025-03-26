import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ErrorCode,
  SurveyCreateInput,
  SurveyUpdateInput,
  SurveyResponse,
  SurveyFormOperationInput,
  SurveySectionBulkCreateInput,
  SurveyPublishInput,
} from '../../generated/graphql';
import { SurveyDTOMapper } from '../dtos/survey-dto-mapper';
import { SurveyService } from '../survey.service';
import { SurveyFormOperationService } from '../services/survey-form-operation.service';
import { SurveyNotFoundException, SurveyPermissionDeniedException, SurveyValidationException } from '../exceptions/survey.exceptions';

@Resolver()
@UseGuards(AuthGuard)
export class SurveyMutationResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly formOperationService: SurveyFormOperationService,
  ) { }

  @Mutation()
  async createSurvey(
    @Args('input') input: SurveyCreateInput,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyService.createSurvey(input, userId);
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateSurvey(
    @Args('input') input: SurveyUpdateInput,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyService.updateSurvey(input, userId);
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message || 'Failed to update survey',
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateSurveyForm(
    @Args('input') input: SurveyFormOperationInput,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      await this.formOperationService.executeOperation(input.formId, input.operation, input.data);
      const survey = await this.surveyService.getSurvey(input.formId, userId);
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateSurveySectionsBulk(
    @Args('input') input: SurveySectionBulkCreateInput,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyService.updateSurveySectionsBulk(
        {
          surveyId: input.surveyId,
          sections: input.sections.map(section => ({
            id: section.id,
            title: section.title,
            description: section.description,
            fields: section.fields.map(field => ({
              id: field.id,
              ...field
            })),
          })),
        },
        userId,
      );
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : error instanceof SurveyValidationException
                ? ErrorCode.VALIDATION_ERROR
                : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async publishSurvey(
    @Args('input') input: SurveyPublishInput,
    @CurrentUser() userId: string,
  ): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyService.publishSurvey(input.id, userId);
      return {
        data: SurveyDTOMapper.toGraphQL(survey),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : error instanceof SurveyValidationException
                ? ErrorCode.VALIDATION_ERROR
                : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async inviteRespondent(
    @Args('input') input: { surveyId: string; email: string; name?: string; role?: string },
    @CurrentUser() userId: string,
  ): Promise<{ data: any; error: { message: string; code: ErrorCode } | null }> {
    try {
      const session = await this.surveyService.inviteRespondent(input, userId);

      return {
        data: session,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error instanceof SurveyNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof SurveyPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : error instanceof SurveyValidationException
                ? ErrorCode.VALIDATION_ERROR
                : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 