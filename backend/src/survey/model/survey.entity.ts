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
import { ProjectEntity } from '../../project/model/project.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';
import { QuestionGroupEntity } from './question-group.entity';

@Entity('survey')
export class SurveyEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'project_id' })
  projectId: string;

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

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'projectId' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'userId' })
  createdByUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'userId' })
  updatedByUser: UserEntity;

  @OneToMany(() => QuestionGroupEntity, (questionGroup) => questionGroup.survey)
  questionGroups: QuestionGroupEntity[];
}
