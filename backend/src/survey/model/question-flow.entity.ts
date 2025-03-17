import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { TransitionRuleEntity } from './transition-rule.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';

@Entity('question_flow')
export class QuestionFlowEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'question_flow_id' })
  questionFlowId: string;

  @Column({ name: 'from_question_id' })
  fromQuestionId: string;

  @Column({ name: 'to_question_id' })
  toQuestionId: string;

  @Column({ name: 'transition_rule_id' })
  transitionRuleId: string;

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

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'from_question_id', referencedColumnName: 'questionId' })
  fromQuestion: QuestionEntity;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'to_question_id', referencedColumnName: 'questionId' })
  toQuestion: QuestionEntity;

  @ManyToOne(() => TransitionRuleEntity)
  @JoinColumn({
    name: 'transition_rule_id',
    referencedColumnName: 'transitionRuleId',
  })
  transitionRule: TransitionRuleEntity;
}
