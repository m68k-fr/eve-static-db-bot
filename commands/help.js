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
            helpText += "Please, ensure you have the 'Manage server' role on your discord server to allow installation of a bot.\n";
            helpText += "```*_\n";
            break;

        default:
            helpText += "__***eve-Bot:***__\n";
            helpText += "\n";
            helpText += "*A discord bot for EVE Online game from www.ccpgames.com*\n";
            helpText += "*All database information based on EVE static data export (SDE)*\n";
            helpText += "\n";

            helpText += "```css\n";
            helpText += "#Bot-command-list:\n\n";
            helpText += "Type '" + config.prefix + "help' for this general help message and '" + config.prefix + "help [command]' to get more info on a specific command. ( Example: " + config.prefix + "help invitebot )\n\n";
            helpText += "[invitebot] - Provides a link to install this bot on your own Discord server.\n\n";
            helpText += "Don't include the example brackets when using commands!\n";
            helpText += "```\n";

            break;
    }

    message.channel.send(helpText).then(sentMessage => client.clearDialog(message, sentMessage));

}
