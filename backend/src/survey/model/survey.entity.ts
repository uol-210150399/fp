import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from '../../project/model/project.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';
import { PublishedSurveyEntity } from './published-survey.entity';
import { SurveyStatus } from 'src/generated/graphql';
import { SurveyFormEntity } from './survey-form.entity';

@Entity('survey')
export class SurveyEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SurveyStatus,
    default: SurveyStatus.DRAFT
  })
  status: SurveyStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: ProjectEntity;

  @OneToOne(() => SurveyFormEntity, (form) => form.survey)
  form: SurveyFormEntity;

  @OneToMany(() => PublishedSurveyEntity, (publishedSurvey) => publishedSurvey.survey)
  publishedVersions: PublishedSurveyEntity[];
}
