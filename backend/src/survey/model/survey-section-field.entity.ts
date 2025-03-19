import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/model/base.entity';
import { SurveySectionEntity } from './survey-section.entity';
import { SurveyFieldTypeEnum } from 'src/generated/graphql';

@Entity('survey_section_field')
export class SurveySectionFieldEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'order' })
  order: number;

  @Column({ name: 'type', type: 'enum', enum: SurveyFieldTypeEnum })
  type: SurveyFieldTypeEnum;

  @Column({ name: 'data', type: 'jsonb', nullable: false })
  data: any;

  @Column({ name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => SurveySectionEntity)
  @JoinColumn({ name: 'section_id', referencedColumnName: 'id' })
  section: SurveySectionEntity;
} 