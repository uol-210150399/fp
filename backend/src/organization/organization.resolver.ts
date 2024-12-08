import { Resolver, Query } from '@nestjs/graphql';
import { OrganizationQuery } from '../generated/graphql';
import { UserResolver } from './user.resolver';

@Resolver('Organization')
export class OrganizationResolver {
  constructor(private userResolver: UserResolver) {}

  @Query('organization')
  async organization(): Promise<OrganizationQuery> {
    return {
      __typename: 'OrganizationQuery',
      user: {
        __typename: 'UserQuery',
        get: this.userResolver.get.bind(this.userResolver),
        list: this.userResolver.list.bind(this.userResolver),
        me: this.userResolver.me.bind(this.userResolver),
      },
    };
  }
}
