const discord = require('discord.js');

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.run = (message, config, edItem) => {

    console.log('Displaying ItemId: ' + edItem.typID);

    const ed_name = edItem.name.en;
    const ed_link = config.wikidomain + edItem.typID;
    const ed_thumb = config.thumbrooturl + '/?width=80&imageidx=' + edItem.typID;
    const ed_image = config.thumbrooturl + '/?width=400&height=267&imageidx=' + edItem.typID;
    const kh_rarity = edItem.rarity;
    const kh_element = edItem.element;

    let ed_type = edItem.raceName + ' / ' + edItem.grpName;
    if (edItem.basePrice) {
        ed_type += ' (' + numberWithCommas(edItem.basePrice) + ' ISK)';
    }

    const embed = new discord.RichEmbed()
    //.setTitle(config.eimojis[kh_rarity]+' '+config.eimojis[kh_element+'Symbol']+' ('+ed_type+')')
        .setAuthor(ed_type, '')
        .setTitle(ed_name)
        .setColor('#00AE86')
        .setDescription('*' + edItem.description.en + '*')
        //.setThumbnail(ed_thumb)
        .setURL(ed_link)
        .setImage(ed_image)
        .addField('Structure:', 'Mass: ' + edItem.mass + ' Vol: ' + edItem.volume + ' Cargo: ' + edItem.capacity, false);
    //.addField('Structure:', ':crossed_swords: ATK: ' + kh_attackMin + '-' + kh_attackMax + ' :green_heart: HP: ' + kh_HPMin + '-' + kh_HPMax + ' :muscle: PWR: ' + kh_totalPowerMin + '-' + kh_totalPowerMax, false);

    // Bonuses

    if (edItem.typeBonusName) {
        let typeBonus = '';
        for (let typeBonusID in edItem.traits.types) {
            for (let bonusId in edItem.traits.types[typeBonusID]) {
                typeBonus += "★ " + edItem.traits.types[typeBonusID][bonusId].bonus + '% ' + edItem.traits.types[typeBonusID][bonusId].bonusText.en + ".\n";
            }
        }
        embed.addField(edItem.typeBonusName + ' skill bonuses:', typeBonus, false);
    }

    if (edItem.traits.roleBonuses) {
        let roleBonus = '';
        for (let i = 0; i < edItem.traits.roleBonuses.length; i++) {
            roleBonus += '★ ' + edItem.traits.roleBonuses[i].bonus + '% ' + edItem.traits.roleBonuses[i].bonusText.en + "\n";
        }
        if (roleBonus) {
            embed.addField('Role bonuses:', roleBonus, false);
        }
    }

    if (edItem.traits.miscBonuses) {
        let miscBonus = '';
        for (let i = 0; i < edItem.traits.miscBonuses.length; i++) {
            roleBonus += '★ ' + edItem.traits.miscBonuses[i].bonusText.en + "\n";
        }
        if (miscBonus) {
            embed.addField('Misc bonuses:', miscBonus, false);
        }

    }


    return embed;
}
