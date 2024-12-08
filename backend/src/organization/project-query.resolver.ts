import { Args, Resolver, ResolveField } from '@nestjs/graphql';
import {
  ProjectGetInput,
  ProjectGetOutput,
  ProjectListInput,
  ProjectListOutput,
} from '../generated/graphql';

@Resolver('ProjectQuery')
export class ProjectQueryResolver {
  @ResolveField()
  async get(@Args('input') input: ProjectGetInput): Promise<ProjectGetOutput> {
    try {
      return {
        __typename: 'ProjectGetSuccess',
        project: {
          id: input.id,
          name: 'Sample Project',
          description: 'A sample project',
          team: {
            id: '1',
            name: 'Sample Team',
            description: 'A sample team',
            users: [],
            projects: [],
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        __typename: 'ProjectGetFailure',
        error: {
          message: error.message || 'Failed to get project',
        },
      };
    }
  }

  @ResolveField()
  async list(@Args('input') input: ProjectListInput): Promise<ProjectListOutput> {
    try {
      return {
        __typename: 'ProjectListSuccess',
        projects: {
          edges: [
            {
              cursor: '1',
              node: {
                id: '1',
                name: 'Sample Project',
                description: 'A sample project',
                team: {
                  id: input.filter?.teamId || '1',
                  name: 'Sample Team',
                  description: 'A sample team',
                  users: [],
                  projects: [],
                  isDeleted: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                isDeleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          ],
          pageInfo: {
            endCursor: '1',
            hasNextPage: false,
          },
        },
      };
    } catch (error) {
      return {
        __typename: 'ProjectListFailure',
        error: {
          message: error.message || 'Failed to list projects',
        },
      };
    }
  }
}
