import { Field, ID, ObjectType, registerEnumType, Int } from '@nestjs/graphql';

export enum ErrorCode {
  SESSION_START_ERROR = 'SESSION_START_ERROR',
  ANSWER_SUBMISSION_ERROR = 'ANSWER_SUBMISSION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
});

@ObjectType()
export class Error {
  @Field(() => ErrorCode)
  code: ErrorCode;

  @Field()
  message: string;
}

@ObjectType()
export class SurveySession {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  surveyId: string;

  @Field(() => ID)
  publishedSurveyId: string;

  @Field()
  startedAt: Date;

  @Field()
  lastAnsweredAt: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field(() => [SurveySessionAnswer])
  answers: SurveySessionAnswer[];

  @Field({ nullable: true })
  respondentIp?: string;

  @Field({ nullable: true })
  userAgent?: string;
}

@ObjectType()
export class SurveySessionAnswer {
  @Field(() => ID)
  questionId: string;

  @Field()
  value: string;
}

@ObjectType()
export class SurveySessionEdge {
  @Field(() => ID)
  cursor: string;

  @Field(() => SurveySession)
  node: SurveySession;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
}

@ObjectType()
export class SurveySessionConnection {
  @Field(() => [SurveySessionEdge])
  edges: SurveySessionEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class SurveySessionResponseMetadata {
  @Field(() => ID)
  sessionId: string;
}

@ObjectType()
export class StartSurveySessionResponse {
  @Field(() => [SurveyQuestion])
  questions: SurveyQuestion[];

  @Field(() => SurveySessionResponseMetadata, { nullable: true })
  metadata: SurveySessionResponseMetadata | null;

  @Field(() => Error, { nullable: true })
  error: Error | null;
}

@ObjectType()
export class SubmitSurveySessionAnswerResponse {
  @Field(() => [SurveyQuestion])
  nextQuestions: SurveyQuestion[];

  @Field(() => Error, { nullable: true })
  error: Error | null;
}

@ObjectType()
export class SurveyQuestion {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  required: boolean;

  @Field(() => String)
  type: string;

  @Field(() => String)
  sectionId: string;

  @Field(() => [String], { nullable: true })
  choices?: string[];

  @Field(() => [String], { nullable: true })
  labels?: string[];

  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;

  @Field(() => Int, { nullable: true })
  rows?: number;

  @Field(() => String, { nullable: true })
  buttonText?: string;
} 