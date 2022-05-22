const { User } = require("./User");
/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class UpdateHandler {
  /**
   * @type {TelegramBotBase}
   */
  #ITSELF;
  /**
   * @param {TelegramBotBase} parent
   */
  constructor(parent) {
    this.#ITSELF = parent;
  }

  static keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "😀 asd" }, { text: "🍕 qwe" }],
        [{ text: "🦽 zxc" }]
      ],
      resize_keyboard: true,
    }
  };

  async process(data) {

    let res = [];

    for (let i = 0; i < data?.result?.length; i++) {
      const chatID = data.result[i].message.chat.id;
      const userID = data.result[i].message.from.id;

      const user = await this.#ITSELF.users.getUser(userID);
      //reset user lifspan
      user.unserializable.lifeSpan = User.defaultUnserializableValuse.lifeSpan;

      if ("text" in data.result[i].message) {

        const text = data.result[i].message.text;
        res.push(
          this.#ITSELF.send.message(chatID, text, UpdateHandler.keyboard)
        );
      }

    }

    await Promise.all(res);
    return;
  }

}
exports.UpdateHandler = UpdateHandler;
