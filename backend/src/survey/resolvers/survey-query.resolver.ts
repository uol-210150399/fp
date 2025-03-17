// import { Args, Resolver, ResolveField } from '@nestjs/graphql';
// import {
//   ErrorCode,
//   SurveyGetInput,
//   SurveyGetOutput,
//   SurveyListInput,
//   SurveyListOutput,
// } from '../../generated/graphql';
// import { SurveyService } from '../survey.service';

// @Resolver('SurveyQuery')
// export class SurveyQueryResolver {
//   constructor(private surveyService: SurveyService) { }

//   @ResolveField()
//   async get(@Args('input') input: SurveyGetInput): Promise<SurveyGetOutput> {
//     try {
//       const survey = await this.surveyService.get(input.id);
//       return {
//         __typename: 'SurveyGetSuccess',
//         survey: {
//           id: survey.surveyId,
//           title: survey.title,
//           isDeleted: survey.isDeletedFlag,
//           createdAt: survey.createdAt,
//           updatedAt: survey.updatedAt,
//         },
//       };
//     } catch (error) {
//       return {
//         __typename: 'SurveyGetFailure',
//         error: {
//           code: ErrorCode.INTERNAL_ERROR,
//           message: error.message || 'Failed to get survey',
//         },
//       };
//     }
//   }

//   @ResolveField()
//   async list(@Args('input') input: SurveyListInput): Promise<SurveyListOutput> {
//     try {
//       const surveys = await this.surveyService.list(input.filter.projectId);
//       if (surveys.length === 0) {
//         return {
//           __typename: 'SurveyListSuccess',
//           surveys: {
//             edges: [],
//             pageInfo: {
//               hasNextPage: false,
//             },
//           },
//         };
//       }

//       return {
//         __typename: 'SurveyListSuccess',
//         surveys: {
//           edges: surveys.map((survey) => ({
//             cursor: survey.surveyId,
//             node: {
//               id: survey.surveyId,
//               title: survey.title,
//               isDeleted: survey.isDeletedFlag,
//               createdAt: survey.createdAt,
//               updatedAt: survey.updatedAt,
//             },
//           })),
//           pageInfo: {
//             endCursor: surveys[surveys.length - 1].surveyId,
//             hasNextPage: false,
//           },
//         },
//       };
//     } catch (error) {
//       return {
//         __typename: 'SurveyListFailure',
//         error: {
//           code: ErrorCode.INTERNAL_ERROR,
//           message: error.message || 'Failed to list surveys',
//         },
//       };
//     }
//   }
// }
