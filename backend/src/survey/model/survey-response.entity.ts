import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PublishedSurveyEntity } from './published-survey.entity';
import { SurveyEntity } from './survey.entity';
import { SurveySessionAnswer } from 'src/generated/graphql';

@Entity('survey_session')
export class SurveySessionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'published_survey_id' })
  publishedSurveyId: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'respondent_id', nullable: true })
  respondentId?: string;

  @Column({ name: 'respondent_ip', nullable: true })
  respondentIp?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'last_answered_at', type: 'timestamptz' })
  lastAnsweredAt: Date;

  @Column({ type: 'jsonb', name: 'answers' })
  answers: SurveySessionAnswer[];

  @Column({ name: 'is_partial', default: true })
  isPartial: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => PublishedSurveyEntity)
  @JoinColumn({ name: 'published_survey_id' })
  publishedSurvey: PublishedSurveyEntity;

  @ManyToOne(() => SurveyEntity)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity;
} 