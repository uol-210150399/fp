import { SessionStatus, TextQuestion, MultipleChoiceQuestion, RatingQuestion, RankingQuestion, MatrixQuestion, NumberQuestion, StatementField, Checkpoint, SurveyFieldTypeEnum } from 'src/generated/graphql';

export enum QuestionStatus {
  Created = 'Created',
  Asked = 'Asked',
  Skipped = 'Skipped'
}

// Base interface for session field state
interface BaseSessionField {
  isQuestion: boolean;
  response: string | null;
  status: QuestionStatus;
  skipReason?: string;
  isFollowup: boolean;
  leadingQuestion?: string;
}

// Extend GraphQL types with session state
export interface SessionTextQuestion extends TextQuestion, BaseSessionField { }
export interface SessionMultipleChoiceQuestion extends MultipleChoiceQuestion, BaseSessionField { }
export interface SessionRatingQuestion extends RatingQuestion, BaseSessionField { }
export interface SessionRankingQuestion extends RankingQuestion, BaseSessionField { }
export interface SessionMatrixQuestion extends MatrixQuestion, BaseSessionField { }
export interface SessionNumberQuestion extends NumberQuestion, BaseSessionField { }
export interface SessionStatementField extends StatementField, BaseSessionField { }
export interface SessionCheckpoint extends Checkpoint {
  response: string
  status: QuestionStatus
}

// Union type for all session fields
export type SessionField =
  | SessionTextQuestion
  | SessionMultipleChoiceQuestion
  | SessionRatingQuestion
  | SessionRankingQuestion
  | SessionMatrixQuestion
  | SessionNumberQuestion
  | SessionStatementField
  | SessionCheckpoint;

// Topic type
export interface SessionTopic {
  id: string;
  title: string;
  description?: string;
  fields: SessionField[];
}

export interface SessionState {
  context?: string;
  welcomeMessage?: string;
  topics: SessionTopic[];
  status: SessionStatus;
}

export class SessionStateMapper {
  static toState(formSnapshot: any): SessionState {
    return {
      context: formSnapshot.context,
      welcomeMessage: formSnapshot.welcomeMessage,
      topics: (formSnapshot.sections || []).map(section => ({
        id: section.id,
        title: section.title,
        description: section.description,
        fields: (section.fields || []).map(field => ({
          ...field,
          isQuestion: field.type !== SurveyFieldTypeEnum.Checkpoint && field.type !== SurveyFieldTypeEnum.StatementField,
          response: null,
          status: QuestionStatus.Created,
          skipReason: null,
          isFollowup: false,
          leadingQuestion: null
        }))
      })),
      status: SessionStatus.STARTED
    };
  }
} 