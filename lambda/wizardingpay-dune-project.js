const {PutCommand, DynamoDBDocumentClient, QueryCommand} = require('@aws-sdk/lib-dynamodb');
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
  console.log(event)
  const jwt = event?.headers?.authorization?.split(" ")?.[1];
  const keys = fs.readFileSync("Keys.json");
  const keyStore = await jose.JWK.asKeyStore(keys.toString());
  
  const result = await jose.JWS.createVerify(keyStore, {
    algorithms: ["RS256"],
  }).verify(jwt);
  
  const payload = JSON.parse(result.payload.toString());
  
  const address = payload.sub;
  
  if (!address) {
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
  
  if (event.requestContext.http.method === 'GET') {
    const chainId = event?.queryStringParameters?.chainId || '';
    try {
      const result = await ddbDocClient.send(new QueryCommand({
        TableName: 'wizardingpay',
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `ETH#${address.toLowerCase()}`,
          ':sk': `DUNE-PROJECT#${chainId}`,
        }
      }))
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.Items),
      }
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
  
  if (event.requestContext.http.method === 'POST') {
    const address = JSON.parse(event.body).address;
    const decimals = JSON.parse(event.body).decimals;
    const name = JSON.parse(event.body).name;
    const symbol = JSON.parse(event.body).symbol;
    const totalSupply = JSON.parse(event.body).totalSupply;
    const chainId = JSON.parse(event.body).chainId;
    
    if (!isAddress(address)){
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "invalid address",
        })
      }
    }
    
    try {
      await ddbDocClient.send(new PutCommand({
        TableName: 'wizardingpay',
        Item: {
          PK: `ETH#${address.toLowerCase()}`,
          SK: `DUNE-PROJECT#${chainId}#${address.toLowerCase()}`,
          decimals,
          name,
          symbol,
          totalSupply,
          chainId,
        }
      }))
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "success",
          data: address.toLowerCase(),
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
          message: "error",
        })
      }
    }
  }
}