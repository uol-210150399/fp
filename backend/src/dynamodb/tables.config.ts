import {
  BillingMode,
  CreateTableCommand,
  KeyType,
  ScalarAttributeType,
} from '@aws-sdk/client-dynamodb';
import { getDynamoDBClient } from './dynamodb.config';

export const createTables = async () => {
  const client = getDynamoDBClient();

  const tables = [
    {
      TableName: 'okmillie',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' as KeyType }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' as ScalarAttributeType }, // String type
      ],
      BillingMode: 'PAY_PER_REQUEST' as BillingMode
    },
  ];

  for (const tableDefinition of tables) {
    try {
      console.log(`Attempting to create table: ${tableDefinition.TableName}`);
      await client.send(new CreateTableCommand(tableDefinition));
      console.log(
        `✅ Successfully created table: ${tableDefinition.TableName}`,
      );
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`ℹ️ Table already exists: ${tableDefinition.TableName}`);
      } else {
        console.error(
          `❌ Error creating table "${tableDefinition.TableName}": ${error.message}`,
        );
      }
    }
  }
};
