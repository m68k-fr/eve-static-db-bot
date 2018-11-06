const Discord = require("discord.js");
const fs = require("fs");
const imageServer = require("./utils/imageServer");

const {
    token, // Your bot's token
    owners,
    discord_code,
    prefix // Your bot's prefix
} = require("./config.json"); // This is your configuration file, see an example on "config.sample.json"


imageServer.init();


// --- Client Class Extension for Utilities
class EveClient extends Discord.Client {
    constructor(options) {
        super(options);
        this.clearDialog = require('./utils/clearDialog');
        this.logger = require('./utils/logger').logger;
        this.awaitingUsers = new Discord.Collection();
    }
}

// This is your client. Some people call it `bot`, some people call it `self`,
const client = new EveClient({
    disabledEvents: ['TYPING_START'],
    disableEveryone: true
});


/*const used = process.memoryUsage();
for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}*/


// -------------------- event message ----------------------

client.on("message", message => {

    // This event will run on every single message received, from any channel or DM.
    if (message.author.bot) return;


    // --- Basic Command Handler

    if (message.content.indexOf(prefix) !== 0) return;
    // Here we separate our "command" name, and our "arguments" for the command.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //try {
    if (!fs.existsSync(`./commands/${command}.js`)) return;
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
    /*} catch(err) {
      message.channel.send(
        `Sorry, something happened: \`${err.message}\`\n\n` +
        `If this is a feature-breaking issue, please contact: ` +
        `${owners ? owners.map(o => `\`${client.users.get(o).tag}\``).join(', ') : 'No bot developers were in the configuration'}\n` +
        `Or proceed to this Discord invite code: \`${discord_code ? discord_code : 'No invite code was in the configuration'}\``
      );
      client.logger.error(err);
    }*/

});

client.on("error", (err) => {
    client.logger.error(err);
});

client.on("warn", (warn) => {
    client.logger.warn(warn);
});

client.login(token);
