import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SurveyEntity } from './model/survey.entity';
import { SurveyCreateInput, SurveyUpdateInput, SurveyFormOperationInput } from '../generated/graphql';
import { SurveySessionEntity } from './model/survey-response.entity';

@Resolver('Survey')
@UseGuards(AuthGuard)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) { }

  // ... existing methods ...

  @Mutation()
  async inviteRespondent(
    @Args('surveyId') surveyId: string,
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('role') role: string,
    @Context() context: any,
  ): Promise<SurveySessionEntity> {
    return this.surveyService.inviteRespondent(
      {
        surveyId,
        email,
        name,
        role,
      },
      context.user.id,
    );
  }

  @Query()
  async listSurveyRespondents(
    @Args('surveyId') surveyId: string,
    @Context() context: any,
  ): Promise<SurveySessionEntity[]> {
    return this.surveyService.listSurveyRespondents(surveyId, context.user.id);
  }

  // ... rest of the code ...
} 