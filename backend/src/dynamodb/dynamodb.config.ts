import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.NODE_ENV === 'development' && {
      endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:4002',
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    }),
  });

  return DynamoDBDocumentClient.from(client);
};
