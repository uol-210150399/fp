import { SurveyFieldTypeEnum, TargetType } from '../../generated/graphql';

// Base interface for all field types
export interface BaseSurveyField {
  id?: string;
  type: SurveyFieldTypeEnum;
  order: number;
  required: boolean;
  text: string;
  description?: string;
}

// Specific field type interfaces
export interface TextQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.TextQuestion;
}

export interface MultipleChoiceQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.MultipleChoiceQuestion;
  choices: string[];
  allowMultiple?: boolean;
  randomize?: boolean;
}

export interface RatingQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.RatingQuestion;
  labels: string[];
  steps?: number;
  startAtOne?: boolean;
}

export interface NumberQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.NumberQuestion;
  min?: number;
  max?: number;
  unit?: string;
}

export interface MatrixQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.MatrixQuestion;
  rows: string[];
  columns: string[];
  allowMultiplePerRow: boolean;
}

export interface RankingQuestionField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.RankingQuestion;
  choices: string[];
  randomize?: boolean;
}

export interface StatementField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.StatementField;
  buttonText?: string;
  textSize?: 'SMALL' | 'MEDIUM' | 'LARGE';
}

export interface CheckpointField extends BaseSurveyField {
  type: SurveyFieldTypeEnum.Checkpoint;
  condition: string;
  target: {
    type: TargetType
    value?: string;
  };
}

// Union type for all field types
export type SurveyField =
  | TextQuestionField
  | MultipleChoiceQuestionField
  | RatingQuestionField
  | NumberQuestionField
  | MatrixQuestionField
  | RankingQuestionField
  | StatementField
  | CheckpointField;

// Transformer functions
export class SurveyFieldTransformer {
  static toPersistence(field: SurveyField): any {
    const { id, type, order, ...rest } = field;
    return {
      id,
      type,
      order,
      data: rest,
    };
  }

  static fromPersistence(data: any): SurveyField {
    const { type, order, data: fieldData } = data;
    const baseField = {
      id: data.id,
      type,
      order,
      ...fieldData,
    };

    switch (type) {
      case SurveyFieldTypeEnum.TextQuestion:
        return baseField as TextQuestionField;
      case SurveyFieldTypeEnum.MultipleChoiceQuestion:
        return baseField as MultipleChoiceQuestionField;
      case SurveyFieldTypeEnum.RatingQuestion:
        return baseField as RatingQuestionField;
      case SurveyFieldTypeEnum.NumberQuestion:
        return baseField as NumberQuestionField;
      case SurveyFieldTypeEnum.MatrixQuestion:
        return baseField as MatrixQuestionField;
      case SurveyFieldTypeEnum.RankingQuestion:
        return baseField as RankingQuestionField;
      case SurveyFieldTypeEnum.StatementField:
        return baseField as StatementField;
      case SurveyFieldTypeEnum.Checkpoint:
        return baseField as CheckpointField;
      default:
        throw new Error(`Unknown field type: ${type}`);
    }
  }
} 