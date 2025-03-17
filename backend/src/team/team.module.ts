import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamQueryResolver } from './resolvers/team-query.resolver';
import { TeamMutationResolver } from './resolvers/team-mutation.resolver';
import { TeamService } from './services/team.service';
import { ProjectQueryResolver } from './resolvers/project-query.resolver';
import { ProjectMutationResolver } from './resolvers/project-mutation.resolver';
import { ProjectService } from './services/project.service';
import { TeamEntity } from './model/team.entity';
import { TeamMembershipEntity } from './model/team-membership.entity';
import { ProjectEntity } from '../project/model/project.entity';
import { TeamMemberService } from './services/team-member.service';
import { TeamMemberMutationResolver } from './resolvers/team-member-mutation.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, TeamMembershipEntity, ProjectEntity]),
    AuthModule,
  ],
  providers: [
    // Team resolvers
    TeamQueryResolver,
    TeamMutationResolver,
    TeamService,

    // Project resolvers
    ProjectQueryResolver,
    ProjectMutationResolver,
    ProjectService,

    // Team member resolvers and services
    TeamMemberService,
    TeamMemberMutationResolver,
  ],
  exports: [TeamService, ProjectService, TeamMemberService],
})
export class TeamModule { }
