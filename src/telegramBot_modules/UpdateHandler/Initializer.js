const { time } = require("console");
const fs = require("fs");
/**@typedef {import('./module').UpdateHandler} UpdateHandler*/

module.exports = function(UpdateHandler) {
    console.log("load handlers:");
    console.time("handlers loaded");
    let items = fs.readdirSync(`${__dirname}/handlers/`).forEach(file=>{
        if (file.endsWith(".js")) {
            console.log(file);
            UpdateHandler.handlers.push(require(`./handlers/${file}`));
        }
    });
    console.timeEnd("handlers loaded");
}