// The usual help command
// Display a Welcome text and all the available commands

const config = require("../config.json");
const fs = require('fs');
const nbItems = require('../utils/sdeparser.js').getItemCount();

exports.run = (client, message, args) => {

    let helpText = "\n";

    let sdeVersion = 'SDE';

    var files = fs.readdirSync(__dirname + '/../datas/').filter(fn => fn.endsWith('TRANQUILITY.zip'));
    if (files[0]) {
        sdeVersion = files[0];
    }


    switch (args[0]) {

        case "invitebot":
            helpText += "_*```css\n";
            helpText += config.prefix + "invitebot\n\n";
            helpText += "Provides a link to install this bot on your own Discord server.\n";
            helpText += "Please, ensure you have an Admin role on your discord server to allow installation of a bot.\n";
            helpText += "```*_\n";
            break;

        default:
            helpText += "__***EVEStaticDB bot:***__\n";
            helpText += "\n";
            helpText += "*A discord bot for EVE Online game from ccpgames.*\n";
            helpText += "*This bot displays EVE Online item infos.*\n";
            helpText += "*All database information based on EVE static data export (" + sdeVersion + ").*\n";
            helpText += "*Released under the MIT License: https://github.com/m68k-fr/eve-static-db-bot*\n";
            helpText += "\n";

            helpText += "```css\n";
            helpText += "Registered Ships: " + nbItems.Ships + "\n";
            helpText += "Registered Modules: " + nbItems.Modules + "\n";
            helpText += "Registered Blueprints: " + nbItems.Blueprints + "\n";
            helpText += "```\n";


            helpText += "```css\n";
            helpText += "#Bot-command-list:\n\n";
            helpText += config.prefix + "ed [itemName] - Get info on a specific item. ( Example: " + config.prefix + "ed mammoth )\n";
            helpText += config.prefix + "invitebot - Provide a link to install this bot on your own Discord server.\n";
            helpText += config.prefix + "help - Display what you're currently reading!\n";
            helpText += "```\n";
            break;
    }

    message.channel.send(helpText).then(sentMessage => client.clearDialog(message, sentMessage));

};
