import { Resolver, Query, Mutation } from '@nestjs/graphql';

import { SurveyQueryResolver } from './resolvers/survey-query.resolver';
import { SurveyMutationResolver } from './resolvers/survey-mutation.resolver';
import { SurveyMutation, SurveyQuery } from 'src/generated/graphql';

@Resolver('Survey')
export class SurveyResolver {
  constructor(
    private surveyQueryResolver: SurveyQueryResolver,
    private surveyMutationResolver: SurveyMutationResolver,
  ) {}

  @Query('survey')
  async survey(): Promise<SurveyQuery> {
    console.log('survey');
    return {
      __typename: 'SurveyQuery',
      get: this.surveyQueryResolver.get.bind(this.surveyQueryResolver),
      list: this.surveyQueryResolver.list.bind(this.surveyQueryResolver),
    };
  }

  @Mutation('survey')
  async surveyMutation(): Promise<SurveyMutation> {
    return {
      __typename: 'SurveyMutation',
      create: this.surveyMutationResolver.create.bind(
        this.surveyMutationResolver,
      ),
      update: this.surveyMutationResolver.update.bind(
        this.surveyMutationResolver,
      ),
      delete: this.surveyMutationResolver.delete.bind(
        this.surveyMutationResolver,
      ),
      publish: this.surveyMutationResolver.publish.bind(
        this.surveyMutationResolver,
      ),
    };

  }
}
