import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { SurveySectionEntity } from './survey-section.entity';
import { BaseEntity } from 'src/common/model/base.entity';

@Entity('survey_form')
export class SurveyFormEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'context', nullable: true })
  context: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => SurveyEntity)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @OneToMany(() => SurveySectionEntity, (section) => section.form)
  sections: SurveySectionEntity[];

  @Column({ name: 'welcome_message', nullable: true })
  welcomeMessage: string;
} 