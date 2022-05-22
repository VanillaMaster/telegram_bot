const https = require('node:https');

//import modules
const { UpdateLoop } = require("./telegramBot_modules/UpdateLoop");
const { Updates } = require("./telegramBot_modules/Updates");
const { DB } = require("./telegramBot_modules/DB");
const { Send } = require("./telegramBot_modules/Send");
const { Users } = require("./telegramBot_modules/Users");
const { UpdateHandler } = require("./telegramBot_modules/UpdateHandler");

class TelegramBotBase {

  static apiRoot = "api.telegram.org";

  delayMin = 300; //ms

  token;
  requestOptions;

  constructor(config) {
    this.token = config.token;
    if (config.delayMin) { this.delayMin = config.delayMin; };

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
  }

  registerOnExitListeners() {
    //on exit func
    const onExit = async () => {
      console.log("prepare to exit...");
      
      this.updateLoop.isRunning = false;
      this.users.stopUnloadLoop();

      await Promise.all([
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
