const discord = require('discord.js');

const padBigNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

exports.run = (message, config, edItem) => {

    let ed_name = edItem.name.en;
    const ed_link = config.wikidomain + edItem.typID;
    const ed_thumb = config.thumbrooturl + '/?type=icon&imageidx=' + edItem.iconFile;

    let ed_type = 'Module / ' + edItem.grpName;


    let description = '';
    description += '*' + edItem.description.en + '*';

    // ---- Display all infos using RichEmbed

    const embed = new discord.RichEmbed()
        .setAuthor('(Work in progress) ' + ed_type, '')
        .setTitle(ed_name)
        .setColor('#00AE86')
        .setDescription(description)
        .setThumbnail(ed_thumb)
        .setURL(ed_link);

    return embed;
}
