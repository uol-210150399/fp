import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    const isLocal = this.configService.get('NODE_ENV') === 'local';
    const client = new DynamoDBClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      ...(isLocal && {
        endpoint: 'http://localhost:4002',
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local',
        },
      }),
    });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async createItem(tableName: string, item: Record<string, any>) {
    return this.docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  }

  async getItem(tableName: string, key: Record<string, any>) {
    return this.docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: key,
      }),
    );
  }
}
