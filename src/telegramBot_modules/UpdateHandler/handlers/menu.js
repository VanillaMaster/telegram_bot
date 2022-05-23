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

	static keyboard = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: "😀 asd" }, { text: "🍕 qwe" }],
        [{ text: "🦽 zxc" }]
      ],
      resize_keyboard: true,
    }),
    parse_mode: "MarkdownV2",
  };

	async call(options) {
		const chatID = options.update.message.chat.id;

		let words = options.update.message.text.split(/[ ]+/);
		let resp = {};
		resp.command = words.shift();
		resp.arguments = words;

		await this.#ITSELF.send.message(chatID, `\`\`\`JSON\n${JSON.stringify(resp)}\n\`\`\``, Menu.keyboard)
		return;
	}
}