const {Telegraf, Markup} = require("telegraf");
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const axios = require("axios");
const {PutCommand, DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');

const bot = new Telegraf(process.env.BOT_TOKEN);

const s3 = new S3Client({
  region: "ap-northeast-1",
});

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

bot.start(async (ctx) => {
  try {
    ctx.replyWithMarkdown(`*Welcome to WizardingPay*
    
Games:
- /dune, Mint Spice on Arrakis dune!

Wallet:
- /link, Link your wallet
`)
    const userRes = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: 'TG-USER#123456',
        SK: 'TG-USER#123456',
      }
    }))
    const user = userRes.Item
    if (!user) {
      ctx.telegram.getUserProfilePhotos(ctx.from.id)
          .then((res) => {
            if (res.total_count > 0) {
              ctx.telegram.getFileLink(res.photos[0][0].file_id).then((link) => {
                axios({
                  method: 'get',
                  url: link.href,
                  responseType: 'arraybuffer'
                }).then((res) => {
                  const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: `avatar/${ctx.from.id}.jpg`,
                    Body: Buffer.from(res.data, 'base64'),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                  };
                  s3.send(new PutObjectCommand(params)).then((res) => {
                    // update avatar to telegram-users
                  })
                      .catch((err) => {
                        console.log(err);
                      })
                })
              });
            }
          })
          .catch((err) => {
            console.log("fetch user avatar", err);
          });
      ddbDocClient.send(new PutCommand({
        TableName: 'wizardingpay',
        Item: {
          PK: `TG-USER#${ctx.from.id}`,
          SK: `TG-USER#${ctx.from.id}`,
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
          username: ctx.from.username,
          create_at: Math.floor(Date.now() / 1000),
        }
      })).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      })
    }
  } catch (e) {
    console.log(e)
  }
});

bot.command("dune", (ctx) => {
  try {
    ctx.replyWithGame('dune', Markup.inlineKeyboard([
      Markup.button.game("Play Solo"),
      Markup.button.url("Github", "https://github.com/tunogya/wizardingpay-game-webapp")
    ]))
  } catch (e) {
    console.log(e);
  }
});

bot.command("link", (ctx) => {
  ctx.reply("Please enter the webapp to link wallet:", Markup.inlineKeyboard([
    Markup.button.webApp("Link Wallet", `https://game.wizardingpay.com/link/?userId=${ctx.from.id}`)
  ]))
})

bot.gameQuery((ctx) => {
  try {
    const game_short_name = ctx.update.callback_query.game_short_name;
    ctx.answerGameQuery(`https://game.wizardingpay.com/${game_short_name}/?userId=${ctx.update.callback_query.from.id}`);
  } catch (e) {
    console.log(e)
  }
});

exports.handler = async (event, context, callback) => {
  const tmp = JSON.parse(event.body);
  await bot.handleUpdate(tmp);
  return callback(null, {
    statusCode: 200,
    body: '',
  });
};