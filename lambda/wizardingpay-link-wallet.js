const {DynamoDBDocumentClient, QueryCommand, PutCommand} = require('@aws-sdk/lib-dynamodb');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {ethers} = require("ethers");

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

// if get method, get user from dynamodb
  if (event.requestContext.http.method === 'GET') {
    try {
      const userRes = await ddbDocClient.send(new QueryCommand({
        TableName: 'wizardingpay',
        KeyConditionExpression: '#PK = :pk and begins_with(#SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `TG-USER#${userId}`,
          ':sk': `ETH#`,
        },
        ExpressionAttributeNames: {
          '#PK': 'PK',
          '#SK': 'SK',
        }
      }))
      return {
        statusCode: 200,
        body: JSON.stringify({
          wallet: userRes.Items?.map((item) => item.SK.slice(4)) || [],
          count: userRes.Count,
        }),
      };
    } catch (e) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error: e,
        })
      }
    }
  }
  
  if (event.requestContext.http.method === 'POST') {
    const message = JSON.parse(event.body).message
    const sign = JSON.parse(event.body).sign
    const address = JSON.parse(event.body).address
    
    const r = sign.slice(0, 66)
    const s = "0x" + sign.slice(66, 130)
    const v = parseInt("0x" + sign.slice(130, 132), 16)
    
    const verifySigner = ethers.utils.verifyMessage(message, {
      r: r,
      s: s,
      v: v,
    });
    if (verifySigner !== address) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error: 'sign is not valid'
        })
      }
    } else {
      try {
        await ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: {
            PK: `TG-USER#${userId}`,
            SK: `ETH#${address.toLowerCase()}`,
            create_at: Math.floor(Date.now() / 1000),
          }
        }))
        return {
          statusCode: 200,
          body: JSON.stringify({
            address: address
          })
        }
      } catch (e) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            error: e
          })
        }
      }
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  }
};
