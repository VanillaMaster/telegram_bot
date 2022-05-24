const { User } = require("../misc/User");

/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class Users {
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

  interval = 5_000; //ms

  /**
   * @type {Map<number,User>}
   */
  #map = new Map();

  async getUser(id){
    if (this.#map.has(id)){
      return this.#map.get(id);
    }

    let userData = await this.#ITSELF.DB.findeUser(id);

    let user;
    if (userData != null){
      user = new User(userData);
    } else {
      user = new User({"id":id});
    }
    this.#map.set(id,user);

    return user;

  }

  #unloadLoop = null;
  startUnloadLoop() {
    if (this.#unloadLoop == null) {
      this.#unloadLoop = setInterval(() => {
        //console.log("unload cycle");
        for (const [id, user] of this.#map.entries()) {
          user.unserializable.lifeSpan--;
          if (user.unserializable.lifeSpan < 0) {
            this.#ITSELF.DB.saveUser(user.serializable)
            this.#map.delete(id);
          }
        }

      }, this.interval);
    }
  }

  stopUnloadLoop() {
    clearInterval(this.#unloadLoop);
  }

  //TODO: should save as bulk
  async unloadAll(){
    let res = [];
    for (const [id, user] of this.#map.entries()) {
      res.push(this.#ITSELF.DB.saveUser(user.serializable))
    }
    await Promise.all(res);
    return;
  }

}
exports.Users = Users;


