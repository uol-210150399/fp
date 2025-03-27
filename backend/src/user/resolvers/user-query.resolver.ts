import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { UserService } from '../services/user.service';
import {
  ErrorCode,
  PaginationInput,
  UsersFilterInput,
  UsersResponse,
} from '../../generated/graphql';

@Resolver('Query')
@UseGuards(AuthGuard)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) { }

  @Query()
  async users(
    @Args('pagination') pagination: PaginationInput,
    @Args('filter') filter?: UsersFilterInput,
  ): Promise<UsersResponse> {
    try {
      const users = await this.userService.getUsers(filter?.search);
      return {
        data: {
          edges: users.map((user, index) => ({
            cursor: index.toString(),
            node: user,
          })),
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
        error: null,
      };
    } catch (error) {
      return {
        data: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
        error: {
          message: error.message || 'Failed to fetch users',
          code: ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 