import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditableEntity } from '../../common/model/auditable.entity';
@Entity('user')
export class UserEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'name' })
  name: string;
}
