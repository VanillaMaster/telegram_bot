const { MongoClient } = require('mongodb');

/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class DB {
  static DB_NAME = "tg-db";
  static COLLECTION_NAME = "users";
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

  async connect(addres) {
    this.client = new MongoClient(addres);
    await this.client.connect();
    this.ITSELF = await this.client.db(DB.DB_NAME);
    this.users = await this.ITSELF.collection(DB.COLLECTION_NAME);
    return true;
  }

  async findeUser(id){
    const user = await this.users.findOne({"id":id},{"projection": { _id: 0}});
    return user;
  }

  async saveUser(userData){
    console.log("saving:");
    console.log(userData);
    let filter = {id:userData.id};
    delete userData.id;
    await this.users.updateOne(filter,{$set: userData},{ upsert: true });
    return;
  }

}
exports.DB = DB;
