import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/model/user.entity';
import { SurveyEntity } from './survey.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';
import { QuestionEntity } from './question.entity';

@Entity('question_group')
export class QuestionGroupEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'question_group_id' })
  questionGroupId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_deleted_flag', default: false })
  isDeletedFlag: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => SurveyEntity, (survey) => survey.questionGroups)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'userId' })
  createdByUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'userId' })
  updatedByUser: UserEntity;

  @OneToMany(() => QuestionEntity, (question) => question.questionGroup)
  questions: QuestionEntity[];
}
