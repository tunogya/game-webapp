const {ethers} = require("ethers");
const fs = require("fs");
const jose = require("node-jose");

exports.handler = async (event) => {
  try {
    const message = JSON.parse(event.body).message
    const signature = JSON.parse(event.body).signature
    const address = JSON.parse(event.body).address
    
    if (!message || !signature || !address) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: 'message, signature, address are required'
        })
      }
    }
  
    const r = signature.slice(0, 66)
    const s = "0x" + signature.slice(66, 130)
    const v = parseInt("0x" + signature.slice(130, 132), 16)
  
    const verifySigner = ethers.utils.verifyMessage(message, {
      r: r,
      s: s,
      v: v,
    });
    if (verifySigner !== address) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: 'signature is not valid'
        })
      }
    } else {
      const keys = fs.readFileSync("Keys.json");
    
      const keyStore = await jose.JWK.asKeyStore(keys.toString());
    
      const [key] = keyStore.all({ use: "sig" });
    
      const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };
    
      const payload = JSON.stringify({
        exp: Math.floor((Date.now() + 86400000) / 1000),
        iat: Math.floor(Date.now() / 1000),
        address: address,
      });
    
      const token = await jose.JWS.createSign(opt, key).update(payload).final();
    
      return {
        statusCode: 200,
        body: token,
      }
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: e,
      }),
    };
  }
}