import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ConnectionArgs {
  @Field(() => Int)
  first: number;

  @Field(() => String, { nullable: true })
  after?: string;
} 