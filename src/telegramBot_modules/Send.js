const https = require('node:https');

/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class Send {
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

  message(chatID, msg, options = {}) {
    return new Promise((resolve, reject) => {
      this.#ITSELF.requestOptions.path = encodeURI(
        `/bot${this.#ITSELF.token}/sendMessage?chat_id=${chatID}&text=${msg}${options.reply_markup ? `&reply_markup=${JSON.stringify(options.reply_markup)}` : ""}`
      );
      this.#ITSELF.requestOptions.method = "GET";

      https.get(this.#ITSELF.requestOptions, (res) => {

        let chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const data = JSON.parse(body);
          resolve(data);
        });

      }).on('error', (e) => {
        reject(e);
      });
    });
  }
}
exports.Send = Send;
