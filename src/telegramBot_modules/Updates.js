const https = require('node:https');

/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class Updates {
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

  offset = null;
  get() {
    return new Promise((resolve, reject) => {
      //this.requestOptions.path = encodeURI(`/bot${this.#ITSELF.token}/getUpdates${this.offset ? (`?offset=${this.offset}`) : ""}`); //redundant
      this.#ITSELF.requestOptions.path = `/bot${this.#ITSELF.token}/getUpdates${this.offset ? (`?offset=${this.offset}`) : ""}`;
      this.#ITSELF.requestOptions.method = "GET";

      https.get(this.#ITSELF.requestOptions, (res) => {

        let chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const data = JSON.parse(body);

          //set offest
          if (data?.result?.length > 0) {
            this.offset = (data.result[data.result.length - 1].update_id + 1);
          }

          resolve(data);
        });

      }).on('error', (e) => {
        reject(e);
      });
    });
  }

}
exports.Updates = Updates;
