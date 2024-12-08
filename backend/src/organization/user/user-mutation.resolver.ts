import { Args, Resolver, ResolveField } from '@nestjs/graphql';
import {
  UserCreateInput,
  UserCreateOutput,
  UserUpdateInput,
  UserUpdateOutput,
  UserDeleteInput,
  UserDeleteOutput,
} from '../../generated/graphql';
import { UserService } from './user.service';

@Resolver('UserMutation')
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField()
  async create(
    @Args('input') input: UserCreateInput,
  ): Promise<UserCreateOutput> {
    try {
      const userId = await this.userService.create(
        input.email,
        input.name,
        input.password,
      );
      return {
        __typename: 'UserCreateSuccess',
        user: {
          id: userId,
          name: input.name,
          email: input.email,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        __typename: 'UserCreateFailure',
        error: {
          message: error.message || 'Failed to create user',
        },
      };
    }
  }

  @ResolveField()
  async update(
    @Args('input') input: UserUpdateInput,
  ): Promise<UserUpdateOutput> {
    try {
      // TODO: Add actual user update logic
      return {
        __typename: 'UserUpdateSuccess',
        user: {
          id: input.id,
          name: input.name,
          email: 'user@example.com', // This would come from the database
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        __typename: 'UserUpdateFailure',
        error: {
          message: error.message || 'Failed to update user',
        },
      };
    }
  }

  @ResolveField()
  async delete(
    @Args('input') input: UserDeleteInput,
  ): Promise<UserDeleteOutput> {
    try {
      // TODO: Add actual user deletion logic
      return {
        __typename: 'UserDeleteSuccess',
        user: {
          id: input.id,
          name: 'Deleted User',
          email: 'deleted@example.com',
          isDeleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        __typename: 'UserDeleteFailure',
        error: {
          message: error.message || 'Failed to delete user',
        },
      };
    }
  }
}
