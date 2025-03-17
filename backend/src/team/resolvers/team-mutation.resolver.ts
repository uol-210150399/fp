import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ErrorCode,
  TeamCreateInput,
  TeamDeleteInput,
  TeamResponse,
  TeamUpdateInput,
} from '../../generated/graphql';
import { TeamDTOMapper } from '../dtos/team-dto-mapper';
import {
  TeamNameConflictException,
  TeamNotFoundException,
  TeamPermissionDeniedException,
} from '../exceptions/team.exceptions';

@Resolver('Mutation')
@UseGuards(AuthGuard)
export class TeamMutationResolver {
  constructor(private readonly teamService: TeamService) { }

  @Mutation()
  async createTeam(
    @Args('input') input: TeamCreateInput,
    @CurrentUser() userId: string,
  ): Promise<TeamResponse> {
    try {
      const team = await this.teamService.createTeam(input, userId);
      return {
        data: TeamDTOMapper.toGraphQL(team),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamNameConflictException
            ? 'A team with this name already exists'
            : error.message || 'Failed to create team',
          code: error instanceof TeamNameConflictException
            ? ErrorCode.VALIDATION_ERROR
            : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateTeam(
    @Args('input') input: TeamUpdateInput,
    @CurrentUser() userId: string
  ): Promise<TeamResponse> {
    try {
      const team = await this.teamService.updateTeam(input, userId);
      return {
        data: TeamDTOMapper.toGraphQL(team),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamNotFoundException
            ? 'Team not found'
            : error instanceof TeamNameConflictException
              ? 'A team with this name already exists'
              : error.message || 'Failed to update team',
          code: error instanceof TeamNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof TeamNameConflictException
              ? ErrorCode.VALIDATION_ERROR
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async deleteTeam(
    @Args('input') input: TeamDeleteInput,
    @CurrentUser() userId: string,
  ): Promise<TeamResponse> {
    try {
      const team = await this.teamService.deleteTeam(input.id, userId);
      return {
        data: TeamDTOMapper.toGraphQL(team),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamNotFoundException
            ? 'Team not found'
            : error instanceof TeamPermissionDeniedException
              ? error.message
              : error.message || 'Failed to delete team',
          code: error instanceof TeamNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof TeamPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 