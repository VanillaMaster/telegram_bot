/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class User {
  /**@type {TelegramBotBase}*/
  #botContext;
  constructor(userData,botContext) {
    this.#botContext = botContext;

    for (const [key, value] of Object.entries(userData)) {
      this.#serializable[key] = value;
    }

    for (const [key, value] of Object.entries(User.defaultSerializableValuse)) {
      if (!(key in this.#serializable)){
        this.#serializable[key] = value;
      }
    }

    for (const [key, value] of Object.entries(User.defaultUnserializableValuse)) {
      this.unserializable[key] = value;
    }

    const f = ()=>{this.#botContext.modules.updateHandler.notifyHandler(this);}
    this.serializable = new Proxy(this.#serializable,{
      set(target, prop, val){
        target[prop] = val;
        if (prop == "inputState") {f();}
        return true;
      }
    });

  }
  #serializable = {};
  serializable;

  unserializable = {};

  static states = {
    MENU:"menu",
  };

  static moneyRechargeRate = 1/1;//money/secconds
  static moneyRechargeCap = 5000;

  static defaultSerializableValuse = {
    inputState: User.states.MENU,
    get time(){return Math.floor(new Date().getTime() / 1000)},//get time now
    money: 2000,
  };
  static defaultUnserializableValuse = {
    lifeSpan: 1,
  };

}
exports.User = User;
