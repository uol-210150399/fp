import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';

@Entity('published_survey')
export class PublishedSurveyEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'published_survey_id' })
  publishedSurveyId: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'slug' })
  slug: string;

  @ManyToOne(() => SurveyEntity)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;
}
