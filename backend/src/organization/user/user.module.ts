import { Module } from '@nestjs/common';
import { UserQueryResolver } from './user-query.resolver';
import { UserMutationResolver } from './user-mutation.resolver';
import { UserService } from './user.service';
import { UsersRepository } from './user.repository';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [DynamoDBModule],
  providers: [
    UserQueryResolver,
    UserMutationResolver,
    UserService,
    UsersRepository,
  ],
  exports: [UserQueryResolver, UserMutationResolver],
})
export class UserModule {}
