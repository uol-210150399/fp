import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type Checkpoint = {
  __typename?: 'Checkpoint';
  condition: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  target: CheckpointTarget;
  type: SurveyFieldTypeEnum;
};

export type CheckpointTarget = {
  __typename?: 'CheckpointTarget';
  type: TargetType;
  value?: Maybe<Scalars['String']['output']>;
};

export type Choice = {
  __typename?: 'Choice';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
};

export type Edge = {
  cursor: Scalars['String']['output'];
  node: Node;
};

/** Common error handling */
export type Error = {
  __typename?: 'Error';
  code: ErrorCode;
  message: Scalars['String']['output'];
};

export enum ErrorCode {
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export type InviteRespondentInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  surveyId: Scalars['ID']['input'];
};

export type MatrixQuestion = {
  __typename?: 'MatrixQuestion';
  allowMultiplePerRow: Scalars['Boolean']['output'];
  columns: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  rows: Array<Scalars['String']['output']>;
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
};

export type MultipleChoiceQuestion = {
  __typename?: 'MultipleChoiceQuestion';
  allowMultiple?: Maybe<Scalars['Boolean']['output']>;
  choices: Array<Choice>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  randomize?: Maybe<Scalars['Boolean']['output']>;
  required: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Project Operations */
  createProject: ProjectResponse;
  /** Survey Operations */
  createSurvey: SurveyResponse;
  /** Team Operations */
  createTeam: TeamResponse;
  /** Team Member Operations */
  createTeamMember: TeamMemberResponse;
  deleteProject: ProjectResponse;
  deleteSurvey: SurveyResponse;
  deleteTeam: TeamResponse;
  deleteTeamMember: TeamMemberResponse;
  inviteRespondent: SurveySessionResponse;
  publishSurvey: SurveyResponse;
  startSurveySession: StartSurveySessionResponse;
  submitSurveySessionAnswer: SubmitSurveySessionAnswerResponse;
  updateProject: ProjectResponse;
  updateSurvey: SurveyResponse;
  updateSurveyForm: SurveyFormOperationResponse;
  updateSurveySectionsBulk: SurveyResponse;
  updateTeam: TeamResponse;
  updateTeamMember: TeamMemberResponse;
};


export type MutationcreateProjectArgs = {
  input: ProjectCreateInput;
};


export type MutationcreateSurveyArgs = {
  input: SurveyCreateInput;
};


export type MutationcreateTeamArgs = {
  input: TeamCreateInput;
};


export type MutationcreateTeamMemberArgs = {
  input: TeamMemberCreateInput;
};


export type MutationdeleteProjectArgs = {
  input: ProjectDeleteInput;
};


export type MutationdeleteSurveyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteTeamArgs = {
  input: TeamDeleteInput;
};


export type MutationdeleteTeamMemberArgs = {
  input: TeamMemberDeleteInput;
};


export type MutationinviteRespondentArgs = {
  input: InviteRespondentInput;
};


export type MutationpublishSurveyArgs = {
  input: SurveyPublishInput;
};


export type MutationstartSurveySessionArgs = {
  input: StartSurveySessionInput;
};


export type MutationsubmitSurveySessionAnswerArgs = {
  input: SubmitSurveySessionAnswerInput;
};


export type MutationupdateProjectArgs = {
  input: ProjectUpdateInput;
};


export type MutationupdateSurveyArgs = {
  input: SurveyUpdateInput;
};


export type MutationupdateSurveyFormArgs = {
  input: SurveyFormOperationInput;
};


export type MutationupdateSurveySectionsBulkArgs = {
  input: SurveySectionBulkCreateInput;
};


export type MutationupdateTeamArgs = {
  input: TeamUpdateInput;
};


export type MutationupdateTeamMemberArgs = {
  input: TeamMemberUpdateInput;
};

/** Common interfaces */
export type Node = {
  id: Scalars['ID']['output'];
};

export type NumberQuestion = {
  __typename?: 'NumberQuestion';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
  unit?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

/** Common input types */
export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};

