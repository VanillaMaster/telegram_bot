const { User } = require("../../misc/User");
/**@typedef {import('../../TelegramBotBase').TelegramBotBase} TelegramBotBase*/

class UpdateHandler {
  /**@type {TelegramBotBase}*/
  #ITSELF;
  /**@param {TelegramBotBase} parent*/
  constructor(parent) {
    this.#ITSELF = parent;

    // register handlers
    UpdateHandler.handlers.forEach(handlerClass=>{
      this.handlers[handlerClass.handledState] = new handlerClass(parent);
    });
    
  }

  handlers = {};

  static handlers = [];

  async process(data) {

    let res = [];

    for (let i = 0; i < data?.result?.length; i++) {
      const userID = data.result[i].message.from.id;
      const user = await this.#ITSELF.modules.users.getUser(userID);
      //reset user lifspan
      user.unserializable.lifeSpan = User.defaultUnserializableValuse.lifeSpan;

      if ("text" in data.result[i].message) {
        //get user state
        const [state,subState] = user.serializable.inputState.split(":");

        const options = {
          user: user,
          update: data.result[i],
        };
        if (subState !== undefined) {options.subState = subState};
        
        if (state in this.handlers){
          res.push(this.handlers[state].call(options));
        } else {
          console.error(`no handler for user: id${userID}\nstate: ${state}`);
        }
      }
    }

    await Promise.all(res);
    return;
  }

}

require("./Initializer")(UpdateHandler);

exports.UpdateHandler = UpdateHandler;
