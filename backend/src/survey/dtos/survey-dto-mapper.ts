import {
  Survey,
  SurveyForm,
  SurveySection,
  SurveyFieldTypeEnum,
  TextQuestion,
  MultipleChoiceQuestion,
  RatingQuestion,
  StatementField,
  RankingQuestion,
  MatrixQuestion,
  NumberQuestion,
  Checkpoint,
  CheckpointTarget,
  TextSize,
  TargetType
} from '../../generated/graphql';
import { SurveyFormEntity } from '../model/survey-form.entity';
import { SurveyEntity } from '../model/survey.entity';
import { SurveySectionEntity } from '../model/survey-section.entity';
import { SurveySectionFieldEntity } from '../model/survey-section-field.entity';

export class SurveyFieldDTOMapper {
  static toGraphQL(entity: SurveySectionFieldEntity): any {
    switch (entity.type) {
      case SurveyFieldTypeEnum.TextQuestion:
        return this.mapTextQuestion(entity);
      case SurveyFieldTypeEnum.MultipleChoiceQuestion:
        return this.mapMultipleChoiceQuestion(entity);
      case SurveyFieldTypeEnum.RatingQuestion:
        return this.mapRatingQuestion(entity);
      case SurveyFieldTypeEnum.StatementField:
        return this.mapStatementField(entity);
      case SurveyFieldTypeEnum.RankingQuestion:
        return this.mapRankingQuestion(entity);
      case SurveyFieldTypeEnum.MatrixQuestion:
        return this.mapMatrixQuestion(entity);
      case SurveyFieldTypeEnum.NumberQuestion:
        return this.mapNumberQuestion(entity);
      case SurveyFieldTypeEnum.Checkpoint:
        return this.mapCheckpoint(entity);
      default:
        throw new Error(`Unknown field type: ${entity.type}`);
    }
  }

  private static mapTextQuestion(entity: SurveySectionFieldEntity): TextQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? true,
      type: SurveyFieldTypeEnum.TextQuestion,
      order: entity.order,
      instructions: data.instructions
    };
  }

  private static mapMultipleChoiceQuestion(entity: SurveySectionFieldEntity): MultipleChoiceQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? true,
      choices: data.choices ?? [],
      allowMultiple: data.allowMultiple ?? true,
      randomize: data.randomize ?? false,
      type: SurveyFieldTypeEnum.MultipleChoiceQuestion,
      order: entity.order
    };
  }

  private static mapRatingQuestion(entity: SurveySectionFieldEntity): RatingQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? true,
      labels: data.labels ?? [],
      steps: data.steps,
      startAtOne: data.startAtOne ?? false,
      type: SurveyFieldTypeEnum.RatingQuestion,
      order: entity.order
    };
  }

  private static mapStatementField(entity: SurveySectionFieldEntity): StatementField {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      buttonText: data.buttonText,
      textSize: data.textSize ?? TextSize.MEDIUM,
      type: SurveyFieldTypeEnum.StatementField,
      order: entity.order
    };
  }

  private static mapRankingQuestion(entity: SurveySectionFieldEntity): RankingQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? false,
      choices: data.choices ?? [],
      randomize: data.randomize ?? false,
      type: SurveyFieldTypeEnum.RankingQuestion,
      order: entity.order
    };
  }

  private static mapMatrixQuestion(entity: SurveySectionFieldEntity): MatrixQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? false,
      rows: data.rows ?? [],
      columns: data.columns ?? [],
      allowMultiplePerRow: data.allowMultiplePerRow ?? false,
      type: SurveyFieldTypeEnum.MatrixQuestion,
      order: entity.order
    };
  }

  private static mapNumberQuestion(entity: SurveySectionFieldEntity): NumberQuestion {
    const data = entity.data as any;
    return {
      id: entity.id,
      text: data.text,
      description: data.description,
      required: data.required ?? true,
      min: data.min,
      max: data.max,
      unit: data.unit,
      type: SurveyFieldTypeEnum.NumberQuestion,
      order: entity.order
    };
  }

  private static mapCheckpoint(entity: SurveySectionFieldEntity): Checkpoint {
    const data = entity.data as any;
    return {
      id: entity.id,
      condition: data.condition,
      target: this.mapCheckpointTarget(data.target),
      type: SurveyFieldTypeEnum.Checkpoint,
      order: entity.order
    };
  }

  private static mapCheckpointTarget(target: any): CheckpointTarget {
    if (!target || !target.type || !Object.values(TargetType).includes(target.type)) {
      throw new Error('Invalid checkpoint target type');
    }

    return {
      type: target.type as TargetType,
      value: target.value
    };
  }
}

export class SurveySectionDTOMapper {
  static toGraphQL(entity: SurveySectionEntity): SurveySection {
    if (!entity.title) {
      throw new Error('Section title is required');
    }

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      order: entity.order,
      fields: entity.fields?.map(field => SurveyFieldDTOMapper.toGraphQL(field)) || []
    };
  }
}

export class SurveyFormDTOMapper {
  static toGraphQL(entity: SurveyFormEntity): SurveyForm {
    return {
      id: entity.id,
      sections: entity.sections?.map(section => SurveySectionDTOMapper.toGraphQL(section)) || [],
      context: entity.context,
      welcomeMessage: entity.welcomeMessage,
      updatedAt: entity.updatedAt?.toISOString()
    };
  }
}

export class SurveyDTOMapper {
  static toGraphQL(entity: SurveyEntity): Survey {
    if (!entity.title) {
      throw new Error('Survey title is required');
    }

    return {
      id: entity.surveyId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      projectId: entity.projectId,
      isDeleted: entity.isDeleted,
      key: entity.key,
      form: entity.form ? SurveyFormDTOMapper.toGraphQL(entity.form) : null
    };
  }
} 