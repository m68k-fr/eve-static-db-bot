// Return Simple Item datasheets.
// Currently supported items: Ships Modules Blueprints

const config = require('../config.json');
const sdeparser = require('../utils/sdeparser.js');
const fuzzy = require('fuzzy');
const SDEArray = sdeparser.getItems();

const fuzzyOptions = {
    extract: function (el) {
        return el.queryName;
    }
};


// --- parses result; added due to checking for khParameter.
// --- parameter is optional but recommended (user)

const parseResult = (objectType, result, parameter) => {
    let returningResult;

    parameter === null
        ? returningResult = result == objectType
        : returningResult = result == objectType && parameter == objectType;

    return returningResult;
};

// -- Title case

String.prototype.toTitleCase = function () {
    return this[0].toUpperCase() + this.substring(1).toLowerCase();
};

// --- process the command

exports.run = (client, message, args) => {


    if (message.guild) {
        if (!message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) {
            return;
        }
        if (!message.channel.permissionsFor(message.client.user).has('EMBED_LINKS')) {
            message.channel.send("'Embed Links' permission had been deactivated for me in this channel, please update my permissions to allow a response.");
            return;
        }
    }

    if (client.awaitingUsers.get(message.author.id)) return message.channel.send(`You have an existing selection ongoing. Please say \`cancel\` or \`0\` if you wish to issue a new ${config.prefix}ed command.`);

    let khRequest = args.join(' ');
    let khParameter = null;

    if (!khRequest) {
        message.channel.send('For the search query to be effective, you must enter at least three characters.');
        return;
    }


    if (khRequest.length < 3)
        return message.channel.send('For the search query to be effective, you must enter at least three characters.');


    const results = fuzzy.filter(khRequest, SDEArray, fuzzyOptions);
    const khItems = results.map(function (el) {
        return el.original;
    });
    const parameterResults = khItems;

    console.log('fuzzy found: ' + khItems.length + ' result');

    // --- Check for any results

    if (!parameterResults.length)
        return message.channel.send(`Query '${khRequest}'${khParameter ? ` with parameter '${khParameter}'` : ''} is not found.`);

    if (!khParameter) {
        if (parameterResults.length > 1) {
            message.channel.send(
                `The following items match with query '${khRequest}':`
                + `\n\`\`\`js\n{\n\t0: (Void) "Cancel the Selection",\n${parameterResults.slice(0, 9).map(el => `\t${parameterResults.indexOf(el) + 1}: (${el.catName}) "${el.queryName}"`).join(',\n')}\n}\`\`\``
                + `\nSelect an item by their designated number to prompt me to continue. Say \`cancel\` or \`0\` to cancel the command.`
                + `\nExpires within 30 seconds.`
            ).then(sentMessage => {
                client.awaitSelection(message, sentMessage, parameterResults.slice(0, 9));
                client.awaitingUsers.set(message.author.id, true);
            });
            return;
        }
    }


    // --- Condition check from parseResult() for Ship, Module and Blueprint

    let embed;

    console.log('Displaying ItemId: ' + parameterResults[0].typID);

    switch (true) {

        // --- ship

        case parseResult('Ship', parameterResults[0].catName, khParameter):
            embed = require('../utils/edEmbeds/ship').run(message, config, parameterResults[0]);
            break;

        // --- Module

        case parseResult('Module', parameterResults[0].catName, khParameter):
            embed = require('../utils/edEmbeds/module').run(message, config, parameterResults[0]);
            break;

        // --- Blueprint

        case parseResult('Blueprint', parameterResults[0].catName, khParameter):
            embed = require('../utils/edEmbeds/blueprint').run(message, config, parameterResults[0]);
            break;

    }

    message.channel.send({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));

}
