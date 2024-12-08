import { DynamoDBService } from './dynamodb.service';

export abstract class BaseRepository {
  protected readonly tableName = 'okmillie';

  constructor(private readonly dynamoDb: DynamoDBService) {}

  protected async create(params: Record<string, any>) {
    return await this.dynamoDb.createItem(this.tableName, params);
  }

  protected async update(key: string, params: Record<string, any>) {
    return await this.dynamoDb.updateItem(this.tableName, {
      PK: key,
      ...params,
    });
  }

  protected async delete(id: string) {
    return await this.dynamoDb.deleteItem(this.tableName, { PK: id });
  }

  protected async query(id: string) {
    const params = { id };
    return await this.dynamoDb.queryItems(this.tableName, params);
  }

  protected async get(id: string, key: string) {
    const params = { PK: id, SK: key };
    return await this.dynamoDb.getItem(this.tableName, params);
  }
}
