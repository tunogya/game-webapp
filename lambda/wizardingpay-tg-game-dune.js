const {PutCommand, DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

exports.handler = async (event) => {
  const userId = event?.queryStringParameters?.userId
  
  if (!userId) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: 'userId is required'
      })
    }
  }
  
  const userRes = await ddbDocClient.send(new GetCommand({
    TableName: 'wizardingpay',
    Key: {
      PK: `TG-USER#${userId}`,
      SK: `TG-GAME#dune`,
    }
  }))
  
  const user = userRes.Item
  
  if (!user) {
    const item = {
      PK: `TG-USER#${userId}`,
      SK: `TG-GAME#dune`,
      balance: 0,
      level: 1,
      create_at: Math.floor(Date.now() / 1000),
    }
    await ddbDocClient.send(new PutCommand({
      TableName: 'wizardingpay',
      Item: item
    }))
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};
