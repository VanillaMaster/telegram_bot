const { TelegramBot } = require("./src/TelegramBot");

const config = require("./config.json");

let bot = new TelegramBot(config);

bot.start();
