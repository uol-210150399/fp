import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveySessionEntity } from '../model/survey-response.entity';
import { SubmitSurveySessionAnswerInput, SurveyFieldTypeEnum } from 'src/generated/graphql';
import { SessionStatus } from 'src/generated/graphql';
import { SurveyValidationException } from '../exceptions/survey.exceptions';
import {
  QuestionStatus,
  SessionState,
  SessionField,
  SessionCheckpoint,
  SessionTextQuestion,
  SessionMultipleChoiceQuestion,
  SessionRatingQuestion,
  SessionMatrixQuestion,
  SessionNumberQuestion,
  SessionStatementField,
  SessionRankingQuestion
} from '../mappers/session-state.mapper';
import { ConversationHistory } from './scouti-agents/schema';
import { v4 as uuidv4 } from 'uuid';
import { ScoutiEngine } from './scouti-agents/engine';

@Injectable()
export class SurveySessionManagerService {
  private readonly scoutiEngine: ScoutiEngine;
  constructor(
    @InjectRepository(SurveySessionEntity)
    private readonly sessionRepository: Repository<SurveySessionEntity>,
  ) {
    this.scoutiEngine = new ScoutiEngine();
  }

  private flattenQuestions(state: SessionState): SessionField[] {
    return state.topics.reduce((allFields, topic) => {
      const fields = topic.fields.map(field => field) as SessionField[];
      return [...allFields, ...fields];
    }, [] as SessionField[]);
  }