/** Project Types */
export type Project = Node & {
  __typename?: 'Project';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ProjectConnection = Connection & {
  __typename?: 'ProjectConnection';
  edges: Array<ProjectEdge>;
  pageInfo: PageInfo;
};

export type ProjectCreateInput = {
  name: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};

export type ProjectDeleteInput = {
  id: Scalars['ID']['input'];
};

export type ProjectEdge = Edge & {
  __typename?: 'ProjectEdge';
  cursor: Scalars['String']['output'];
  node: Project;
};

/** Project Operation Outputs */
export type ProjectResponse = {
  __typename?: 'ProjectResponse';
  data?: Maybe<Project>;
  error?: Maybe<Error>;
};

export type ProjectUpdateInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Project Inputs */
export type ProjectsFilterInput = {
  teamId: Scalars['String']['input'];
};

export type ProjectsResponse = {
  __typename?: 'ProjectsResponse';
  data: ProjectConnection;
  error?: Maybe<Error>;
};

export type Query = {
  __typename?: 'Query';
  listSurveyRespondents: Array<SurveySession>;
  /** Project Operations */
  project: ProjectResponse;
  projects: ProjectsResponse;
  /** Survey Operations */
  survey: SurveyResponse;
  surveys: SurveysResponse;
  /** Team Operations */
  team: TeamResponse;
  teams: TeamsResponse;
  /** User Operations */
  users: UsersResponse;
};


export type QuerylistSurveyRespondentsArgs = {
  surveyId: Scalars['ID']['input'];
};


export type QueryprojectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryprojectsArgs = {
  filter?: InputMaybe<ProjectsFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QuerysurveyArgs = {
  id: Scalars['ID']['input'];
};


export type QuerysurveysArgs = {
  filter?: InputMaybe<SurveysFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryteamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryteamsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryusersArgs = {
  filter?: InputMaybe<UsersFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type RankingQuestion = {
  __typename?: 'RankingQuestion';
  choices: Array<Choice>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  randomize?: Maybe<Scalars['Boolean']['output']>;
  required: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
};

export type RatingQuestion = {
  __typename?: 'RatingQuestion';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  labels: Array<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  startAtOne?: Maybe<Scalars['Boolean']['output']>;
  steps?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
};

export type RespondentData = {
  __typename?: 'RespondentData';
  email?: Maybe<Scalars['String']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export enum SessionStatus {
  COMPLETED = 'COMPLETED',
  ENDED = 'ENDED',
  IN_PROGRESS = 'IN_PROGRESS',
  STARTED = 'STARTED'
}

export type StartSurveySessionInput = {
  sessionId?: InputMaybe<Scalars['String']['input']>;
  surveyKey: Scalars['String']['input'];
};

export type StartSurveySessionResponse = {
  __typename?: 'StartSurveySessionResponse';
  error?: Maybe<Error>;
  nextQuestion?: Maybe<Scalars['JSON']['output']>;
  status: SessionStatus;
};

export type StatementField = {
  __typename?: 'StatementField';
  buttonText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  textSize?: Maybe<TextSize>;
  type: SurveyFieldTypeEnum;
};

export type SubmitSurveySessionAnswerInput = {
  answer: Scalars['JSON']['input'];
  questionId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};

export type SubmitSurveySessionAnswerResponse = {
  __typename?: 'SubmitSurveySessionAnswerResponse';
  error?: Maybe<Error>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  nextQuestion?: Maybe<Scalars['JSON']['output']>;
};

export type Survey = Node & {
  __typename?: 'Survey';
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  form?: Maybe<SurveyForm>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  projectId: Scalars['ID']['output'];
  status: SurveyStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type SurveyConnection = Connection & {
  __typename?: 'SurveyConnection';
  edges: Array<SurveyEdge>;
  pageInfo: PageInfo;
};

/** Input Types */
export type SurveyCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type SurveyEdge = Edge & {
  __typename?: 'SurveyEdge';
  cursor: Scalars['String']['output'];
  node: Survey;
};

export type SurveyFieldResponse = {
  __typename?: 'SurveyFieldResponse';
  data?: Maybe<Scalars['JSON']['output']>;
  error?: Maybe<Error>;
};

export enum SurveyFieldTypeEnum {
  Checkpoint = 'Checkpoint',
  MatrixQuestion = 'MatrixQuestion',
  MultipleChoiceQuestion = 'MultipleChoiceQuestion',
  NumberQuestion = 'NumberQuestion',
  RankingQuestion = 'RankingQuestion',
  RatingQuestion = 'RatingQuestion',
  StatementField = 'StatementField',
  TextQuestion = 'TextQuestion'
}

export type SurveyForm = {
  __typename?: 'SurveyForm';
  context?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  sections: Array<SurveySection>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  welcomeMessage?: Maybe<Scalars['String']['output']>;
};

/** Generic Form Operation Input */
export type SurveyFormOperationInput = {
  data: Scalars['JSON']['input'];
  formId: Scalars['ID']['input'];
  operation: SurveyFormOperationType;
};

/** Generic Form Operation Response */
export type SurveyFormOperationResponse = {
  __typename?: 'SurveyFormOperationResponse';
  data: Survey;
  error?: Maybe<Error>;
};

/** Form Operation Types */
export enum SurveyFormOperationType {
  ADD_FIELD = 'ADD_FIELD',
  ADD_SECTION = 'ADD_SECTION',
  DELETE_FIELD = 'DELETE_FIELD',
  DELETE_SECTION = 'DELETE_SECTION',
  MOVE_FIELD_IN_SECTION = 'MOVE_FIELD_IN_SECTION',
  MOVE_SECTION = 'MOVE_SECTION',
  UPDATE_FIELD = 'UPDATE_FIELD',
  UPDATE_SECTION = 'UPDATE_SECTION'
}

export type SurveyFormUpdateInput = {
  context?: InputMaybe<Scalars['String']['input']>;
  sections: Array<SurveySectionInput>;
  surveyId: Scalars['ID']['input'];
};

export type SurveyPublishInput = {
  id: Scalars['ID']['input'];
};

export type SurveyQuestion = MatrixQuestion | MultipleChoiceQuestion | NumberQuestion | RankingQuestion | RatingQuestion | StatementField | TextQuestion;

/** Survey Operation Outputs */
export type SurveyResponse = {
  __typename?: 'SurveyResponse';
  data?: Maybe<Survey>;
  error?: Maybe<Error>;
};

export type SurveySection = {
  __typename?: 'SurveySection';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type SurveySectionBulkCreateInput = {
  sections: Array<SurveySectionInput>;
  surveyId: Scalars['ID']['input'];
};

export type SurveySectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  fields: Array<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

/** Form Operation Responses */
export type SurveySectionResponse = {
  __typename?: 'SurveySectionResponse';
  data?: Maybe<SurveySection>;
  error?: Maybe<Error>;
};

/** Survey Session Types */
export type SurveySession = Node & {
  __typename?: 'SurveySession';
  completedAt?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lastActivityAt: Scalars['Date']['output'];
  respondentData: RespondentData;
  startedAt: Scalars['Date']['output'];
  state: Scalars['JSON']['output'];
  surveyId: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type SurveySessionConnection = Connection & {
  __typename?: 'SurveySessionConnection';
  edges: Array<SurveySessionEdge>;
  pageInfo: PageInfo;
};

export type SurveySessionEdge = Edge & {
  __typename?: 'SurveySessionEdge';
  cursor: Scalars['String']['output'];
  node: SurveySession;
};

export type SurveySessionResponse = {
  __typename?: 'SurveySessionResponse';
  data?: Maybe<SurveySession>;
  error?: Maybe<Error>;
};

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export type SurveyUpdateInput = {
  context?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  welcomeMessage?: InputMaybe<Scalars['String']['input']>;
};

export type SurveysFilterInput = {
  projectId?: InputMaybe<Scalars['ID']['input']>;
};

export type SurveysResponse = {
  __typename?: 'SurveysResponse';
  data: SurveyConnection;
  error?: Maybe<Error>;
};

export enum TargetType {
  END = 'END',
  SKIP_TO_QUESTION = 'SKIP_TO_QUESTION',
  SKIP_TO_SECTION = 'SKIP_TO_SECTION'
}

/** Team Types */
export type Team = Node & {
  __typename?: 'Team';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  members: Array<TeamMember>;
  name: Scalars['String']['output'];
  projects: Array<Project>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type TeamConnection = Connection & {
  __typename?: 'TeamConnection';
  edges: Array<TeamEdge>;
  pageInfo: PageInfo;
};

/** Team Inputs */
export type TeamCreateInput = {
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type TeamDeleteInput = {
  id: Scalars['ID']['input'];
};

export type TeamEdge = Edge & {
  __typename?: 'TeamEdge';
  cursor: Scalars['String']['output'];
  node: Team;
};

/** Team Member Types */
export type TeamMember = Node & {
  __typename?: 'TeamMember';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  role: TeamMemberRole;
  teamId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userId: Scalars['String']['output'];
};

export type TeamMemberConnection = Connection & {
  __typename?: 'TeamMemberConnection';
  edges: Array<TeamMemberEdge>;
  pageInfo: PageInfo;
};

export type TeamMemberCreateInput = {
  role: TeamMemberRole;
  teamId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type TeamMemberDeleteInput = {
  id: Scalars['ID']['input'];
};

export type TeamMemberEdge = Edge & {
  __typename?: 'TeamMemberEdge';
  cursor: Scalars['String']['output'];
  node: TeamMember;
};

/** Team Member Operation Outputs */
export type TeamMemberResponse = {
  __typename?: 'TeamMemberResponse';
  data?: Maybe<TeamMember>;
  error?: Maybe<Error>;
};

export enum TeamMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  OWNER = 'OWNER'
}

export type TeamMemberUpdateInput = {
  id: Scalars['ID']['input'];
  role?: InputMaybe<TeamMemberRole>;
};

/** Team Member Inputs */
export type TeamMembersFilterInput = {
  teamId: Scalars['ID']['input'];
};

export type TeamMembersResponse = {
  __typename?: 'TeamMembersResponse';
  data: TeamMemberConnection;
  error?: Maybe<Error>;
};

/** Team Operation Outputs */
export type TeamResponse = {
  __typename?: 'TeamResponse';
  data?: Maybe<Team>;
  error?: Maybe<Error>;
};

export type TeamUpdateInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TeamsResponse = {
  __typename?: 'TeamsResponse';
  data: TeamConnection;
  error?: Maybe<Error>;
};

/** Question Types */
export type TextQuestion = {
  __typename?: 'TextQuestion';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instructions?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  type: SurveyFieldTypeEnum;
};

/** Enums */
export enum TextSize {
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL'
}

/** User Types */
export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UserConnection = Connection & {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = Edge & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

/** User Operation Outputs */
export type UserResponse = {
  __typename?: 'UserResponse';
  data?: Maybe<User>;
  error?: Maybe<Error>;
};

/** User Inputs */
export type UsersFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  data: UserConnection;
  error?: Maybe<Error>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  SurveyQuestion: (MatrixQuestion) | (MultipleChoiceQuestion) | (NumberQuestion) | (RankingQuestion) | (RatingQuestion) | (StatementField) | (TextQuestion);
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Connection: (ProjectConnection) | (SurveyConnection) | (SurveySessionConnection) | (TeamConnection) | (TeamMemberConnection) | (UserConnection);
  Edge: (ProjectEdge) | (SurveyEdge) | (SurveySessionEdge) | (TeamEdge) | (TeamMemberEdge) | (UserEdge);
  Node: (Project) | (Survey) | (SurveySession) | (Team) | (TeamMember) | (User);
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Checkpoint: ResolverTypeWrapper<Checkpoint>;
  CheckpointTarget: ResolverTypeWrapper<CheckpointTarget>;
  Choice: ResolverTypeWrapper<Choice>;
  Connection: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Connection']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Edge: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Edge']>;
  Error: ResolverTypeWrapper<Error>;
  ErrorCode: ErrorCode;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InviteRespondentInput: InviteRespondentInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  MatrixQuestion: ResolverTypeWrapper<MatrixQuestion>;
  MultipleChoiceQuestion: ResolverTypeWrapper<MultipleChoiceQuestion>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NumberQuestion: ResolverTypeWrapper<NumberQuestion>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  Project: ResolverTypeWrapper<Project>;
  ProjectConnection: ResolverTypeWrapper<ProjectConnection>;
  ProjectCreateInput: ProjectCreateInput;
  ProjectDeleteInput: ProjectDeleteInput;
  ProjectEdge: ResolverTypeWrapper<ProjectEdge>;
  ProjectResponse: ResolverTypeWrapper<ProjectResponse>;
  ProjectUpdateInput: ProjectUpdateInput;
  ProjectsFilterInput: ProjectsFilterInput;
  ProjectsResponse: ResolverTypeWrapper<ProjectsResponse>;
  Query: ResolverTypeWrapper<{}>;
  RankingQuestion: ResolverTypeWrapper<RankingQuestion>;
  RatingQuestion: ResolverTypeWrapper<RatingQuestion>;
  RespondentData: ResolverTypeWrapper<RespondentData>;
  SessionStatus: SessionStatus;
  StartSurveySessionInput: StartSurveySessionInput;
  StartSurveySessionResponse: ResolverTypeWrapper<StartSurveySessionResponse>;
  StatementField: ResolverTypeWrapper<StatementField>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitSurveySessionAnswerInput: SubmitSurveySessionAnswerInput;
  SubmitSurveySessionAnswerResponse: ResolverTypeWrapper<SubmitSurveySessionAnswerResponse>;
  Survey: ResolverTypeWrapper<Survey>;
  SurveyConnection: ResolverTypeWrapper<SurveyConnection>;
  SurveyCreateInput: SurveyCreateInput;
  SurveyEdge: ResolverTypeWrapper<SurveyEdge>;
  SurveyFieldResponse: ResolverTypeWrapper<SurveyFieldResponse>;
  SurveyFieldTypeEnum: SurveyFieldTypeEnum;
  SurveyForm: ResolverTypeWrapper<SurveyForm>;
  SurveyFormOperationInput: SurveyFormOperationInput;
  SurveyFormOperationResponse: ResolverTypeWrapper<SurveyFormOperationResponse>;
  SurveyFormOperationType: SurveyFormOperationType;
  SurveyFormUpdateInput: SurveyFormUpdateInput;
  SurveyPublishInput: SurveyPublishInput;
  SurveyQuestion: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SurveyQuestion']>;
  SurveyResponse: ResolverTypeWrapper<SurveyResponse>;
  SurveySection: ResolverTypeWrapper<SurveySection>;
  SurveySectionBulkCreateInput: SurveySectionBulkCreateInput;
  SurveySectionInput: SurveySectionInput;
  SurveySectionResponse: ResolverTypeWrapper<SurveySectionResponse>;
  SurveySession: ResolverTypeWrapper<SurveySession>;
  SurveySessionConnection: ResolverTypeWrapper<SurveySessionConnection>;
  SurveySessionEdge: ResolverTypeWrapper<SurveySessionEdge>;
  SurveySessionResponse: ResolverTypeWrapper<SurveySessionResponse>;
  SurveyStatus: SurveyStatus;
  SurveyUpdateInput: SurveyUpdateInput;
  SurveysFilterInput: SurveysFilterInput;
  SurveysResponse: ResolverTypeWrapper<SurveysResponse>;
  TargetType: TargetType;
  Team: ResolverTypeWrapper<Team>;
  TeamConnection: ResolverTypeWrapper<TeamConnection>;
  TeamCreateInput: TeamCreateInput;
  TeamDeleteInput: TeamDeleteInput;
  TeamEdge: ResolverTypeWrapper<TeamEdge>;
  TeamMember: ResolverTypeWrapper<TeamMember>;
  TeamMemberConnection: ResolverTypeWrapper<TeamMemberConnection>;
  TeamMemberCreateInput: TeamMemberCreateInput;
  TeamMemberDeleteInput: TeamMemberDeleteInput;
  TeamMemberEdge: ResolverTypeWrapper<TeamMemberEdge>;
  TeamMemberResponse: ResolverTypeWrapper<TeamMemberResponse>;
  TeamMemberRole: TeamMemberRole;
  TeamMemberUpdateInput: TeamMemberUpdateInput;
  TeamMembersFilterInput: TeamMembersFilterInput;
  TeamMembersResponse: ResolverTypeWrapper<TeamMembersResponse>;
  TeamResponse: ResolverTypeWrapper<TeamResponse>;
  TeamUpdateInput: TeamUpdateInput;
  TeamsResponse: ResolverTypeWrapper<TeamsResponse>;
  TextQuestion: ResolverTypeWrapper<TextQuestion>;
  TextSize: TextSize;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  UsersFilterInput: UsersFilterInput;
  UsersResponse: ResolverTypeWrapper<UsersResponse>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Checkpoint: Checkpoint;
  CheckpointTarget: CheckpointTarget;
  Choice: Choice;
  Connection: ResolversInterfaceTypes<ResolversParentTypes>['Connection'];
  Date: Scalars['Date']['output'];
  Edge: ResolversInterfaceTypes<ResolversParentTypes>['Edge'];
  Error: Error;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InviteRespondentInput: InviteRespondentInput;
  JSON: Scalars['JSON']['output'];
  MatrixQuestion: MatrixQuestion;
  MultipleChoiceQuestion: MultipleChoiceQuestion;
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NumberQuestion: NumberQuestion;
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  Project: Project;
  ProjectConnection: ProjectConnection;
  ProjectCreateInput: ProjectCreateInput;
  ProjectDeleteInput: ProjectDeleteInput;
  ProjectEdge: ProjectEdge;
  ProjectResponse: ProjectResponse;
  ProjectUpdateInput: ProjectUpdateInput;
  ProjectsFilterInput: ProjectsFilterInput;
  ProjectsResponse: ProjectsResponse;
  Query: {};
  RankingQuestion: RankingQuestion;
  RatingQuestion: RatingQuestion;
  RespondentData: RespondentData;
  StartSurveySessionInput: StartSurveySessionInput;
  StartSurveySessionResponse: StartSurveySessionResponse;
  StatementField: StatementField;
  String: Scalars['String']['output'];
  SubmitSurveySessionAnswerInput: SubmitSurveySessionAnswerInput;
  SubmitSurveySessionAnswerResponse: SubmitSurveySessionAnswerResponse;
  Survey: Survey;
  SurveyConnection: SurveyConnection;
  SurveyCreateInput: SurveyCreateInput;
  SurveyEdge: SurveyEdge;
  SurveyFieldResponse: SurveyFieldResponse;
  SurveyForm: SurveyForm;
  SurveyFormOperationInput: SurveyFormOperationInput;
  SurveyFormOperationResponse: SurveyFormOperationResponse;
  SurveyFormUpdateInput: SurveyFormUpdateInput;
  SurveyPublishInput: SurveyPublishInput;
  SurveyQuestion: ResolversUnionTypes<ResolversParentTypes>['SurveyQuestion'];
  SurveyResponse: SurveyResponse;
  SurveySection: SurveySection;
  SurveySectionBulkCreateInput: SurveySectionBulkCreateInput;
  SurveySectionInput: SurveySectionInput;
  SurveySectionResponse: SurveySectionResponse;
  SurveySession: SurveySession;
  SurveySessionConnection: SurveySessionConnection;
  SurveySessionEdge: SurveySessionEdge;
  SurveySessionResponse: SurveySessionResponse;
  SurveyUpdateInput: SurveyUpdateInput;
  SurveysFilterInput: SurveysFilterInput;
  SurveysResponse: SurveysResponse;
  Team: Team;
  TeamConnection: TeamConnection;
  TeamCreateInput: TeamCreateInput;
  TeamDeleteInput: TeamDeleteInput;
  TeamEdge: TeamEdge;
  TeamMember: TeamMember;
  TeamMemberConnection: TeamMemberConnection;
  TeamMemberCreateInput: TeamMemberCreateInput;
  TeamMemberDeleteInput: TeamMemberDeleteInput;
  TeamMemberEdge: TeamMemberEdge;
  TeamMemberResponse: TeamMemberResponse;
  TeamMemberUpdateInput: TeamMemberUpdateInput;
  TeamMembersFilterInput: TeamMembersFilterInput;
  TeamMembersResponse: TeamMembersResponse;
  TeamResponse: TeamResponse;
  TeamUpdateInput: TeamUpdateInput;
  TeamsResponse: TeamsResponse;
  TextQuestion: TextQuestion;
  UUID: Scalars['UUID']['output'];
  User: User;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserResponse: UserResponse;
  UsersFilterInput: UsersFilterInput;
  UsersResponse: UsersResponse;
};

export type CheckpointResolvers<ContextType = any, ParentType extends ResolversParentTypes['Checkpoint'] = ResolversParentTypes['Checkpoint']> = {
  condition?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['CheckpointTarget'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckpointTargetResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckpointTarget'] = ResolversParentTypes['CheckpointTarget']> = {
  type?: Resolver<ResolversTypes['TargetType'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Choice'] = ResolversParentTypes['Choice']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Connection'] = ResolversParentTypes['Connection']> = {
  __resolveType: TypeResolveFn<'ProjectConnection' | 'SurveyConnection' | 'SurveySessionConnection' | 'TeamConnection' | 'TeamMemberConnection' | 'UserConnection', ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['Edge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'ProjectEdge' | 'SurveyEdge' | 'SurveySessionEdge' | 'TeamEdge' | 'TeamMemberEdge' | 'UserEdge', ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  code?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MatrixQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MatrixQuestion'] = ResolversParentTypes['MatrixQuestion']> = {
  allowMultiplePerRow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  columns?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rows?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MultipleChoiceQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MultipleChoiceQuestion'] = ResolversParentTypes['MultipleChoiceQuestion']> = {
  allowMultiple?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  choices?: Resolver<Array<ResolversTypes['Choice']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  randomize?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProject?: Resolver<ResolversTypes['ProjectResponse'], ParentType, ContextType, RequireFields<MutationcreateProjectArgs, 'input'>>;
  createSurvey?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<MutationcreateSurveyArgs, 'input'>>;
  createTeam?: Resolver<ResolversTypes['TeamResponse'], ParentType, ContextType, RequireFields<MutationcreateTeamArgs, 'input'>>;
  createTeamMember?: Resolver<ResolversTypes['TeamMemberResponse'], ParentType, ContextType, RequireFields<MutationcreateTeamMemberArgs, 'input'>>;
  deleteProject?: Resolver<ResolversTypes['ProjectResponse'], ParentType, ContextType, RequireFields<MutationdeleteProjectArgs, 'input'>>;
  deleteSurvey?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<MutationdeleteSurveyArgs, 'id'>>;
  deleteTeam?: Resolver<ResolversTypes['TeamResponse'], ParentType, ContextType, RequireFields<MutationdeleteTeamArgs, 'input'>>;
  deleteTeamMember?: Resolver<ResolversTypes['TeamMemberResponse'], ParentType, ContextType, RequireFields<MutationdeleteTeamMemberArgs, 'input'>>;
  inviteRespondent?: Resolver<ResolversTypes['SurveySessionResponse'], ParentType, ContextType, RequireFields<MutationinviteRespondentArgs, 'input'>>;
  publishSurvey?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<MutationpublishSurveyArgs, 'input'>>;
  startSurveySession?: Resolver<ResolversTypes['StartSurveySessionResponse'], ParentType, ContextType, RequireFields<MutationstartSurveySessionArgs, 'input'>>;
  submitSurveySessionAnswer?: Resolver<ResolversTypes['SubmitSurveySessionAnswerResponse'], ParentType, ContextType, RequireFields<MutationsubmitSurveySessionAnswerArgs, 'input'>>;
  updateProject?: Resolver<ResolversTypes['ProjectResponse'], ParentType, ContextType, RequireFields<MutationupdateProjectArgs, 'input'>>;
  updateSurvey?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<MutationupdateSurveyArgs, 'input'>>;
  updateSurveyForm?: Resolver<ResolversTypes['SurveyFormOperationResponse'], ParentType, ContextType, RequireFields<MutationupdateSurveyFormArgs, 'input'>>;
  updateSurveySectionsBulk?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<MutationupdateSurveySectionsBulkArgs, 'input'>>;
  updateTeam?: Resolver<ResolversTypes['TeamResponse'], ParentType, ContextType, RequireFields<MutationupdateTeamArgs, 'input'>>;
  updateTeamMember?: Resolver<ResolversTypes['TeamMemberResponse'], ParentType, ContextType, RequireFields<MutationupdateTeamMemberArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Project' | 'Survey' | 'SurveySession' | 'Team' | 'TeamMember' | 'User', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NumberQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NumberQuestion'] = ResolversParentTypes['NumberQuestion']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectConnection'] = ResolversParentTypes['ProjectConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ProjectEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectEdge'] = ResolversParentTypes['ProjectEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectResponse'] = ResolversParentTypes['ProjectResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectsResponse'] = ResolversParentTypes['ProjectsResponse']> = {
  data?: Resolver<ResolversTypes['ProjectConnection'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  listSurveyRespondents?: Resolver<Array<ResolversTypes['SurveySession']>, ParentType, ContextType, RequireFields<QuerylistSurveyRespondentsArgs, 'surveyId'>>;
  project?: Resolver<ResolversTypes['ProjectResponse'], ParentType, ContextType, RequireFields<QueryprojectArgs, 'id'>>;
  projects?: Resolver<ResolversTypes['ProjectsResponse'], ParentType, ContextType, Partial<QueryprojectsArgs>>;
  survey?: Resolver<ResolversTypes['SurveyResponse'], ParentType, ContextType, RequireFields<QuerysurveyArgs, 'id'>>;
  surveys?: Resolver<ResolversTypes['SurveysResponse'], ParentType, ContextType, Partial<QuerysurveysArgs>>;
  team?: Resolver<ResolversTypes['TeamResponse'], ParentType, ContextType, RequireFields<QueryteamArgs, 'id'>>;
  teams?: Resolver<ResolversTypes['TeamsResponse'], ParentType, ContextType, Partial<QueryteamsArgs>>;
  users?: Resolver<ResolversTypes['UsersResponse'], ParentType, ContextType, Partial<QueryusersArgs>>;
};

export type RankingQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RankingQuestion'] = ResolversParentTypes['RankingQuestion']> = {
  choices?: Resolver<Array<ResolversTypes['Choice']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  randomize?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RatingQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RatingQuestion'] = ResolversParentTypes['RatingQuestion']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startAtOne?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  steps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RespondentDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['RespondentData'] = ResolversParentTypes['RespondentData']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StartSurveySessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['StartSurveySessionResponse'] = ResolversParentTypes['StartSurveySessionResponse']> = {
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  nextQuestion?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SessionStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatementFieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['StatementField'] = ResolversParentTypes['StatementField']> = {
  buttonText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  textSize?: Resolver<Maybe<ResolversTypes['TextSize']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubmitSurveySessionAnswerResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitSurveySessionAnswerResponse'] = ResolversParentTypes['SubmitSurveySessionAnswerResponse']> = {
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  nextQuestion?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Survey'] = ResolversParentTypes['Survey']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  form?: Resolver<Maybe<ResolversTypes['SurveyForm']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SurveyStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyConnection'] = ResolversParentTypes['SurveyConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SurveyEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyEdge'] = ResolversParentTypes['SurveyEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Survey'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyFieldResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyFieldResponse'] = ResolversParentTypes['SurveyFieldResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyFormResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyForm'] = ResolversParentTypes['SurveyForm']> = {
  context?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sections?: Resolver<Array<ResolversTypes['SurveySection']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  welcomeMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyFormOperationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyFormOperationResponse'] = ResolversParentTypes['SurveyFormOperationResponse']> = {
  data?: Resolver<ResolversTypes['Survey'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyQuestion'] = ResolversParentTypes['SurveyQuestion']> = {
  __resolveType: TypeResolveFn<'MatrixQuestion' | 'MultipleChoiceQuestion' | 'NumberQuestion' | 'RankingQuestion' | 'RatingQuestion' | 'StatementField' | 'TextQuestion', ParentType, ContextType>;
};

export type SurveyResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyResponse'] = ResolversParentTypes['SurveyResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['Survey']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySection'] = ResolversParentTypes['SurveySection']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fields?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySectionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySectionResponse'] = ResolversParentTypes['SurveySectionResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['SurveySection']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySession'] = ResolversParentTypes['SurveySession']> = {
  completedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  respondentData?: Resolver<ResolversTypes['RespondentData'], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  surveyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySessionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySessionConnection'] = ResolversParentTypes['SurveySessionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SurveySessionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySessionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySessionEdge'] = ResolversParentTypes['SurveySessionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SurveySession'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySessionResponse'] = ResolversParentTypes['SurveySessionResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['SurveySession']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveysResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveysResponse'] = ResolversParentTypes['SurveysResponse']> = {
  data?: Resolver<ResolversTypes['SurveyConnection'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['TeamMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamConnection'] = ResolversParentTypes['TeamConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TeamEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamEdge'] = ResolversParentTypes['TeamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamMember'] = ResolversParentTypes['TeamMember']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['TeamMemberRole'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamMemberConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamMemberConnection'] = ResolversParentTypes['TeamMemberConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TeamMemberEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamMemberEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamMemberEdge'] = ResolversParentTypes['TeamMemberEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TeamMember'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamMemberResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamMemberResponse'] = ResolversParentTypes['TeamMemberResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['TeamMember']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamMembersResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamMembersResponse'] = ResolversParentTypes['TeamMembersResponse']> = {
  data?: Resolver<ResolversTypes['TeamMemberConnection'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamResponse'] = ResolversParentTypes['TeamResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamsResponse'] = ResolversParentTypes['TeamsResponse']> = {
  data?: Resolver<ResolversTypes['TeamConnection'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TextQuestion'] = ResolversParentTypes['TextQuestion']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SurveyFieldTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UUIDScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersResponse'] = ResolversParentTypes['UsersResponse']> = {
  data?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Checkpoint?: CheckpointResolvers<ContextType>;
  CheckpointTarget?: CheckpointTargetResolvers<ContextType>;
  Choice?: ChoiceResolvers<ContextType>;
  Connection?: ConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Edge?: EdgeResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  MatrixQuestion?: MatrixQuestionResolvers<ContextType>;
  MultipleChoiceQuestion?: MultipleChoiceQuestionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NumberQuestion?: NumberQuestionResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectConnection?: ProjectConnectionResolvers<ContextType>;
  ProjectEdge?: ProjectEdgeResolvers<ContextType>;
  ProjectResponse?: ProjectResponseResolvers<ContextType>;
  ProjectsResponse?: ProjectsResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RankingQuestion?: RankingQuestionResolvers<ContextType>;
  RatingQuestion?: RatingQuestionResolvers<ContextType>;
  RespondentData?: RespondentDataResolvers<ContextType>;
  StartSurveySessionResponse?: StartSurveySessionResponseResolvers<ContextType>;
  StatementField?: StatementFieldResolvers<ContextType>;
  SubmitSurveySessionAnswerResponse?: SubmitSurveySessionAnswerResponseResolvers<ContextType>;
  Survey?: SurveyResolvers<ContextType>;
  SurveyConnection?: SurveyConnectionResolvers<ContextType>;
  SurveyEdge?: SurveyEdgeResolvers<ContextType>;
  SurveyFieldResponse?: SurveyFieldResponseResolvers<ContextType>;
  SurveyForm?: SurveyFormResolvers<ContextType>;
  SurveyFormOperationResponse?: SurveyFormOperationResponseResolvers<ContextType>;
  SurveyQuestion?: SurveyQuestionResolvers<ContextType>;
  SurveyResponse?: SurveyResponseResolvers<ContextType>;
  SurveySection?: SurveySectionResolvers<ContextType>;
  SurveySectionResponse?: SurveySectionResponseResolvers<ContextType>;
  SurveySession?: SurveySessionResolvers<ContextType>;
  SurveySessionConnection?: SurveySessionConnectionResolvers<ContextType>;
  SurveySessionEdge?: SurveySessionEdgeResolvers<ContextType>;
  SurveySessionResponse?: SurveySessionResponseResolvers<ContextType>;
  SurveysResponse?: SurveysResponseResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamConnection?: TeamConnectionResolvers<ContextType>;
  TeamEdge?: TeamEdgeResolvers<ContextType>;
  TeamMember?: TeamMemberResolvers<ContextType>;
  TeamMemberConnection?: TeamMemberConnectionResolvers<ContextType>;
  TeamMemberEdge?: TeamMemberEdgeResolvers<ContextType>;
  TeamMemberResponse?: TeamMemberResponseResolvers<ContextType>;
  TeamMembersResponse?: TeamMembersResponseResolvers<ContextType>;
  TeamResponse?: TeamResponseResolvers<ContextType>;
  TeamsResponse?: TeamsResponseResolvers<ContextType>;
  TextQuestion?: TextQuestionResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  UsersResponse?: UsersResponseResolvers<ContextType>;
};

