import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyService } from './survey.service';
import { SurveyEntity } from './model/survey.entity';
import { SurveyFormEntity } from './model/survey-form.entity';
import { SurveySectionEntity } from './model/survey-section.entity';
import { SurveySectionFieldEntity } from './model/survey-section-field.entity';
import { PublishedSurveyEntity } from './model/published-survey.entity';
import { SurveyMutationResolver } from './resolvers/survey-mutation.resolver';
import { SurveyQueryResolver } from './resolvers/survey-query.resolver';
import { SurveyResponseResolver } from './resolvers/survey-response.resolver';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveySessionEntity } from './model/survey-response.entity';
import { AuthModule } from '../auth/auth.module';
import { SurveyKeyUtils } from './utils/survey-key.utils';
import { SurveyFormOperationService } from './services/survey-form-operation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyEntity,
      SurveyFormEntity,
      SurveySectionEntity,
      SurveySectionFieldEntity,
      PublishedSurveyEntity,
      SurveySessionEntity,
    ]),
    AuthModule,
  ],
  providers: [
    SurveyService,
    SurveyMutationResolver,
    SurveyQueryResolver,
    SurveyResponseResolver,
    SurveyResponseService,
    SurveyKeyUtils,
    SurveyFormOperationService,
  ],
  exports: [SurveyService],
})
export class SurveyModule { }
