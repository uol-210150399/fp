import { Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';
import { BaseEntity } from 'src/common/model/base.entity';
import { TeamMembershipEntity } from './team-membership.entity';
import { ProjectEntity } from '../../project/model/project.entity';

@Entity('team')
export class TeamEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'team_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'slug', unique: true })
  slug: string;

  @OneToMany(() => TeamMembershipEntity, membership => membership.team)
  memberships: TeamMembershipEntity[];

  @OneToMany(() => ProjectEntity, project => project.team)
  projects: ProjectEntity[];

  @Column({ name: 'created_by_user_id' })
  createdByUserId: string;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
}