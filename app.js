const Telegraf = require("telegraf");
const fetch = require("node-fetch");
const bot = new Telegraf(process.env.BOT_TOKEN);
const welcome_msg = "> Enter 'Country_name' for updates\n> /help for more";
const url = "https://coronavirus.jhu.edu/map.html";
const help_msg = "Visit " + url + " for more...";

//Basic commands
bot.start(ctx => {
  const user = ctx.from;
  ctx.reply("Hi " + user.username);
  ctx.reply(welcome_msg);
});
bot.help(ctx => {
  ctx.reply(help_msg);
});

//Listen to queries
bot.on("text", ctx => {
  var msg = ctx.message.text;
  fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
      var l = data[msg].length;
      var res = "";
      var res =
        "Cases in " +
        msg +
        " in the past 30 days\n\n" +
        "Date | Confirmed | Recover | Death \n";
      for (var i = l - 1; i > l - 31; i--) {
        res +=
          "> " +
          data[msg][i].date +
          " | " +
          data[msg][i].confirmed +
          " | " +
          data[msg][i].recovered +
          " | " +
          data[msg][i].deaths +
          " \n";
      }
      ctx.reply(res + "\n" + help_msg);
    })
    .catch(e => {
      ctx.reply(
        "Oops... Looks like a spelling mistake\nTry entering with the first letter in UpperCase and the rest in LowerCase\nEXAMPLE : India,Italy,Germany,China.......for America enter US"
      );
    });
});

//Launch the bot
bot.launch();
