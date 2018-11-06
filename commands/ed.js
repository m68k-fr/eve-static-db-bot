// Return Simple Item datasheets.
// Currently supported items: Kamihimes Eidolons Souls & Weapons

const config = require('../config.json');
const sdeparser = require('../utils/sdeparser.js');
const fuzzy = require('fuzzy');
const SDEArray = sdeparser.parse();

const fuzzyOptions = {
    extract: function (el) {
        return el.queryName;
    }
};


// --- parses result; added due to checking for khParameter.
// --- from '/kh kagutsuchi' to '/kh "kagutsuchi" kamihime'
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

    if (client.awaitingUsers.get(message.author.id)) return message.channel.send(`You have an existing selection ongoing. Please say \`cancel\` or \`0\` if you wish to issue a new ${config.prefix}kh command.`);

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
    // --- If there is only 5 and below on results.length, we will continue and cherry pick first element of results
    // --- Otherwise, we will return with a map of matching items

    if (!parameterResults.length)
        return message.channel.send(`Query '${khRequest}'${khParameter ? ` with parameter '${khParameter}'` : ''} is not found.`);


    // --- Condition check from parseResult() for Ship, Module, Blueprint, Weapons, and Accessories

    let embed;

    switch (true) {

        // --- ship

        case parseResult('Ship', parameterResults[0].catName, khParameter):
            embed = require('../utils/edEmbeds/ship').run(message, config, parameterResults[0]);
            break;

        // --- Module

        /*case parseResult('Module', parameterResults[0].objectType, khParameter):
            embed = require('../utils/khEmbeds/module').run(message, config, parameterResults[0]);
            break;

        // --- Blueprint

        case parseResult('Soul', parameterResults[0].objectType, khParameter):
            embed = require('../utils/khEmbeds/blueprint').run(message, config, parameterResults[0]);
            break;
         */

    }

    message.channel.send({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));

}
