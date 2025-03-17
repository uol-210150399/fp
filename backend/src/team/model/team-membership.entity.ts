import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/model/base.entity';
import { TeamEntity } from './team.entity';

export enum TeamRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

@Entity('team_membership')
export class TeamMembershipEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'membership_id' })
  id: string;

  @ManyToOne(() => TeamEntity, team => team.memberships)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'team_id' })
  teamId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: TeamRole,
    default: TeamRole.MEMBER
  })
  role: TeamRole;
} 