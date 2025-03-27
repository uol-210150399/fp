import { SurveySession } from '../../generated/graphql';
import { SurveySessionEntity } from '../model/survey-response.entity';

export class SurveyResponseDTOMapper {
  static toGraphQL(entity: SurveySessionEntity): SurveySession {
    return {
      id: entity.id,
      surveyId: entity.surveyId,
      startedAt: entity.startedAt.toISOString(),
      completedAt: entity.completedAt?.toISOString(),
      lastActivityAt: entity.lastActivityAt.toISOString(),
      state: entity.state,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      respondentData: {
        email: entity.respondentData.email,
        name: entity.respondentData.name,
        role: entity.respondentData.role,
        ip: entity.respondentData.ip,
      },
    };
  }
} 