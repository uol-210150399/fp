import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { UserQueryResolver } from './user-query.resolver';
import { UserMutationResolver } from './user-mutation.resolver';
import { TeamQueryResolver } from './team-query.resolver';
import { TeamMutationResolver } from './team-mutation.resolver';
import { ProjectQueryResolver } from './project-query.resolver';
import { ProjectMutationResolver } from './project-mutation.resolver';

@Module({
  providers: [
    OrganizationResolver,
    UserQueryResolver,
    UserMutationResolver,
    TeamQueryResolver,
    TeamMutationResolver,
    ProjectQueryResolver,
    ProjectMutationResolver,
  ],
})
export class OrganizationModule {}
