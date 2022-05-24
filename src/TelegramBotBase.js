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

    //this should be done automaticly
    this.modules.updateLoop = new UpdateLoop(this);
    this.modules.updates = new Updates(this);
    this.modules.DB = new DB(this);
    this.modules.send = new Send(this);
    this.modules.users = new Users(this);
    this.modules.updateHandler = new UpdateHandler(this);

  }
  /**@type {modules} */
  modules = {};

  registerOnExitListeners() {
    //on exit func
    const onExit = async () => {
      console.log("prepare to exit...");
      
      this.modules.updateLoop.isRunning = false;
      this.modules.users.stopUnloadLoop();

      await Promise.all([
        //TODO: add save all users
        this.modules.updateLoop.getStopPromise(),
        this.modules.DB.client.close()
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
