class User {
  constructor(userData) {

    for (const [key, value] of Object.entries(userData)) {
      this.serializable[key] = value;
    }

    for (const [key, value] of Object.entries(User.defaultSerializableValuse)) {
      if (!(key in this.serializable)){
        this.serializable[key] = value;
      }
    }

    for (const [key, value] of Object.entries(User.defaultUnserializableValuse)) {
      this.unserializable[key] = value;
    }
  }
  serializable = {};

  unserializable = {};

  static states = {
    MENU:"menu",
    DICE:"dice",
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
