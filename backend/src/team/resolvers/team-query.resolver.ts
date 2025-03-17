import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { AuthGuard } from '../../auth/auth.guard';
import { ErrorCode, PaginationInput, TeamResponse, TeamsResponse } from '../../generated/graphql';
import { TeamDTOMapper } from '../dtos/team-dto-mapper';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver('Query')
@UseGuards(AuthGuard)
export class TeamQueryResolver {
  constructor(private readonly teamService: TeamService) { }

  @Query()
  async team(@Args('id') id: string, @CurrentUser() userId: string): Promise<TeamResponse> {
    try {
      const team = await this.teamService.getTeam(id, userId);
      return {
        data: TeamDTOMapper.toGraphQL(team),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error.message || 'Failed to get team',
          code: ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Query()
  async teams(@CurrentUser() userId: string, @Args('pagination') pagination?: PaginationInput): Promise<TeamsResponse> {
    try {
      const { teams, hasNextPage } = await this.teamService.listTeams({
        filter: {
          userId,
        },
        pagination: {
          first: pagination?.first || 10,
          after: pagination?.after,
        },
      });

      return {
        data: {
          edges: teams.map(team => ({
            cursor: team.id,
            node: TeamDTOMapper.toGraphQL(team),
          })),
          pageInfo: {
            hasNextPage,
            endCursor: teams.length > 0 ? teams[teams.length - 1].id : null,
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
          message: error.message || 'Failed to list teams',
          code: ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 