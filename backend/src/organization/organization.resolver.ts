import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { OrganizationMutation, OrganizationQuery } from '../generated/graphql';
import { UserQueryResolver } from './user/user-query.resolver';
import { UserMutationResolver } from './user/user-mutation.resolver';
import { TeamQueryResolver } from './team-query.resolver';
import { TeamMutationResolver } from './team-mutation.resolver';
import { ProjectQueryResolver } from './project-query.resolver';
import { ProjectMutationResolver } from './project-mutation.resolver';

@Resolver('Organization')
export class OrganizationResolver {
  constructor(
    private userQueryResolver: UserQueryResolver,
    private userMutationResolver: UserMutationResolver,
    private teamQueryResolver: TeamQueryResolver,
    private teamMutationResolver: TeamMutationResolver,
    private projectQueryResolver: ProjectQueryResolver,
    private projectMutationResolver: ProjectMutationResolver,
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
      team: {
        __typename: 'TeamQuery',
        get: this.teamQueryResolver.get.bind(this.teamQueryResolver),
        list: this.teamQueryResolver.list.bind(this.teamQueryResolver),
      },
      project: {
        __typename: 'ProjectQuery',
        get: this.projectQueryResolver.get.bind(this.projectQueryResolver),
        list: this.projectQueryResolver.list.bind(this.projectQueryResolver),
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
        update: this.userMutationResolver.update.bind(
          this.userMutationResolver,
        ),
        delete: this.userMutationResolver.delete.bind(
          this.userMutationResolver,
        ),
      },
      team: {
        __typename: 'TeamMutation',
        create: this.teamMutationResolver.create.bind(
          this.teamMutationResolver,
        ),
        update: this.teamMutationResolver.update.bind(
          this.teamMutationResolver,
        ),
        delete: this.teamMutationResolver.delete.bind(
          this.teamMutationResolver,
        ),
        addUser: this.teamMutationResolver.addUser.bind(
          this.teamMutationResolver,
        ),
        removeUser: this.teamMutationResolver.removeUser.bind(
          this.teamMutationResolver,
        ),
      },
      project: {
        __typename: 'ProjectMutation',
        create: this.projectMutationResolver.create.bind(
          this.projectMutationResolver,
        ),
        update: this.projectMutationResolver.update.bind(
          this.projectMutationResolver,
        ),
        delete: this.projectMutationResolver.delete.bind(
          this.projectMutationResolver,
        ),
      },
    };
  }
}
