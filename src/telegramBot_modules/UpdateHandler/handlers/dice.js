const { User } = require("../../../misc/User");
/**
 * @typedef {import('../module').UpdateHandler} UpdateHandler
 * @typedef {import('../../../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */

module.exports = class Dice{
  /**@type {TelegramBotBase}*/
  #ITSELF;
  /**@param {TelegramBotBase} parent*/
  constructor(parent) {
    this.#ITSELF = parent;
  }
  static handledState = User.states.DICE;

  #commandMap = {

  };

  async invoke(options) {
    
    console.log(options);

    options.user.serializable.inputState = User.states.MENU

    return;
  }

  static helpText = `help command.\nTODO: write normal help laiter...\n\ncommand list:\n`;
  async #help(options){
    await this.#ITSELF.modules.send.message(options.update.message.chat.id, (Menu.helpText + Object.keys(this.#commandMap).join("\n")));
    return;
  }
  async #info(options){
    await this.#ITSELF.modules.send.message(options.update.message.chat.id, `\`\`\`JSON\n${JSON.stringify(options.user)}\n\`\`\``, {parse_mode: "MarkdownV2"})
    return;
  }

}