// user by id
import {DynamoDBDocumentClient, GetCommand} from '@aws-sdk/lib-dynamodb';
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

// NEXT.js API with type script
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query;
  try {
    const userRes = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: `TG-USER#${id}`,
        SK: `TG-USER#${id}`,
      },
    }));
    const user = userRes.Item
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({message: e});
  }
}