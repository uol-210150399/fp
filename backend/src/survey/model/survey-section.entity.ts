import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SurveyFormEntity } from './survey-form.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';
import { SurveySectionFieldEntity } from './survey-section-field.entity';

@Entity('survey_section')
export class SurveySectionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'form_id' })
  formId: string;

  @OneToMany(() => SurveySectionFieldEntity, (field) => field.section)
  fields: SurveySectionFieldEntity[];

  @Column({ name: 'order' })
  order: number;

  @ManyToOne(() => SurveyFormEntity, (form) => form.sections)
  @JoinColumn({ name: 'form_id', referencedColumnName: 'id' })
  form: SurveyFormEntity;
} 