import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TeamMemberService } from '../services/team-member.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ErrorCode,
  TeamMemberCreateInput,
  TeamMemberDeleteInput,
  TeamMemberResponse,
  TeamMemberUpdateInput,
} from '../../generated/graphql';
import { TeamMemberDTOMapper } from '../dtos/team-member-dto-mapper';
import { TeamNotFoundException, TeamPermissionDeniedException } from '../exceptions/team.exceptions';

@Resolver('Mutation')
@UseGuards(AuthGuard)
export class TeamMemberMutationResolver {
  constructor(private readonly teamMemberService: TeamMemberService) { }

  @Mutation()
  async createTeamMember(
    @Args('input') input: TeamMemberCreateInput,
    @CurrentUser() userId: string,
  ): Promise<TeamMemberResponse> {
    try {
      const member = await this.teamMemberService.addMember(
        input.teamId,
        input.userId,
        TeamMemberDTOMapper.mapTeamRoleToEntity(input.role),
        userId,
      );
      return {
        data: TeamMemberDTOMapper.toGraphQL(member),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamPermissionDeniedException
            ? error.message
            : error.message || 'Failed to create team member',
          code: error instanceof TeamPermissionDeniedException
            ? ErrorCode.FORBIDDEN
            : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateTeamMember(
    @Args('input') input: TeamMemberUpdateInput,
    @CurrentUser() userId: string,
  ): Promise<TeamMemberResponse> {
    try {
      const member = await this.teamMemberService.getMember(input.id);
      const updatedMember = await this.teamMemberService.updateMemberRole(
        member.teamId,
        member.userId,
        TeamMemberDTOMapper.mapTeamRoleToEntity(input.role),
        userId,
      );
      return {
        data: TeamMemberDTOMapper.toGraphQL(updatedMember),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamNotFoundException
            ? 'Team member not found'
            : error instanceof TeamPermissionDeniedException
              ? error.message
              : error.message || 'Failed to update team member',
          code: error instanceof TeamNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof TeamPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async deleteTeamMember(
    @Args('input') input: TeamMemberDeleteInput,
    @CurrentUser() userId: string,
  ): Promise<TeamMemberResponse> {
    try {
      const member = await this.teamMemberService.getMember(input.id);
      await this.teamMemberService.removeMember(
        member.teamId,
        member.userId,
        userId,
      );
      return {
        data: TeamMemberDTOMapper.toGraphQL(member),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof TeamNotFoundException
            ? 'Team member not found'
            : error instanceof TeamPermissionDeniedException
              ? error.message
              : error.message || 'Failed to delete team member',
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