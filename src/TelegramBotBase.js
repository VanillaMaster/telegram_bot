const https = require('node:https');

//import modules
const { UpdateLoop } = require("./telegramBot_modules/UpdateLoop");
const { Updates } = require("./telegramBot_modules/Updates");
const { DB } = require("./telegramBot_modules/DB");
const { Send } = require("./telegramBot_modules/Send");
const { Users } = require("./telegramBot_modules/Users");
const { UpdateHandler } = require("./telegramBot_modules/UpdateHandler/module");

//require("./telegramBot_modules/UpdateHandler/Initializer")();


/**
 * default modules list
 * @typedef {Object} modules
 * @property {UpdateLoop} updateLoop
 * @property {Updates} updates
 * @property {DB} DB
 * @property {Send} send
 * @property {Users} users
 * @property {UpdateHandler} updateHandler
 */

class TelegramBotBase {

  static apiRoot = "api.telegram.org";
  static avalableConfigOptions = new Set([
    "token",
    //"apiRoot",
    "delayMin",
  ]);

  delayMin = 300; //ms

  token;
  requestOptions;

  constructor(config) {

    for (const [key, value] of Object.entries(config)) {
      if (TelegramBotBase.avalableConfigOptions.has(key)){
        this[key] = value;
      }
    }

    this.requestOptions = {
      hostname: config.apiRoot || TelegramBotBase.apiRoot,
      method: null,
      path: null,
      agent: https.Agent({ keepAlive: false }),
      timeout: 60000,
    };

    this.updateLoop = new UpdateLoop(this);
    this.updates = new Updates(this);
    this.DB = new DB(this);
    this.send = new Send(this);
    this.users = new Users(this);
    this.updateHandler = new UpdateHandler(this);

    //prepare for module autoloading
    this.modules.updateLoop = this.updateLoop;
    this.modules.updates = this.updates;
    this.modules.DB = this.DB;
    this.modules.send = this.send;
    this.modules.users = this.users;
    this.modules.updateHandler = this.updateHandler;

  }
  /**@type {modules} */
  modules = {};

  registerOnExitListeners() {
    //on exit func
    const onExit = async () => {
      console.log("prepare to exit...");
      
      this.updateLoop.isRunning = false;
      this.users.stopUnloadLoop();

      await Promise.all([
        //TODO: add save all users
        this.updateLoop.getStopPromise(),
        this.DB.client.close()
      ]);

      console.log("exit success");
      process.exit();
    };

    //register listeners
    //process.on('exit', onExit); // redundant ?
    process.on('SIGINT', onExit);
  }

}

exports.TelegramBotBase = TelegramBotBase;
