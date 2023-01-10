const {DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb');
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
      SK: `TG-USER#${userId}`,
    },
  })).catch((err) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: err,
      })
    }
  })
  const user = userRes.Item
  
  if (!user) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: 'user not found'
      })
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};
