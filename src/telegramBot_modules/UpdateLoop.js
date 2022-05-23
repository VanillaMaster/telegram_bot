/**
 * @typedef {import('../TelegramBotBase').TelegramBotBase} TelegramBotBase
 */
class UpdateLoop {
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

  /**
   * @type {Promise}
   */
  #stop;
  isRunning = true;
  #tasks = new Array(2);
  start(debug = false) {

    this.#stop = new Promise(async (stop) => {

      while (this.isRunning) {
        //console.time("updateLoop");

        this.#tasks[0] = this.#ITSELF.updates.get();
        this.#tasks[1] = new Promise((resolve) => {
          setTimeout(resolve, this.#ITSELF.delayMin);
        }
        );

        await this.#ITSELF.updateHandler.process(
          (await Promise.all(this.#tasks))[0]
        );

        //console.timeEnd("updateLoop");
      }

      console.log("exit: update loop stoped");
      stop();

    });

  }

  getStopPromise(){//should i just return this.#stop by itself ?
    return new Promise((resolve)=>{
      this.#stop.then(resolve);
    });
  }

}
exports.UpdateLoop = UpdateLoop;
