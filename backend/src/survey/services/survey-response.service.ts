import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveySessionEntity } from '../model/survey-response.entity';
import { PublishedSurveyEntity } from '../model/published-survey.entity';
import { SurveyEntity } from '../model/survey.entity';
import { SurveyKeyUtils } from '../utils/survey-key.utils';
import { SurveyValidationException } from '../exceptions/survey.exceptions';
import { SessionStatus, SubmitSurveySessionAnswerInput } from 'src/generated/graphql';
import { SurveySessionManagerService } from './survey-session-manager.service';
import { SessionStateMapper } from '../mappers/session-state.mapper';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectRepository(SurveySessionEntity)
    private readonly responseRepository: Repository<SurveySessionEntity>,
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(PublishedSurveyEntity)
    private readonly publishedSurveyRepository: Repository<PublishedSurveyEntity>,
    @Inject(SurveyKeyUtils)
    private readonly surveyKeyUtils: SurveyKeyUtils,
    @Inject(SurveySessionManagerService)
    private readonly sessionManager: SurveySessionManagerService,
  ) { }

  async startSurveySession(input: { surveyKey: string, sessionId?: string }, context: { ip?: string; }): Promise<{
    nextQuestion: any,
    status: SessionStatus,
    session: SurveySessionEntity,
  }> {
    // Validate survey key
    if (!this.surveyKeyUtils.validateKey(input.surveyKey)) {
      throw new SurveyValidationException('Invalid survey key');
    }

    // Check if survey session
    if (input.sessionId) {
      const session = await this.responseRepository.findOne({
        where: { id: input.sessionId },
        relations: ['survey', 'publishedSurvey'],
      });

      if (session.completedAt) {
        return {
          nextQuestion: null,
          status: SessionStatus.COMPLETED,
          session,
        }
      }

      if (!session) {
        throw new SurveyValidationException('Session not found');
      }

      if (session.survey.key !== input.surveyKey) {
        throw new SurveyValidationException('Session does not match survey');
      }

      const { nextQuestion, status } = await this.sessionManager.getNextQuestion(session.id);
      return {
        nextQuestion,
        status,
        session,
      }
    }

    // Find the survey and its latest published version
    const survey = await this.surveyRepository.findOne({
      where: { key: input.surveyKey },
    });

    if (!survey) {
      throw new SurveyValidationException('Survey not found');
    }

    const latestPublishedVersion = await this.publishedSurveyRepository.findOne({
      where: { surveyId: survey.surveyId },
      order: { createdAt: 'DESC' },
    });

    if (!latestPublishedVersion) {
      throw new SurveyValidationException('Survey is not published');
    }

    const response = this.responseRepository.create({
      surveyId: survey.surveyId,
      publishedSurveyId: latestPublishedVersion.id,
      state: SessionStateMapper.toState(latestPublishedVersion.formSnapshot),
      startedAt: new Date(),
      respondentData: {
        ip: context.ip,
      },
      lastActivityAt: new Date(),
    });

    const savedResponse = await this.responseRepository.save(response);
    const { nextQuestion, status } = await this.sessionManager.getNextQuestion(savedResponse.id, true);
    return {
      nextQuestion,
      status,
      session: savedResponse,
    }
  }

  async submitSurveySessionAnswer(input: SubmitSurveySessionAnswerInput): Promise<{
    nextQuestion: any,
    status: SessionStatus,
    session: SurveySessionEntity,
  }> {
    const session = await this.getSurveySession(input.sessionId);
    if (!session) {
      throw new SurveyValidationException('Session not found');
    }

    const { nextQuestion, status, session: updatedSession } = await this.sessionManager.generateNextQuestion(input);
    return {
      nextQuestion,
      status,
      session: updatedSession,
    };
  }

  async getSurveySession(sessionId: string): Promise<SurveySessionEntity> {
    const response = await this.responseRepository.findOne({
      where: { id: sessionId },
      relations: ['publishedSurvey'],
    });

    if (!response) {
      throw new SurveyValidationException('Response not found');
    }

    return response;
  }

  async listSurveySessions(input: {
    filter: { projectId: string };
    pagination: { first: number; after?: string };
  }): Promise<{ sessions: SurveySessionEntity[]; hasNextPage: boolean }> {
    const { first, after } = input.pagination;

    const queryBuilder = this.responseRepository
      .createQueryBuilder('session')
      .leftJoin('session.survey', 'survey')
      .leftJoin('survey.project', 'project')
      .where('project.id = :projectId', { projectId: input.filter.projectId })
      .orderBy('session.createdAt', 'DESC')
      .take(first + 1);

    if (after) {
      queryBuilder.andWhere('session.id > :after', { after });
    }

    const sessions = await queryBuilder.getMany();
    const hasNextPage = sessions.length > first;

    return {
      sessions: sessions.slice(0, first),
      hasNextPage,
    };
  }
} 