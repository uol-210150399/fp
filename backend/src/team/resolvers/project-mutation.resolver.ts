import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ErrorCode,
  ProjectCreateInput,
  ProjectDeleteInput,
  ProjectResponse,
  ProjectUpdateInput,
} from '../../generated/graphql';
import { ProjectDTOMapper } from '../dtos/project-dto-mapper';
import {
  ProjectNotFoundException,
  ProjectPermissionDeniedException,
} from '../exceptions/project.exceptions';

@Resolver('Mutation')
@UseGuards(AuthGuard)
export class ProjectMutationResolver {
  constructor(private readonly projectService: ProjectService) { }

  @Mutation()
  async createProject(
    @Args('input') input: ProjectCreateInput,
    @CurrentUser() userId: string,
  ): Promise<ProjectResponse> {
    try {
      const project = await this.projectService.createProject(input, userId);
      return {
        data: ProjectDTOMapper.toGraphQL(project),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof ProjectPermissionDeniedException
            ? error.message
            : error.message || 'Failed to create project',
          code: error instanceof ProjectPermissionDeniedException
            ? ErrorCode.FORBIDDEN
            : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async updateProject(
    @Args('input') input: ProjectUpdateInput,
    @CurrentUser() userId: string,
  ): Promise<ProjectResponse> {
    try {
      const project = await this.projectService.updateProject(input, userId);
      return {
        data: ProjectDTOMapper.toGraphQL(project),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof ProjectNotFoundException
            ? 'Project not found'
            : error instanceof ProjectPermissionDeniedException
              ? error.message
              : error.message || 'Failed to update project',
          code: error instanceof ProjectNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof ProjectPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Mutation()
  async deleteProject(
    @Args('input') input: ProjectDeleteInput,
    @CurrentUser() userId: string,
  ): Promise<ProjectResponse> {
    try {
      const project = await this.projectService.deleteProject(input.id, userId);
      return {
        data: ProjectDTOMapper.toGraphQL(project),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof ProjectNotFoundException
            ? 'Project not found'
            : error instanceof ProjectPermissionDeniedException
              ? error.message
              : error.message || 'Failed to delete project',
          code: error instanceof ProjectNotFoundException
            ? ErrorCode.NOT_FOUND
            : error instanceof ProjectPermissionDeniedException
              ? ErrorCode.FORBIDDEN
              : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 