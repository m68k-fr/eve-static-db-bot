// The usual help command
// Display a Welcome text and all the available commands

const config = require("../config.json");

exports.run = (client, message, args) => {

    let helpText = "\n";

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
            helpText += "*This bot displays EVE Online ship datasheets.*\n";
            helpText += "*All database information based on EVE static data export (SDE).*\n";
            helpText += "*Released under the MIT License: https://github.com/m68k-fr/eve-static-db-bot*\n";
            helpText += "\n";

            helpText += "```css\n";
            helpText += "#Bot-command-list:\n\n";
            helpText += config.prefix + "ed [shipname] - Get info on a specific ship. ( Example: " + config.prefix + "ed mammoth )\n";
            helpText += config.prefix + "invitebot - Provide a link to install this bot on your own Discord server.\n";
            helpText += config.prefix + "help - Display what you're currently reading!\n";
            helpText += "```\n";

            break;
    }

    message.channel.send(helpText).then(sentMessage => client.clearDialog(message, sentMessage));

}
