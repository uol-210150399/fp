import { SurveySession } from '../../generated/graphql';
import { SurveySessionEntity } from '../model/survey-response.entity';

export class SurveyResponseDTOMapper {
  static toGraphQL(entity: SurveySessionEntity): SurveySession {
    return {
      id: entity.id,
      publishedSurveyId: entity.publishedSurveyId,
      surveyId: entity.surveyId,
      startedAt: entity.startedAt.toISOString(),
      completedAt: entity.completedAt?.toISOString(),
      lastActivityAt: entity.lastAnsweredAt.toISOString(),
      answers: entity.answers.map((answer) => ({
        questionId: answer.questionId,
        value: answer.value,
      })),
      createdAt: entity.createdAt.toISOString(),
    };
  }
} 