  private async updateSessionState(
    sessionId: string,
    updateFn: (state: SessionState) => SessionState
  ): Promise<SessionState> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId }
    });

    if (!session) {
      throw new SurveyValidationException('Session not found');
    }

    const updatedState = updateFn(session.state);
    session.state = updatedState;
    session.lastActivityAt = new Date();
    await this.sessionRepository.save(session);

    return updatedState;
  }

  private async handleCheckpoint(session: SurveySessionEntity, currentQuestion: SessionCheckpoint): Promise<SurveySessionEntity> {
    const checkpointResult = await this.scoutiEngine.evaluateCheckpoint(currentQuestion.condition, this.buildConversationHistory(session));
    const topic = session.state.topics.find(t => t.fields.some(f => f.id === currentQuestion.id));
    const field = topic.fields.find(f => f.id === currentQuestion.id) as SessionCheckpoint;

    field.response = `The condition was evaluated to ${checkpointResult.result}. The reasoning behind the evaluation was: ${checkpointResult.steps}.`;
    field.status = QuestionStatus.Asked;

    // Determine if we should proceed with skip logic based on condition type
    const shouldProceed = checkpointResult.conditionType === 'POSITIVE'
      ? checkpointResult.result === 'TRUE'
      : ['TRUE', 'UNKNOWN'].includes(checkpointResult.result);

    if (shouldProceed) {
      const allQuestions = this.flattenQuestions(session.state);

      switch (currentQuestion.target.type) {
        case 'SKIP_TO_QUESTION': {
          const targetIndex = allQuestions.findIndex(q => q.id === currentQuestion.target.value);
          const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);

          // Skip all questions between current and target
          for (let i = currentIndex + 1; i < targetIndex; i++) {
            const questionToSkip = allQuestions[i];
            const skipTopic = session.state.topics.find(t => t.fields.some(f => f.id === questionToSkip.id));
            const skipField = skipTopic.fields.find(f => f.id === questionToSkip.id);
            skipField.status = QuestionStatus.Skipped;
            skipField.response = "Skipped due to checkpoint condition";
          }
          break;
        }

        case 'SKIP_TO_SECTION': {
          const targetTopic = session.state.topics.find(t => t.id === currentQuestion.target.value);
          const targetQuestion = targetTopic.fields[0]; // First question of the target topic
          const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
          const targetIndex = allQuestions.findIndex(q => q.id === targetQuestion.id);

          // Skip all questions between current and first question of target topic
          for (let i = currentIndex + 1; i < targetIndex; i++) {
            const questionToSkip = allQuestions[i];
            const skipTopic = session.state.topics.find(t => t.fields.some(f => f.id === questionToSkip.id));
            const skipField = skipTopic.fields.find(f => f.id === questionToSkip.id);
            skipField.status = QuestionStatus.Skipped;
            skipField.response = "Skipped due to checkpoint condition";
          }
          break;
        }

        case 'END': {
          // Skip all remaining questions and mark survey as completed
          const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
          for (let i = currentIndex + 1; i < allQuestions.length; i++) {
            const questionToSkip = allQuestions[i];
            const skipTopic = session.state.topics.find(t => t.fields.some(f => f.id === questionToSkip.id));
            const skipField = skipTopic.fields.find(f => f.id === questionToSkip.id);
            skipField.status = QuestionStatus.Skipped;
            skipField.response = "Skipped due to survey end condition";
          }
          session.completedAt = new Date();
          break;
        }
      }
    }

    return session;
  }

  private getQuestionData(question: SessionField) {
    const baseData = {
      id: question.id,
      type: question.type,
      order: question.order
    };

    switch (question.type) {
      case 'TextQuestion': {
        const textQuestion = question as SessionTextQuestion;
        return {
          ...baseData,
          text: textQuestion.text,
          description: textQuestion.description,
          required: textQuestion.required,
          instructions: textQuestion.instructions
        };
      }
      case 'RatingQuestion': {
        const ratingQuestion = question as SessionRatingQuestion;
        return {
          ...baseData,
          text: ratingQuestion.text,
          description: ratingQuestion.description,
          required: ratingQuestion.required,
          labels: ratingQuestion.labels,
          steps: ratingQuestion.steps
        };
      }
      case 'MatrixQuestion': {
        const matrixQuestion = question as SessionMatrixQuestion;
        return {
          ...baseData,
          text: matrixQuestion.text,
          description: matrixQuestion.description,
          required: matrixQuestion.required,
          columns: matrixQuestion.columns,
          rows: matrixQuestion.rows,
          allowMultiplePerRow: matrixQuestion.allowMultiplePerRow
        };
      }
      case 'NumberQuestion': {
        const numberQuestion = question as SessionNumberQuestion;
        return {
          ...baseData,
          text: numberQuestion.text,
          description: numberQuestion.description,
          required: numberQuestion.required,
          min: numberQuestion.min,
          max: numberQuestion.max,
          unit: numberQuestion.unit,
        };
      }
      case 'StatementField': {
        const statementField = question as SessionStatementField;
        return {
          ...baseData,
          text: statementField.text,
          buttonText: statementField.buttonText,
          textSize: statementField.textSize,
        };
      }
      case 'MultipleChoiceQuestion': {
        const multipleChoiceQuestion = question as SessionMultipleChoiceQuestion;
        return {
          ...baseData,
          text: multipleChoiceQuestion.text,
          description: multipleChoiceQuestion.description,
          required: multipleChoiceQuestion.required,
          choices: multipleChoiceQuestion.choices,
          allowMultiple: multipleChoiceQuestion.allowMultiple,
          randomize: multipleChoiceQuestion.randomize
        };
      }
      case 'RankingQuestion': {
        const rankingQuestion = question as SessionRankingQuestion;
        return {
          ...baseData,
          text: rankingQuestion.text,
          description: rankingQuestion.description,
          required: rankingQuestion.required,
          choices: rankingQuestion.choices,
          randomize: rankingQuestion.randomize
        };
      }
      default:
        return baseData;
    }
  }

  async getNextQuestion(sessionId: string, firstQuestion: boolean = false): Promise<{
    nextQuestion: any;
    status: SessionStatus;
    session: SurveySessionEntity;
  }> {
    let session = await this.sessionRepository.findOne({
      where: { id: sessionId }
    });

    const questions = this.flattenQuestions(session.state);
    const nextQuestion = questions.find(q => q.status === QuestionStatus.Created);

    if (!nextQuestion) {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId }
      });
      session.completedAt = new Date();
      await this.sessionRepository.save(session);
      return {
        nextQuestion: null,
        status: SessionStatus.COMPLETED,
        session,
      };
    }

    if (nextQuestion.type === 'Checkpoint') {
      session = await this.handleCheckpoint(session, nextQuestion as SessionCheckpoint);

      await this.sessionRepository.save(session);
      return this.getNextQuestion(sessionId);
    }

    if (nextQuestion.type === 'TextQuestion' && !firstQuestion) {
      const repetitionResult = await this.scoutiEngine.detectRepetition(nextQuestion as SessionTextQuestion, this.buildConversationHistory(session));
      if (repetitionResult.detected) {
        session.state = this.skipRepetition(session.state, nextQuestion, repetitionResult);
        await this.updateSessionState(sessionId, () => {
          return session.state;
        });
        return this.getNextQuestion(sessionId);
      }
    }

    return {
      nextQuestion: this.getQuestionData(nextQuestion),
      status: SessionStatus.IN_PROGRESS,
      session,
    };
  }

  async generateNextQuestion(input: SubmitSurveySessionAnswerInput): Promise<{
    nextQuestion: any;
    status: SessionStatus;
    session: SurveySessionEntity;
  }> {

    const session = await this.sessionRepository.findOne({
      where: { id: input.sessionId }
    });
    const questions = this.flattenQuestions(session.state);
    const currentQuestion = questions.find(q => q.id === input.questionId);

    if (currentQuestion.type === 'TextQuestion') {
      const conversationHistory = this.buildConversationHistory(session);
      const followUpQuestions = await this.scoutiEngine.generateFollowUpQuestions(session.state, currentQuestion as SessionTextQuestion, input.answer, conversationHistory);
      session.state = this.addFollowUpQuestions(session.state, currentQuestion, followUpQuestions);
    }

    await this.updateSessionState(input.sessionId, () => {
      const answeredQuestion = questions.find(q => q.id === input.questionId);
      const topic = session.state.topics.find(t =>
        t.fields.some(f => f.id === answeredQuestion.id)
      );
      const field = topic.fields.find(f => f.id === answeredQuestion.id);

      field.response = input.answer;
      field.status = QuestionStatus.Asked;

      return session.state;
    });

    // Get next question
    return this.getNextQuestion(input.sessionId);
  }

  private buildConversationHistory(session: SurveySessionEntity): ConversationHistory {
    const history = []
    session.state.topics.flatMap(t => t.fields).forEach(f => {
      if (f.type === SurveyFieldTypeEnum.Checkpoint) {
        return;
      }
      if (f.response) {
        history.push({
          role: 'assistant',
          content: f.text
        });
        history.push({
          role: 'respondent',
          content: f.response ? JSON.stringify(f.response) : ""
        });
      }
    });
    return history;
  }

  private addFollowUpQuestions(state: SessionState, currentQuestion: SessionField, followUpQuestions: string[]) {
    const questions = this.flattenQuestions(state);
    const currentQuestionIndex = questions.findIndex(q => q.id === currentQuestion.id);
    const followUpQuestionsWithIds = followUpQuestions.map(q => ({
      id: uuidv4(),
      type: SurveyFieldTypeEnum.TextQuestion,
      text: q,
      description: "",
      required: true,
      instructions: "",
      order: questions.length,
      isQuestion: true,
      response: "",
      status: QuestionStatus.Created,
      isFollowup: true,
      leadingQuestion: currentQuestion.id,
    }));
    const topic = state.topics.find(t => t.fields.some(f => f.id === currentQuestion.id));
    topic.fields.splice(currentQuestionIndex + 1, 0, ...followUpQuestionsWithIds);
    return state;
  }

  private skipRepetition(state: SessionState, nextQuestion: SessionField, repetitionResult: {
    detected: boolean;
    reason: string;
  }) {
    const topic = state.topics.find(t => t.fields.some(f => f.id === nextQuestion.id));
    const field = topic.fields.find(f => f.id === nextQuestion.id);
    field.status = QuestionStatus.Skipped;
    field.response = "The question was skipped because it was repetitive. Here is the rationale: " + repetitionResult.reason;
    return state;
  }
}