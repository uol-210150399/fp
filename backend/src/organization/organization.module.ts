import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { UserQueryResolver } from './user-query.resolver';
import { UserMutationResolver } from './user-mutation.resolver';

@Module({
  providers: [OrganizationResolver, UserQueryResolver, UserMutationResolver],
})
export class OrganizationModule {}
