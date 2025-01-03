import { SurveyService } from './survey.service';
import { Module } from '@nestjs/common';
import { SurveyQueryResolver } from './resolvers/survey-query.resolver';
import { SurveyMutationResolver } from './resolvers/survey-mutation.resolver';
import { SurveyResolver } from './survey.resolver';

@Module({
  providers: [
    SurveyService,
    SurveyResolver,
    SurveyQueryResolver,
    SurveyMutationResolver,
  ],
  exports: [],
})
export class SurveyModule {}
