import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/model/base.entity';
import { TeamEntity } from '../../team/model/team.entity';
import { TeamMembershipEntity } from '../../team/model/team-membership.entity';

@Entity('project')
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @ManyToOne(() => TeamEntity, team => team.projects)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamMembershipEntity)
  @JoinColumn({ name: 'created_by_membership_id' })
  createdByMembership: TeamMembershipEntity;

  @Column({ name: 'created_by_membership_id' })
  createdByMembershipId: string;
}