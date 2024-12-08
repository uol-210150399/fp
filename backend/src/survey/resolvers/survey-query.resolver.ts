import { Args, Resolver, ResolveField } from '@nestjs/graphql';
import {
  SurveyGetInput,
  SurveyGetOutput,
  SurveyListInput,
  SurveyListOutput,
  QuestionType,
  SurveyStatus,
} from '../../generated/graphql';

@Resolver('SurveyQuery')
export class SurveyQueryResolver {
  @ResolveField()
  async get(@Args('input') input: SurveyGetInput): Promise<SurveyGetOutput> {
    try {
      return {
        __typename: 'SurveyGetSuccess',
        survey: {
          id: input.id,
          title: 'Sample Survey',
          description: 'A sample survey description',
          status: SurveyStatus.DRAFT,
          questions: [
            {
              id: '1',
              text: 'What is your age?',
              type: QuestionType.TEXT,
              required: true,
              options: null,
            },
            {
              id: '2',
              text: 'How satisfied are you with our service?',
              type: QuestionType.RATING,
              required: true,
              options: ['1', '2', '3', '4', '5'],
            },
          ],
          project: {
            id: '1',
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
            surveys: [],
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: null,
        },
      };
    } catch (error) {
      return {
        __typename: 'SurveyGetFailure',
        error: {
          message: error.message || 'Failed to get survey',
        },
      };
    }
  }

  @ResolveField()
  async list(@Args('input') input: SurveyListInput): Promise<SurveyListOutput> {
    try {
      return {
        __typename: 'SurveyListSuccess',
        surveys: {
          edges: [
            {
              cursor: '1',
              node: {
                id: '1',
                title: 'Sample Survey',
                description: 'A sample survey description',
                status: input.filter?.status || SurveyStatus.DRAFT,
                questions: [
                  {
                    id: '1',
                    text: 'What is your age?',
                    type: QuestionType.TEXT,
                    required: true,
                    options: null,
                  },
                ],
                project: {
                  id: input.filter?.projectId || '1',
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
                  surveys: [],
                  isDeleted: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                isDeleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: null,
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
        __typename: 'SurveyListFailure',
        error: {
          message: error.message || 'Failed to list surveys',
        },
      };
    }
  }
}
