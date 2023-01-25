// POST a address
import {DynamoDBDocumentClient, PutCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {NextApiRequest, NextApiResponse} from 'next';

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {address, id} = req.body;
    try {
      await ddbDocClient.send(new PutCommand({
        TableName: 'wizardingpay',
        Item: {
          PK: `TG-USER#${id}`,
          SK: `ETH#${address}`,
        }
      }));
      res.status(200).json({message: 'success'});
    } catch (e) {
      res.status(500).json({message: e});
    }
  }
  // DEL a address
  if (req.method === 'DELETE') {
    const {address, id} = req.body;
    try {
      await ddbDocClient.send(new DeleteCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: `TG-USER#${id}`,
          SK: `ETH#${address}`,
        }
      }));
      res.status(200).json({message: 'success'});
    } catch (e) {
      res.status(500).json({message: e});
    }
  }
}