import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuditableEntity } from 'src/common/model/auditable.entity';

@Entity('transition_rule')
export class TransitionRuleEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'transition_rule_id' })
  transitionRuleId: string;

  @Column({ name: 'rule', type: 'jsonb' })
  rule: Record<string, any>;

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
}
