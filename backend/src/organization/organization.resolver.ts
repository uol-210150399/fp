import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { OrganizationMutation, OrganizationQuery } from '../generated/graphql';
import { UserQueryResolver } from './user-query.resolver';
import { UserMutationResolver } from './user-mutation.resolver';

@Resolver('Organization')
export class OrganizationResolver {
  constructor(
    private userQueryResolver: UserQueryResolver,
    private userMutationResolver: UserMutationResolver,
  ) {}

  @Query('organization')
  async organization(): Promise<OrganizationQuery> {
    return {
      __typename: 'OrganizationQuery',
      user: {
        __typename: 'UserQuery',
        get: this.userQueryResolver.get.bind(this.userQueryResolver),
        list: this.userQueryResolver.list.bind(this.userQueryResolver),
        me: this.userQueryResolver.me.bind(this.userQueryResolver),
      },
    };
  }

  @Mutation('organization')
  async organizationMutation(): Promise<OrganizationMutation> {
    return {
      __typename: 'OrganizationMutation',
      user: {
        __typename: 'UserMutation',
        create: this.userMutationResolver.create.bind(
          this.userMutationResolver,
        ),
        delete: this.userMutationResolver.delete.bind(
          this.userMutationResolver,
        ),
        update: this.userMutationResolver.update.bind(
          this.userMutationResolver,
        ),
      },
    };
  }
}
