const fs = require("fs");
const jose = require("node-jose");

exports.handler = async (event) => {
  try {
    const keyStore = fs.readFileSync("Keys.json");
    const result = await jose.JWK.asKeyStore(keyStore.toString())
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    }
  } catch (e) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: 'error',
      }),
    };
  }
};
