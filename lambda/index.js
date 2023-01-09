const {Telegraf, Markup} = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  try {
    ctx.replyWithMarkdown(`*Welcome to WizardingPay*
    
Games:
- /dune, Mint Spices on Arrakis dune!
`)
  } catch (e) {
    console.log(e)
  }
});

bot.command("dune", (ctx) => {
  try {
    ctx.replyWithGame('dune', Markup.inlineKeyboard([
      Markup.button.game("Play Solo"),
      Markup.button.url("Github", "https://github.com/tunogya/arrakis-dune")
    ]))
  } catch (e) {
    console.log(e);
  }
});

bot.gameQuery((ctx) => {
  try {
    const game_short_name = ctx.update.callback_query.game_short_name;
    ctx.answerGameQuery(`https://${game_short_name}.game.wizardingpay.com?userId=${ctx.update.callback_query.from.id}`);
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