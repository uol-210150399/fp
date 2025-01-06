import { Args, Resolver, ResolveField } from '@nestjs/graphql';
import {
  SurveyCreateInput,
  SurveyCreateOutput,
  SurveyUpdateInput,
  SurveyUpdateOutput,
  SurveyDeleteInput,
  SurveyDeleteOutput,
  SurveyPublishInput,
  SurveyPublishOutput,
} from '../../generated/graphql';
import {
  CreateSurveyDto,
  DeleteSurveyDto,
  SurveyService,
  UpdateSurveyDto,
} from '../survey.service';

@Resolver('SurveyMutation')
export class SurveyMutationResolver {
  constructor(private surveyService: SurveyService) {}

  @ResolveField()
  async create(
    @Args('input') input: SurveyCreateInput,
  ): Promise<SurveyCreateOutput> {
    try {
      const entity: CreateSurveyDto = {
        title: input.title,
        projectId: input.projectId,
        userId: '00000000-0000-0000-0000-000000000000',
      };
      const survey = await this.surveyService.create(entity);
      return {
        __typename: 'SurveyCreateSuccess',
        survey: {
          id: survey.surveyId,
          title: survey.title,
          isDeleted: survey.isDeletedFlag,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
        },
      };
    } catch (error) {
      return {
        __typename: 'SurveyCreateFailure',
        error: {
          message: error.message || 'Failed to create survey',
        },
      };
    }
  }

  @ResolveField()
  async update(
    @Args('input') input: SurveyUpdateInput,
  ): Promise<SurveyUpdateOutput> {
    try {
      const entity: UpdateSurveyDto = {
        surveyId: input.id,
        title: input.title,
        userId: '00000000-0000-0000-0000-000000000000',
      };
      const survey = await this.surveyService.update(entity);
      return {
        __typename: 'SurveyUpdateSuccess',
        survey: {
          id: survey.surveyId,
          title: survey.title,
          isDeleted: survey.isDeletedFlag,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
        },
      };
    } catch (error) {
      return {
        __typename: 'SurveyUpdateFailure',
        error: {
          message: error.message || 'Failed to update survey',
        },
      };
    }
  }

  @ResolveField()
  async delete(
    @Args('input') input: SurveyDeleteInput,
  ): Promise<SurveyDeleteOutput> {
    try {
      const entity: DeleteSurveyDto = {
        surveyId: input.id,
        userId: '00000000-0000-0000-0000-000000000000',
      };
      const survey = await this.surveyService.delete(entity);
      return {
        __typename: 'SurveyDeleteSuccess',
        survey: {
          id: survey.surveyId,
          title: survey.title,
          isDeleted: survey.isDeletedFlag,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
        },
      };
    } catch (error) {
      return {
        __typename: 'SurveyDeleteFailure',
        error: {
          message: error.message || 'Failed to delete survey',
        },
      };
    }
  }

  @ResolveField()
  async publish(
    @Args('input') input: SurveyPublishInput,
  ): Promise<SurveyPublishOutput> {
    try {
      // TODO: Implement publish logic
      return {
        __typename: 'SurveyPublishSuccess',
        survey: {
          id: input.id,
          title: 'Published Survey',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        __typename: 'SurveyPublishFailure',
        error: {
          message: error.message || 'Failed to publish survey',
        },
      };
    }
  }
}
