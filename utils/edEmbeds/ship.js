const discord = require('discord.js');

const excludedAttributes = ['armorUniformity',
    'structureUniformity',
    'uniformity',
    'shieldUniformity',
    'Tech Level'
];

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.run = (message, config, edItem) => {

    console.log('Displaying ItemId: ' + edItem.typID);

    let ed_name = edItem.name.en;
    const ed_link = config.wikidomain + edItem.typID;
    const ed_thumb = config.thumbrooturl + '/?width=80&imageidx=' + edItem.typID;
    const ed_image = config.thumbrooturl + '/?width=399&height=300&imageidx=' + edItem.typID;

    let ed_type = edItem.raceName + ' / ' + edItem.grpName;


    let description = '';
    description += '*' + edItem.description.en + '*';

    // Process Bonuses

    let typeBonusText = '';
    if (edItem.typeBonusName) {
        for (let typeBonusID in edItem.traits.types) {
            for (let bonusId in edItem.traits.types[typeBonusID]) {
                typeBonusText += edItem.traits.types[typeBonusID][bonusId].bonus ? '★ ' + edItem.traits.types[typeBonusID][bonusId].bonus + '% ' : '★ ';
                typeBonusText += edItem.traits.types[typeBonusID][bonusId].bonusText.en + ".\n";
            }
        }
    }

    let roleBonusText = '';
    if (edItem.traits.roleBonuses) {
        for (let i = 0; i < edItem.traits.roleBonuses.length; i++) {
            roleBonusText += edItem.traits.roleBonuses[i].bonus ? '★ ' + edItem.traits.roleBonuses[i].bonus + '% ' : '★ ';
            roleBonusText += edItem.traits.roleBonuses[i].bonusText.en + "\n";
        }
    }

    let miscBonusText = '';
    if (edItem.traits.miscBonuses) {
        for (let i = 0; i < edItem.traits.miscBonuses.length; i++) {
            miscBonusText += edItem.traits.miscBonuses[i].bonus ? '★ ' + edItem.traits.miscBonuses[i].bonus + '% ' : '★ ';
            miscBonusText += edItem.traits.miscBonuses[i].bonusText.en + "\n";
        }
    }

    // Process Attributes

    let attributesText = [];
    let attributeName = [];
    for (var attrIdx in edItem.attributes) {
        const catID = edItem.attributes[attrIdx].categoryID;

        const attributeRawName = edItem.attributes[attrIdx].displayName;

        // Inject Tech Level Attribute on top
        if (attributeRawName.includes('Tech Level')) {
            ed_type += ' / Tech ' + edItem.attributes[attrIdx].value;
        }

        const excluded = excludedAttributes.includes(attributeRawName);
        if (!excluded) {

            attributeName[catID] = attributeRawName.substring(0, 30).split(' ').join('_');
            if (config.eimojis[attributeName[catID]]) {
                attributeName[catID] = config.eimojis[attributeName[catID]] + ' ';
            } else {
                if (edItem.attributes[attrIdx].value) {
                    attributeName[catID] += ": ";
                }
            }
            if (!attributesText[catID]) {
                attributesText[catID] = '';
            }
            attributesText[catID] += attributeName[catID] + edItem.attributes[attrIdx].value + ' ' + (edItem.attributes[attrIdx].unit ? edItem.attributes[attrIdx].unit : '') + "\n";
        }
    }

    if (edItem.basePrice) {
        ed_name += ' ' + config.eimojis['Isk'] + ' ' + numberWithCommas(edItem.basePrice) + " ISK";
    }


    // ---- Display all infos using RichEmbed

    const embed = new discord.RichEmbed()
        .setAuthor(ed_type, '')
        .setTitle(config.eimojis[edItem.raceName] + ' ' + ed_name)
        .setColor('#00AE86')
        //.setDescription(description)
        //.setThumbnail(ed_thumb)
        .setURL(ed_link)
        .setImage(ed_image);


    embed.addField('General:', config.eimojis['Mass'] + " " + numberWithCommas(edItem.mass) + " kg\n" +
        config.eimojis['Volume'] + " " + numberWithCommas(edItem.volume) + " m3\n" +
        config.eimojis['Cargo_Capacity'] + " " + numberWithCommas(edItem.capacity) + ' m3', true);

    embed.addField('Capacitor', attributesText[5], true);
    embed.addField('Drones', attributesText[10], true);

    // Display Bonuses

    if (typeBonusText) {
        embed.addField(edItem.typeBonusName + ' skill bonuses: (per skill level)', typeBonusText, false);
    }
    if (roleBonusText) {
        embed.addField('Role bonuses:', roleBonusText, false);
    }
    if (miscBonusText) {
        embed.addField('Misc bonuses:', miscBonusText, false);
    }


    embed.addField('Fitting', attributesText[1], true);
    embed.addField('Targetting', attributesText[6], true);
    embed.addField('Shield', attributesText[2], true);
    embed.addField('Armor', attributesText[3], true);
    embed.addField('Structure', attributesText[4], true);
    embed.addField('Required Skills', attributesText[8], true);
    embed.addField('Miscellaneous', attributesText[7], true);

    return embed;
}
