import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PublishedSurveyEntity } from './published-survey.entity';
import { SurveyEntity } from './survey.entity';

@Entity('survey_session')
export class SurveySessionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @ManyToOne(() => SurveyEntity)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;

  @Column({ name: 'published_survey_id', nullable: true })
  publishedSurveyId?: string;

  @ManyToOne(() => PublishedSurveyEntity)
  @JoinColumn({ name: 'published_survey_id' })
  publishedSurvey?: PublishedSurveyEntity;

  @Column({ name: 'respondent_data', type: 'jsonb' })
  respondentData: {
    email?: string;
    name?: string;
    role?: string;
    ip?: string;
  };

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'last_activity_at', type: 'timestamptz' })
  lastActivityAt: Date;

  @Column({ name: 'state', type: 'jsonb' })
  state: any;

  @Column({ name: 'is_partial', default: true })
  isPartial: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 