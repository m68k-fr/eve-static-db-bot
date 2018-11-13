const discord = require('discord.js');

const excludedAttributes = [
    'armorUniformity',
    'structureUniformity',
    'uniformity',
    'shieldUniformity',
    'Tech Level',
    'scanSpeed',
    'CPU Need Bonus',
    'Theoretical Maximum Targeting Range',
    'fighterAbilityAntiCapitalMissileResistance',
    'fighterAbilityKamikazeResistance',
    'Entosis Assistance Impedance',
    'hasShipMaintenanceBay',
    'hasFleetHangars'
];

// ---- Special Atrribut IDs

const attrshipWarpSpeed = 1281;
const attrWarpSpeedMultiplier = 600;
const attrFuelBayCapacity = 1549;


// ---- Attribute Category IDs

const catFitting = 1;
const catShield = 2;
const catArmor = 3;
const catStructure = 4;
const catCapacitor = 5;
const catTargeting = 6;
const catMiscellaneous = 7;
const catSkills = 8;
const catDrones = 10;
const catPropulsion = 17;
const catEWResistance = 36;
const catFighterAttributes = 38;
const catSharedFacilities = 40;  // Hangars&Bays
const catJumpDriveSystems = 999;


const padBigNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

exports.run = (message, config, edItem) => {

    let ed_name = edItem.name.en;
    const ed_link = config.wikidomain + edItem.typID;
    const ed_image = config.thumbrooturl + '/?type=render&width=256&height=256&imageidx=' + edItem.typID;

    let ed_type = edItem.raceName + ' Ship / ' + edItem.grpName;

    // Process Bonuses

    let skillBonusText = [];
    let skillBonusName = [];
    for (let typeBonusID in edItem.traits.types) {
        skillBonusText[typeBonusID] = '';
        for (let bonusId in edItem.traits.types[typeBonusID]) {
            skillBonusName[typeBonusID] = edItem.traits.types[typeBonusID][bonusId].skill;
            skillBonusText[typeBonusID] += edItem.traits.types[typeBonusID][bonusId].bonus ? '★ ' + edItem.traits.types[typeBonusID][bonusId].bonus + edItem.traits.types[typeBonusID][bonusId].unit + ' ' : '★ ';
            skillBonusText[typeBonusID] += edItem.traits.types[typeBonusID][bonusId].bonusText.en + ".\n";
        }
    }

    let roleBonusText = '';
    if (edItem.traits.roleBonuses) {
        for (let i = 0; i < edItem.traits.roleBonuses.length; i++) {
            roleBonusText += edItem.traits.roleBonuses[i].bonus ? '★ ' + edItem.traits.roleBonuses[i].bonus + edItem.traits.roleBonuses[i].unit + ' ' : '★ ';
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

    // ---- Process Attributes

    let attributesText = [];
    let attributeName = [];

    // merge global attributes to structure category

    attributesText[catStructure] = config.eimojis['Mass'] + ' ' + padBigNumber(edItem.mass) + " kg\n" +
        config.eimojis['Volume'] + " " + padBigNumber(edItem.volume) + " m3\n" +
        config.eimojis['Cargo_Capacity'] + " " + padBigNumber(edItem.capacity) + ' m3\n';



    // Move attributes to the needed category before processing

    if (edItem.attributes[attrFuelBayCapacity]) {
        edItem.attributes[attrFuelBayCapacity].categoryID = catJumpDriveSystems;
    }


    for (var attrIdx in edItem.attributes) {
        const catID = edItem.attributes[attrIdx].categoryID;

        const attributeRawName = edItem.attributes[attrIdx].displayName;

        // Inject Tech Level Attribute on top
        if (attributeRawName.includes('Tech Level')) {
            ed_type += ' / Tech ' + edItem.attributes[attrIdx].value;
        }

        const excluded = excludedAttributes.includes(attributeRawName);

        if (!excluded) {

            attributeName[catID] = attributeRawName.substring(0, 30);
            const eimojiTag = attributeName[catID].split(' ').join('_');

            if (config.eimojis[eimojiTag]) {
                attributeName[catID] = config.eimojis[eimojiTag] + ' ';
            } else {
                attributeName[catID] += ": ";
            }
            if (!attributesText[catID]) {
                attributesText[catID] = '';
            }

            // Pad big numbers
            if (edItem.attributes[attrIdx].value > 9999) {
                edItem.attributes[attrIdx].value = padBigNumber(edItem.attributes[attrIdx].value);
            }

            // Add a generic skillBook icon
            if (catID == catSkills) {
                attributesText[catID] += config.eimojis['Skill_Book'] + ' ';
            }

            // Copy Miscellaneous Attribute to the needed category
            if (catID == catMiscellaneous) {
                let copycatID = 0;
                switch (attributeRawName) {
                    case "Maximum Jump Clones":
                        copycatID = catSharedFacilities;
                        break;
                    case "Jump Drive Capacitor Need":
                    case "Maximum Jump Range":
                    case "Jump Drive Fuel Need":
                    case "Jump Drive Consumption Amount":
                    case "Fuel Bay Capacity":
                        copycatID = catJumpDriveSystems;
                        break;
                }
                if (copycatID) {
                    if (!attributesText[copycatID]) {
                        attributesText[copycatID] = '';
                    }
                    attributesText[copycatID] += attributeName[catID] + edItem.attributes[attrIdx].value + ' ' + (edItem.attributes[attrIdx].unit ? edItem.attributes[attrIdx].unit : '') + "\n";
                }
            }

            attributesText[catID] += attributeName[catID] + edItem.attributes[attrIdx].value + ' ' + (edItem.attributes[attrIdx].unit ? edItem.attributes[attrIdx].unit : '') + "\n";
        }
    }

    if (edItem.basePrice) {
        ed_name += ' ' + config.eimojis['Base_Price'] + ' ' + padBigNumber(edItem.basePrice) + " ISK";
    }

    // Special case for Ship Warp Speed
    if (edItem.attributes[attrshipWarpSpeed] && edItem.attributes[attrWarpSpeedMultiplier]) {
        attributesText[catPropulsion] += ' ' + config.eimojis['Ship_Warp_Speed'] + ' ' + (edItem.attributes[attrshipWarpSpeed].value * edItem.attributes[attrWarpSpeedMultiplier].value) + ' AU/s';
    }


    // ---- Display all infos using RichEmbed

    const embed = new discord.RichEmbed()
        .setAuthor(ed_type, '')
        .setTitle(ed_name)
        .setColor('#00AE86')
        .setURL(ed_link)
        .setImage(ed_image);


    embed.addField('Capacitor', attributesText[catCapacitor], true);
    embed.addField('Drones', attributesText[catDrones], true);
    embed.addField('Required Skills', attributesText[catSkills], true);

    // Display Bonuses
    for (const skillBonusID in skillBonusName) {
        embed.addField(skillBonusName[skillBonusID] + ' skill bonuses (per skill level)', skillBonusText[skillBonusID], false);
    }
    if (roleBonusText) {
        embed.addField('Role bonuses', roleBonusText, false);
    }
    if (miscBonusText) {
        embed.addField('Misc bonuses', miscBonusText, false);
    }

    embed.addField('Fitting', attributesText[catFitting], true);
    embed.addField('Structure', attributesText[catStructure], true);
    embed.addField('Targeting', attributesText[catTargeting], true);
    embed.addField('Shield', attributesText[catShield], true);
    embed.addField('Armor', attributesText[catArmor], true);
    embed.addField('Propulsion', attributesText[catPropulsion], true);

    if (attributesText[catEWResistance]) {
        embed.addField('Electronic Resistances', attributesText[catEWResistance], true);
    }
    if (attributesText[catFighterAttributes]) {
        embed.addField('Fighter Squadron Facilities', attributesText[catFighterAttributes], true);
    }
    if (attributesText[catSharedFacilities]) {
        embed.addField('Shared Facilities', attributesText[catSharedFacilities], true);
    }
    if (attributesText[catJumpDriveSystems]) {
        embed.addField('Jump Drive Systems', attributesText[catJumpDriveSystems], true);
    }

    //embed.addField('Miscellaneous', attributesText[catMiscellaneous], true);

    return embed;
}
