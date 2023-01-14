const fs = require("fs");
const jose = require("node-jose");

exports.handler = async (event) => {
  try {
    const jwt = event.headers.authorization.split(" ")[1];
    const keys = fs.readFileSync("Keys.json");
    const keyStore = await jose.JWK.asKeyStore(keys.toString())
    
    const result = await jose.JWS.createVerify(keyStore, {
      algorithms: ["RS256"],
    }).verify(jwt);
    
    const payload = JSON.parse(result.payload.toString());
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: false,
      };
    }
    
    if (payload.iat > Math.floor(Date.now() / 1000)) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: false,
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: true,
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: false,
    };
  }
}