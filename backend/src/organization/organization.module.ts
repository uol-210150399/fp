import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { UserResolver } from './user.resolver';

@Module({
  providers: [OrganizationResolver, UserResolver],
})
export class OrganizationModule {}
