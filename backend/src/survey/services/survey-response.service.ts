import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveySessionEntity } from '../model/survey-response.entity';
import { PublishedSurveyEntity } from '../model/published-survey.entity';
import { SurveyEntity } from '../model/survey.entity';
import { SurveyKeyUtils } from '../utils/survey-key.utils';
import { SurveyValidationException } from '../exceptions/survey.exceptions';
import { SurveySessionAnswer } from 'src/generated/graphql';
// import { SurveySessionManagerService } from './survey-session-manager.service';

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
    // @Inject(SurveySessionManagerService)
    // private readonly sessionManager: SurveySessionManagerService,
  ) { }

  async startSurveySession(input: { surveyKey: string }, context: { ip?: string; }): Promise<SurveySessionEntity> {
    // Validate survey key
    if (!this.surveyKeyUtils.validateKey(input.surveyKey)) {
      throw new SurveyValidationException('Invalid survey key');
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

    // Create new response
    const response = this.responseRepository.create({
      surveyId: survey.surveyId,
      publishedSurveyId: latestPublishedVersion.id,
      startedAt: new Date(),
      answers: [],
      respondentIp: context.ip,
    });

    return this.responseRepository.save(response);
  }

  async submitSurveySessionAnswer(input: { sessionId: string; answer: SurveySessionAnswer }): Promise<SurveySessionEntity> {
    const response = await this.responseRepository.findOne({
      where: { id: input.sessionId },
      relations: ['publishedSurvey', 'publishedSurvey.form', 'publishedSurvey.form.sections', 'publishedSurvey.form.sections.fields'],
    });

    if (!response) {
      throw new SurveyValidationException('Response not found');
    }


    response.lastAnsweredAt = new Date();
    return this.responseRepository.save(response);
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