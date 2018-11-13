const discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");

const padBigNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

exports.run = (message, config, edItem) => {

    let ed_name = edItem.name.en;
    const ed_link = config.wikidomain + edItem.typID;
    const ed_thumb = config.thumbrooturl + '/?type=icon&imageidx=blueprint';

    let ed_type = edItem.grpName;

    // ---- Process Attributes

    const runningTime = moment.duration(edItem.time, "seconds").format("dd[D] hh[h]mm[m]ss[s]");

    let output = "```\nTimePerRun: " + runningTime + "\n";

    output += "Outcome: ";
    for (var idx in edItem.products) {
        output += edItem.products[idx].quantity + ' x ' + edItem.products[idx].name + ' ';
    }
    output += "```\n";

    output += "Required Skills:\n";
    for (var idx in edItem.skills) {
        output += edItem.skills[idx].name + ' Lvl' + edItem.skills[idx].level + '\n';
    }

    output += "\nRequired input Materials:\n";
    for (var idx in edItem.materials) {
        output += '★ ' + padBigNumber(edItem.materials[idx].quantity) + ' x ' + edItem.materials[idx].name + '\n';
    }
    output += "\n";

    if (edItem.basePrice) {
        ed_name += ' ' + config.eimojis['Base_Price'] + ' ' + padBigNumber(edItem.basePrice) + " ISK";
    }

    // ---- Display all infos using RichEmbed

    const embed = new discord.RichEmbed()
        .setAuthor(ed_type, '')
        .setTitle(ed_name)
        .setDescription(output)
        .setColor('#00AE86')
        .setThumbnail(ed_thumb)
        .setURL(ed_link);

    return embed;
}
