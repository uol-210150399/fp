// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { PublishedSurveyEntity } from '../model/published-survey.entity';
// import { SurveySessionEntity } from '../model/survey-response.entity';
// import { SurveyFieldTypeEnum, SurveyQuestion } from '../../generated/graphql';
// import { SurveyValidationException } from '../exceptions/survey.exceptions';
// import { SurveyValidationUtils } from '../utils/survey-validation.utils';
// import { SurveyQuestion as NewSurveyQuestion } from '../types';

// @Injectable()
// export class SurveySessionManagerService {
//   constructor(
//     @InjectRepository(PublishedSurveyEntity)
//     private readonly publishedSurveyRepository: Repository<PublishedSurveyEntity>,
//   ) { }

//   async getInitialQuestions(sessionId: string): Promise<SurveyQuestion[]> {
//     // Implementation of getting initial questions
//     return [];
//   }

//   async getNextQuestions(sessionId: string, answeredQuestionId: string): Promise<SurveyQuestion[]> {
//     // Implementation of getting next questions based on answered question
//     return [];
//   }

//   private async getPublishedSurveyWithForm(publishedSurveyId: string): Promise<PublishedSurveyEntity> {
//     const publishedSurvey = await this.publishedSurveyRepository.findOne({
//       where: { id: publishedSurveyId },
//       relations: ['form', 'form.sections', 'form.sections.fields'],
//     });

//     if (!publishedSurvey) {
//       throw new SurveyValidationException('Published survey not found');
//     }

//     return publishedSurvey;
//   }

//   private getAnswerableQuestionsFromSection(section: any, startIndex: number = 0): SurveyQuestion[] {
//     const questions: SurveyQuestion[] = [];

//     for (let i = startIndex; i < section.fields.length; i++) {
//       const field = section.fields[i];

//       // Skip non-question fields
//       if (field.type === SurveyFieldTypeEnum.Checkpoint ||
//         field.type === SurveyFieldTypeEnum.StatementField) {
//         continue;
//       }

//       // Convert field to Question format based on type
//       const question = this.convertFieldToQuestion(field, section.id);
//       if (question) {
//         questions.push(question);
//         // For now, return only one question at a time
//         break;
//       }
//     }

//     return questions;
//   }

//   private convertFieldToQuestion(field: any, sectionId: string): SurveyQuestion {
//     return {
//       id: field.id,
//       text: field.text,
//       description: field.description || null,
//       required: field.required || false,
//       type: field.type,
//       choices: field.choices || null,
//       labels: field.labels || null,
//       min: field.min || null,
//       max: field.max || null,
//       rows: field.rows || null,
//       buttonText: field.buttonText || null,
//     };
//   }

//   private async evaluateCheckpoint(checkpoint: any, answers: any[]): Promise<boolean> {
//     const condition = checkpoint.condition;
//     try {
//       const context = {
//         answers: answers.reduce((acc, answer) => {
//           acc[answer.questionId] = answer.value;
//           return acc;
//         }, {}),
//       };

//       return new Function('context', `with(context) { return ${condition}; }`)(context);
//     } catch (error) {
//       console.error('Error evaluating checkpoint condition:', error);
//       return false;
//     }
//   }

//   private findTargetSection(target: any, sections: any[]): any {
//     if (!target || !target.value) {
//       return null;
//     }

//     switch (target.type) {
//       case 'SKIP_TO_SECTION':
//         return sections.find(s => s.id === target.value);
//       case 'END':
//         return null;
//       default:
//         return null;
//     }
//   }
// } 