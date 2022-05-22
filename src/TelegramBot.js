const { TelegramBotBase } = require("./TelegramBotBase");

class TelegramBot {
  #base;
  constructor(config) {
    this.#base = new TelegramBotBase(config);
  }

  async start() {
    await this.#base.DB.connect("mongodb://localhost:27017");
    this.#base.registerOnExitListeners();
    this.#base.users.startUnloadLoop();
    
    this.#base.updateLoop.start();
  }
}


module.exports = {TelegramBot}
