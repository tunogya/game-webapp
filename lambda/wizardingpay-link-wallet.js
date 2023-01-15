const {DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand} = require('@aws-sdk/lib-dynamodb');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const fs = require("fs");
const jose = require("node-jose");
const {isAddress} = require("ethers/lib/utils");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: 'userId is required'
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
      console.log(e)
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "error",
        })
      }
    }
  }
  
  // if user post a new wallet to a tg account, should verify jwt payload.sub = address
  // TODO need verify userId
  if (event.requestContext.http.method === 'POST') {
    const jwt = event.headers.authorization.split(" ")[1];
    const keys = fs.readFileSync("Keys.json");
    const keyStore = await jose.JWK.asKeyStore(keys.toString())
  
    const result = await jose.JWS.createVerify(keyStore, {
      algorithms: ["RS256"],
    }).verify(jwt);
  
    const payload = JSON.parse(result.payload.toString());
    
    const address = payload.sub;
    
    if (!isAddress(address)) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "invalid address in jwt",
        })
      }
    }
    
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address
        })
      }
    } catch (e) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: e
        })
      }
    }
  }
  
  if (event.requestContext.http.method === 'DELETE') {
    const jwt = event.headers.authorization.split(" ")[1];
    const keys = fs.readFileSync("Keys.json");
    const keyStore = await jose.JWK.asKeyStore(keys.toString());
  
    const result = await jose.JWS.createVerify(keyStore, {
      algorithms: ["RS256"],
    }).verify(jwt);
  
    const payload = JSON.parse(result.payload.toString());
  
    const address = payload.sub;
  
    if (!isAddress(address)) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "invalid address in jwt",
        })
      }
    }
  
    try {
      await ddbDocClient.send(new DeleteCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: `TG-USER#${userId}`,
          SK: `ETH#${address.toLowerCase()}`,
        }
      }))
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address
        })
      }
    } catch (e) {
      console.log(e)
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "error"
        })
      }
    }
  }
};
