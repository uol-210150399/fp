import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/model/user.entity';
import { BaseEntity } from './base.entity';

export abstract class AuditableEntity extends BaseEntity {
  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'userId' })
  createdByUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'userId' })
  updatedByUser: UserEntity;
}
