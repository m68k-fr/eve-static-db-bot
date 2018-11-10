// --- Awaits the command user's response when there are multiple results from /kh search

const config = require('../config.json');
const parseResult = (objectType, selected) => {
    return selected == objectType;
};

module.exports = async (message, dialog, result) => {
    try {
        const responses = await message.channel.awaitMessages(
            m =>
                m.author.id === message.author.id &&
                (m.content.toLowerCase() === 'cancel' || parseInt(m.content) === 0 ||
                    (parseInt(m.content) >= 1 && parseInt(m.content) <= result.length)), {
                max: 1,
                time: 30 * 1000,
                errors: ['time']
            }
        );

        const response = responses.first();
        let embed;
        if (response.content.toLowerCase() === 'cancel' || parseInt(response.content) === 0) {
            message.client.awaitingUsers.delete(message.author.id);
            return dialog.edit('Selection cancelled.');
        }

        const responseIdx = parseInt(response.content) - 1;

        console.log('Displaying ItemId: ' + result[responseIdx].typID);

        switch (true) {

            // --- Ships

            case parseResult('Ship', result[responseIdx].catName):
                embed = require('./edEmbeds/ship').run(message, config, result[responseIdx]);
                break;

            // --- Module

            case parseResult('Module', result[responseIdx].catName):
                embed = require('../utils/edEmbeds/module').run(message, config, result[responseIdx]);
                break;

            // --- Blueprint

            case parseResult('Blueprint', result[responseIdx].catName):
                embed = require('../utils/edEmbeds/blueprint').run(message, config, result[responseIdx]);
                break;

        }

        if (message.channel.type === 'text' && message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
        dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
    }
    catch (err) {
        if (typeof err.stack !== 'undefined') {
            dialog.edit(
                `Sorry, something happened: \`${err.message}\`\n\n`
            );
            message.client.logger.error(err);
        }
        else
            dialog.edit('Selection expired.');
    }
    message.client.awaitingUsers.delete(message.author.id);
};