// user by address
import {DynamoDBDocumentClient, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {NextApiRequest, NextApiResponse} from 'next';

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  }
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // query all users by address
  const {address} = req.query;
  try {
    const userRes = await ddbDocClient.send(new QueryCommand({
      IndexName: 'SK-PK-index',
      TableName: 'wizardingpay',
      KeyConditionExpression: 'SK = :sk and begins_with(PK, :pk)',
      ExpressionAttributeValues: {
        ':sk': `ETH#${address}`,
        ':pk': 'TG-USER#',
      }
    }));
    const users = userRes.Items
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({message: e});
  }
}