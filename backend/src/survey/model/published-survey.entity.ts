import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { TeamMembershipEntity } from '../../team/model/team-membership.entity';
import { Injectable } from '@nestjs/common';

@Entity('published_survey')
@Unique(['surveyId', 'version'])
@Injectable()
export class PublishedSurveyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'form_snapshot', type: 'jsonb', nullable: false })
  formSnapshot: any;

  @ManyToOne(() => SurveyEntity, (survey) => survey.publishedVersions)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'version', type: 'integer' })
  version: number;

  @Column({ name: 'published_by', nullable: true, type: 'uuid' })
  publishedById: string;

  @ManyToOne(() => TeamMembershipEntity)
  @JoinColumn({ name: 'published_by' })
  publishedBy: TeamMembershipEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
