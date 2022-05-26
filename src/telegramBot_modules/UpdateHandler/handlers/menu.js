const { User } = require("../../../misc/User");
/**
 * @typedef {import('../module').UpdateHandler} UpdateHandler
 * @typedef {import('../../../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */

module.exports = class Menu{
  /**@type {TelegramBotBase}*/
  #ITSELF;
  /**@param {TelegramBotBase} parent*/
  constructor(parent) {
    this.#ITSELF = parent;
  }
  static handledState = User.states.MENU;

  #commandMap = {
    "/help": this.#help,
    "/info": this.#info,
  };

	async invoke(options) {
		let words = options.update.message.text.split(/[ ]+/);

    let command = words.shift();
    options.commandArguments = words;
    if (command in this.#commandMap) {
      //call function with right context
      await this.#commandMap[command].call(this,options);
    } else {
      // command not found
      await this.#ITSELF.modules.send.message(options.update.message.chat.id, `command not found`);
    }
    return;
	}
  /**@param {User} user*/
  async onUserEntrance(user){
    console.log("onUserEntrance: MENU");
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