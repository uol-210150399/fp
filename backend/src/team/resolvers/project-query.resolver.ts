import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { AuthGuard } from '../../auth/auth.guard';
import {
  ErrorCode,
  PaginationInput,
  ProjectResponse,
  ProjectsFilterInput,
  ProjectsResponse,
} from '../../generated/graphql';
import { ProjectNotFoundException } from '../exceptions/project.exceptions';
import { ProjectDTOMapper } from '../dtos/project-dto-mapper';

@Resolver('Query')
@UseGuards(AuthGuard)
export class ProjectQueryResolver {
  constructor(private readonly projectService: ProjectService) { }

  @Query()
  async project(@Args('id') id: string): Promise<ProjectResponse> {
    try {
      const project = await this.projectService.getProject(id);
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
            : error.message || 'Failed to get project',
          code: error instanceof ProjectNotFoundException
            ? ErrorCode.NOT_FOUND
            : ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }

  @Query()
  async projects(
    @Args('pagination') pagination?: PaginationInput,
    @Args('filter') filter?: ProjectsFilterInput,
  ): Promise<ProjectsResponse> {
    try {
      const { projects, hasNextPage } = await this.projectService.listProjects({
        pagination: {
          first: pagination?.first || 10,
          after: pagination?.after,
        },
        filter,
      });

      return {
        data: {
          edges: projects.map(project => ({
            cursor: project.id,
            node: ProjectDTOMapper.toGraphQL(project),
          })),
          pageInfo: {
            hasNextPage,
            endCursor: projects.length > 0 ? projects[projects.length - 1].id : null,
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
          message: error.message || 'Failed to list projects',
          code: ErrorCode.INTERNAL_ERROR,
        },
      };
    }
  }
} 