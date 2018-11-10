const Discord = require("discord.js");
const fs = require("fs");
const imageServer = require("./utils/imageServer");

const {
    token, // Your bot's token
    prefix // Your bot's prefix
} = require("./config.json"); // This is your configuration file, see an example on "config.sample.json"


var express = imageServer.init('../datas');


// --- Client Class Extension for Utilities
class EveClient extends Discord.Client {
    constructor(options) {
        super(options);
        this.clearDialog = require('./utils/clearDialog');
        this.awaitSelection = require('./utils/awaitSelection');
        this.logger = require('./utils/logger').logger;
        this.awaitingUsers = new Discord.Collection();
    }
}

// This is your client. Some people call it `bot`, some people call it `self`,
const client = new EveClient({
    disabledEvents: ['TYPING_START'],
    disableEveryone: true
});


// -------------- This loop reads the /events/ folder and attaches each event file to the appropriate event.

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});


// -------------------- event message ----------------------

client.on("message", message => {

    // This event will run on every single message received, from any channel or DM.
    if (message.author.bot) return;


    // --- Basic Command Handler

    if (message.content.indexOf(prefix) !== 0) return;
    // Here we separate our "command" name, and our "arguments" for the command.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        if (!fs.existsSync(`./commands/${command}.js`)) return;
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        message.channel.send(
            `Sorry, something happened: \`${err.message}\`\n\n`
        );
        client.logger.error(err);
    }

});

client.on("error", (err) => {
    client.logger.error(err);
});

client.on("warn", (warn) => {
    client.logger.warn(warn);
});

client.login(token);
