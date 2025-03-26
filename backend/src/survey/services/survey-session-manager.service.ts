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
  SessionRatingQuestion
} from '../mappers/session-state.mapper';
import { ConversationHistory } from './scouti/schema';
import { v4 as uuidv4 } from 'uuid';
import { ScoutiEngine } from './scouti/engine';

@Injectable()
export class SurveySessionManagerService {
  constructor(
    @InjectRepository(SurveySessionEntity)
    private readonly sessionRepository: Repository<SurveySessionEntity>,
    private readonly scoutiEngine: ScoutiEngine
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

  private handleCheckpoint(state: SessionState, currentQuestion: SessionField): SessionState {
    const topic = state.topics.find(t => t.fields.some(f => f.id === currentQuestion.id));
    const field = topic.fields.find(f => f.id === currentQuestion.id) as SessionCheckpoint;
    field.response = "The condition is not met";
    field.status = QuestionStatus.Asked;
    return state;
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
      case 'MultipleChoiceQuestion': {
        const mcQuestion = question as SessionMultipleChoiceQuestion;
        return {
          ...baseData,
          text: mcQuestion.text,
          description: mcQuestion.description,
          required: mcQuestion.required,
          choices: mcQuestion.choices,
          allowMultiple: mcQuestion.allowMultiple
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
      default:
        return baseData;
    }
  }

  async getNextQuestion(sessionId: string): Promise<{
    nextQuestion: any;
    status: SessionStatus;
  }> {
    const session = await this.sessionRepository.findOne({
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
        status: SessionStatus.COMPLETED
      };
    }

    if (nextQuestion.type === 'Checkpoint') {
      session.state = this.handleCheckpoint(session.state, nextQuestion as SessionCheckpoint);

      await this.updateSessionState(sessionId, () => {
        return session.state;
      });

      return this.getNextQuestion(sessionId);
    }

    if (nextQuestion.type === 'TextQuestion') {
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
      status: SessionStatus.IN_PROGRESS
    };
  }

  async generateNextQuestion(input: SubmitSurveySessionAnswerInput): Promise<{
    nextQuestion: any;
    status: SessionStatus;
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

    await this.updateSessionState(input.sessionId, (state) => {
      const answeredQuestion = questions.find(q => q.id === input.questionId);
      const topic = state.topics.find(t =>
        t.fields.some(f => f.id === answeredQuestion.id)
      );
      const field = topic.fields.find(f => f.id === answeredQuestion.id);

      field.response = input.answer;
      field.status = QuestionStatus.Asked;

      return state;
    });

    // Get next question
    return this.getNextQuestion(input.sessionId);
  }

  private buildConversationHistory(session: SurveySessionEntity): ConversationHistory {
    const history = []
    session.state.topics.flatMap(t => t.fields).forEach(f => {
      history.push({
        role: 'assistant',
        content: f.text
      });
      history.push({
        role: 'user',
        content: f.response
      });
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