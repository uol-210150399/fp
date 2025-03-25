import { SurveyFieldTypeEnum } from '../../generated/graphql';
import { SurveyValidationException } from '../exceptions/survey.exceptions';
import {
  SurveyField,
  MultipleChoiceQuestionField,
  RatingQuestionField,
  MatrixQuestionField,
  RankingQuestionField,
  NumberQuestionField,
  CheckpointField,
} from '../types/survey-field.types';

export class SurveyValidationUtils {
  static validateSectionField(field: SurveyField): void {
    if (!field.text) {
      throw new SurveyValidationException('Field text is required');
    }

    if (typeof field.order !== 'number') {
      throw new SurveyValidationException('Field order must be a number');
    }

    // Type-specific validation
    switch (field.type) {
      case SurveyFieldTypeEnum.MultipleChoiceQuestion:
        this.validateMultipleChoiceField(field as MultipleChoiceQuestionField);
        break;
      case SurveyFieldTypeEnum.RatingQuestion:
        this.validateRatingField(field as RatingQuestionField);
        break;
      case SurveyFieldTypeEnum.MatrixQuestion:
        this.validateMatrixField(field as MatrixQuestionField);
        break;
      case SurveyFieldTypeEnum.RankingQuestion:
        this.validateRankingField(field as RankingQuestionField);
        break;
      case SurveyFieldTypeEnum.NumberQuestion:
        this.validateNumberField(field as NumberQuestionField);
        break;
      case SurveyFieldTypeEnum.Checkpoint:
        this.validateCheckpointField(field as CheckpointField);
        break;
    }
  }

  static validateSection(section: any): void {
    if (!section.title) {
      throw new SurveyValidationException('Section title is required');
    }

    if (!Array.isArray(section.fields)) {
      throw new SurveyValidationException('Section fields must be an array');
    }

    section.fields.forEach((field: any, index: number) => {
      const surveyField = {
        ...field,
        order: field.order ?? index,
      } as SurveyField;
      this.validateSectionField(surveyField);
    });
  }

  static validateAnswer(field: SurveyField, answer: any): void {
    void field;
    void answer;
  }

  private static validateMultipleChoiceField(field: MultipleChoiceQuestionField): void {
    if (!Array.isArray(field.choices) || field.choices.length === 0) {
      throw new SurveyValidationException('Multiple choice fields require at least one choice');
    }
  }

  private static validateRatingField(field: RatingQuestionField): void {
    if (!Array.isArray(field.labels) || field.labels.length === 0) {
      throw new SurveyValidationException('Rating fields require at least one label');
    }
    if (field.steps !== undefined && (typeof field.steps !== 'number' || field.steps < 1)) {
      throw new SurveyValidationException('Rating steps must be a positive number');
    }
  }

  private static validateMatrixField(field: MatrixQuestionField): void {
    if (!Array.isArray(field.rows) || field.rows.length === 0) {
      throw new SurveyValidationException('Matrix fields require at least one row');
    }
    if (!Array.isArray(field.columns) || field.columns.length === 0) {
      throw new SurveyValidationException('Matrix fields require at least one column');
    }
  }

  private static validateRankingField(field: RankingQuestionField): void {
    if (!Array.isArray(field.choices) || field.choices.length === 0) {
      throw new SurveyValidationException('Ranking fields require at least one choice');
    }
  }

  private static validateNumberField(field: NumberQuestionField): void {
    if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
      throw new SurveyValidationException('Number field minimum must be less than or equal to maximum');
    }
  }

  private static validateCheckpointField(field: CheckpointField): void {
    if (!field.condition) {
      throw new SurveyValidationException('Checkpoint fields require a condition');
    }
    if (!field.target || !field.target.type) {
      throw new SurveyValidationException('Checkpoint fields require a target type');
    }
  }
} 