import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditableEntity } from '../../common/model/auditable.entity';

@Entity('project')
export class ProjectEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_id' })
  projectId: string;

  @Column({ name: 'title' })
  title: string;
}
