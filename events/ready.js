// This event will run if the bot starts, and logs in, successfully.

const config = require("../config.json");
const logger = require("../utils/logger").logger;
const sdeparser = require('../utils/sdeparser.js');


exports.run = (client) => {
    logger.info(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".

    // Init YAML parser
    sdeparser.parse();

    // Watching message
    if (client.guilds.size > 1)
        client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, {type: 'WATCHING'});
    else
        client.user.setActivity(`${client.guilds.size} server | ${config.prefix}help`, {type: 'WATCHING'});

    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`Memory Usage: ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }

}