import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { TeamQueryResolver } from './team-query.resolver';
import { TeamMutationResolver } from './team-mutation.resolver';
import { ProjectQueryResolver } from './project-query.resolver';
import { ProjectMutationResolver } from './project-mutation.resolver';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    OrganizationResolver,
    TeamQueryResolver,
    TeamMutationResolver,
    ProjectQueryResolver,
    ProjectMutationResolver,
  ],
})
export class OrganizationModule {}
