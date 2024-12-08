import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/dynamodb/base.respository';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(dynamoDb: DynamoDBService) {
    super(dynamoDb);
  }

  async findUserById(userId: string) {
    const id = `USER#${userId}`;
    const key = 'PROFILE';
    const user = await this.get(id, key);
    return user;
  }

  async createUser(userId: string, email: string, name: string) {
    const id = `USER#${userId}`;
    const item = { PK: id, SK: 'PROFILE', email, name };
    await this.create(item);
  }
}
