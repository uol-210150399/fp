import { Resolver, Args, ResolveField } from '@nestjs/graphql';
import {
  UserGetInput,
  UserGetOutput,
  UserListInput,
  UserListOutput,
} from '../../generated/graphql';
import { UserService } from './user.service';

@Resolver('UserQuery')
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField()
  async get(@Args('input') input: UserGetInput): Promise<UserGetOutput> {
    const user = await this.userService.get(input.id);
    if (!user) {
      return {
        __typename: 'UserGetFailure',
        error: {
          message: 'User not found',
        },
      };
    }
    return {
      __typename: 'UserGetSuccess',
      user: {
        id: user.PK,
        name: user.name,
        email: user.email,
        isDeleted: user.isDeleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  @ResolveField()
  async list(@Args('input') input: UserListInput): Promise<UserListOutput> {
    const filter = input.filter;
    const teamId = filter?.teamId;
    return {
      __typename: 'UserListSuccess',
      users: {
        edges: [
          {
            node: {
              id: teamId,
              name: 'John Doe',
              email: 'john@example.com',
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            cursor: '1',
          },
        ],
        pageInfo: {
          endCursor: '1',
          hasNextPage: false,
        },
      },
    };
  }

  @ResolveField()
  async me(): Promise<UserGetOutput> {
    return {
      __typename: 'UserGetSuccess',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
