class User {
  constructor(userData) {

    for (const [key, value] of Object.entries(User.defaultSerializableValuse)) {
      this.serializable[key] = value;
    }

    for (const [key, value] of Object.entries(userData)) {
      this.serializable[key] = value;
    }

  }
  serializable = {};
  unserializable = {
    lifeSpan: 1,
  };

  static states = {
    MENU:"menu",
  };

  static defaultSerializableValuse = {
    inputState: User.states.MENU,
  };
  static defaultUnserializableValuse = {
    lifeSpan: 1,
  };

}
exports.User = User;