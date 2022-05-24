const { TelegramBotBase } = require("./TelegramBotBase");

class TelegramBot {
  #base;
  constructor(config) {
    this.#base = new TelegramBotBase(config);
  }

  async start() {
    await this.#base.modules.DB.connect("mongodb://localhost:27017");
    this.#base.registerOnExitListeners();
    this.#base.modules.users.startUnloadLoop();
    
    this.#base.modules.updateLoop.start();
  }
}


module.exports = {TelegramBot}
