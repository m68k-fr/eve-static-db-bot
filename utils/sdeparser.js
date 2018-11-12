const yaml = require('js-yaml');
const fs = require('fs');
const striptags = require('striptags');

const items = [];
let itemCount = {Ships: 0, Modules: 0, Blueprints: 0};

exports.getItems = function () {
    return items;
};

exports.getItemCount = function () {
    return itemCount;
};

exports.parse = function () {

    const unitLengthID = 1;
    const unitMilliseconds = 101;
    const unitInverseAbsolutePercentID = 108;
    const unitTypeID = 116;
    const unitAbsolutePercent = 127;

    const requiredSkillCategoryID = 8;


    const requiredSkill1ID = 182;
    const requiredSkill2ID = 183;
    const requiredSkill3ID = 184;
    const requiredSkill4ID = 1285;
    const requiredSkill5ID = 1289;
    const requiredSkill6ID = 1290;
    const requiredSkill1LevelID = 277;
    const requiredSkill2LevelID = 278;
    const requiredSkill3LevelID = 279;
    const requiredSkill4LevelID = 1286;
    const requiredSkill5LevelID = 1287;
    const requiredSkill6LevelID = 1288;


    const sdePath = './datas/sde/';
    const typeIdPath = sdePath + 'fsd/typeIDs.yaml';
    const groupIdPath = sdePath + 'fsd/groupIDs.yaml';
    const categoryIdPath = sdePath + 'fsd/categoryIDs.yaml';
    const chrRacePath = sdePath + 'bsd/chrRaces.yaml';

    const eveUnitPath = sdePath + 'bsd/eveUnits.yaml';

    const dgmAttributeTypePath = sdePath + 'bsd/dgmAttributeTypes.yaml';
    const dgmTypeAttributePath = sdePath + 'bsd/dgmTypeAttributes.yaml';

    const iconIDPath = sdePath + 'fsd/iconIDs.yaml';

    try {

        // Load Races

        const chrRaces = yaml.safeLoad(fs.readFileSync(chrRacePath, 'utf8'));
        let races = [];
        for (let currRace in chrRaces) {
            races[chrRaces[currRace].raceID] = chrRaces[currRace];
        }

        // Load units

        const eveUnits = yaml.safeLoad(fs.readFileSync(eveUnitPath, 'utf8'));
        let units = [];
        for (let currUnit in eveUnits) {
            units[eveUnits[currUnit].unitID] = eveUnits[currUnit];
        }

        // Load Item Attributes

        const dgmAttributeTypes = yaml.safeLoad(fs.readFileSync(dgmAttributeTypePath, 'utf8'));
        let attributeTypes = [];
        for (let currAttributeTypes in dgmAttributeTypes) {
            attributeTypes[dgmAttributeTypes[currAttributeTypes].attributeID] = dgmAttributeTypes[currAttributeTypes];
        }
        const dgmTypeAttributes = yaml.safeLoad(fs.readFileSync(dgmTypeAttributePath, 'utf8'));


        // Load Icons

        const iconIDs = yaml.safeLoad(fs.readFileSync(iconIDPath, 'utf8'));

        // Import Items (Only ships catID=6)

        const shipCatID = 6;
        const moduleCatID = 7;
        const blueprintCatID = 9;
        const typeIDs = yaml.safeLoad(fs.readFileSync(typeIdPath, 'utf8'));
        const groupIDs = yaml.safeLoad(fs.readFileSync(groupIdPath, 'utf8'));
        const categoryIDs = yaml.safeLoad(fs.readFileSync(categoryIdPath, 'utf8'));

        for (const typID in typeIDs) {

            const currType = typeIDs[typID];
            const grpID = currType.groupID;
            const catID = groupIDs[grpID].categoryID;
            const catName = categoryIDs[catID].name.en;
            const grpName = groupIDs[grpID].name.en;


            // -------- Process Ships

            if (catName.includes("Ship")) {
                if (currType.name.en)   // prevent a YAML error: item Id 48420 doesnt provide an English name
                {
                    if ((currType.published) && (catID == shipCatID)) {

                        // sanitize description text

                        if (currType.description) {
                            currType.description.en = striptags(currType.description.en);
                        }

                        // sanitize bonuses text & get Bonus type Label

                        let skillBonusName = '';
                        if (currType.traits) {
                            if (currType.traits.types) {
                                for (let skillBonus in currType.traits.types) {
                                    skillBonusName = typeIDs[skillBonus].name.en;
                                    for (let bonusId in currType.traits.types[skillBonus]) {
                                        currType.traits.types[skillBonus][bonusId].bonusText.en = striptags(currType.traits.types[skillBonus][bonusId].bonusText.en);
                                        currType.traits.types[skillBonus][bonusId].skill = skillBonusName;
                                        if (currType.traits.types[skillBonus][bonusId].unitID) {
                                            currType.traits.types[skillBonus][bonusId].unit = units[currType.traits.types[skillBonus][bonusId].unitID].displayName;
                                        }
                                    }
                                }
                            }

                            if (currType.traits.roleBonuses) {
                                for (let i = 0; i < currType.traits.roleBonuses.length; i++) {
                                    currType.traits.roleBonuses[i].bonusText.en = striptags(currType.traits.roleBonuses[i].bonusText.en);
                                    if (currType.traits.roleBonuses[i].unitID) {
                                        currType.traits.roleBonuses[i].unit = units[currType.traits.roleBonuses[i].unitID].displayName;
                                    }
                                }
                            }

                            if (currType.traits.miscBonuses) {
                                for (let i = 0; i < currType.traits.miscBonuses.length; i++) {
                                    currType.traits.miscBonuses[i].bonusText.en = striptags(currType.traits.miscBonuses[i].bonusText.en);
                                }
                            }
                        }

                        // Get Item Attributes

                        const attributes = [];

                        for (const currIdx in dgmTypeAttributes) {
                            if (dgmTypeAttributes[currIdx].typeID == typID) {

                                attributes[dgmTypeAttributes[currIdx].attributeID] = dgmTypeAttributes[currIdx];
                                if (attributes[dgmTypeAttributes[currIdx].attributeID].hasOwnProperty('valueInt')) {
                                    attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].valueInt;
                                }
                                else {
                                    attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].valueFloat;
                                }

                                let displayName = attributeTypes[dgmTypeAttributes[currIdx].attributeID].displayName;
                                if (!displayName) {
                                    displayName = attributeTypes[dgmTypeAttributes[currIdx].attributeID].attributeName;
                                }
                                attributes[dgmTypeAttributes[currIdx].attributeID].displayName = displayName;

                                const categoryID = attributeTypes[dgmTypeAttributes[currIdx].attributeID].categoryID;
                                attributes[dgmTypeAttributes[currIdx].attributeID].categoryID = categoryID;


                                // Get unit and convert value if needed
                                let unit = '';
                                if (attributeTypes[dgmTypeAttributes[currIdx].attributeID].unitID) {
                                    unit = units[attributeTypes[dgmTypeAttributes[currIdx].attributeID].unitID].displayName;
                                    switch (attributeTypes[dgmTypeAttributes[currIdx].attributeID].unitID) {
                                        case unitLengthID:
                                            if (attributes[dgmTypeAttributes[currIdx].attributeID].value > 999) {
                                                attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].value / 1000;
                                                unit = 'km';
                                            }
                                            break;

                                        case unitMilliseconds:
                                            attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].value / 1000;
                                            break;

                                        case unitInverseAbsolutePercentID:
                                            attributes[dgmTypeAttributes[currIdx].attributeID].value = Math.round((1 - attributes[dgmTypeAttributes[currIdx].attributeID].value) * 100);
                                            break;

                                        case unitAbsolutePercent:
                                            attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].value * 100;
                                            break;

                                        case unitTypeID:
                                            if (categoryID != requiredSkillCategoryID) {
                                                attributes[dgmTypeAttributes[currIdx].attributeID].value = typeIDs[attributes[dgmTypeAttributes[currIdx].attributeID].value].name.en;
                                                unit = '';
                                            }
                                            break;

                                    }
                                }
                                attributes[dgmTypeAttributes[currIdx].attributeID].unit = unit;
                            }
                        }

                        /*if (typID == 23913) {
                            console.log("debug here");
                        }*/

                        // Process required skills

                        for (const attributeID in attributes) {

                            if (attributes[attributeID].categoryID == requiredSkillCategoryID) {

                                const skillID = attributes[attributeID].value;
                                if (skillID > 5) {
                                    const skill = typeIDs[skillID];
                                    switch (attributes[attributeID].attributeID) {
                                        case requiredSkill1ID:
                                            attributes[attributeID].value = attributes[requiredSkill1LevelID].value;
                                            delete attributes[277];
                                            break;
                                        case requiredSkill2ID:
                                            attributes[attributeID].value = attributes[requiredSkill2LevelID].value;
                                            delete attributes[278];
                                            break;
                                        case requiredSkill3ID:
                                            attributes[attributeID].value = attributes[requiredSkill3LevelID].value;
                                            delete attributes[279];
                                            break;
                                        case requiredSkill4ID:
                                            attributes[attributeID].value = attributes[requiredSkill4LevelID].value;
                                            delete attributes[1286];
                                            break;
                                        case requiredSkill5ID:
                                            attributes[attributeID].value = attributes[requiredSkill5LevelID].value;
                                            delete attributes[1287];
                                            break;
                                        case requiredSkill6ID:
                                            attributes[attributeID].value = attributes[requiredSkill6LevelID].value;
                                            delete attributes[1288];
                                            break;
                                    }
                                    attributes[attributeID].displayName = skill.name.en;
                                    attributes[attributeID].unit = '';
                                }
                            }
                        }

                        // store ship infos

                        items[typID] = currType;
                        items[typID].attributes = attributes;
                        items[typID].queryName = currType.name.en;
                        items[typID].catName = catName;
                        items[typID].grpName = grpName;
                        items[typID].typID = typID;
                        items[typID].skillBonusName = skillBonusName;
                        if (currType.raceID) {
                            const raceName = races[currType.raceID].raceName;
                            items[typID].raceName = raceName;
                        }
                        itemCount.Ships++;

                    }
                }
            }


            // -------- Process Modules

            if (catName.includes("Module")) {

                if (currType.name.en)   // prevent a YAML error: item Id 48420 doesnt provide an English name
                {
                    if ((currType.published) && (catID == moduleCatID)) {

                        let iconFile = '';
                        if (currType.iconID) {
                            iconFile = iconIDs[currType.iconID].iconFile;
                            iconFile = iconFile.split('/').pop().replace(/\.[^/.]+$/, '');
                        }

                        // store Module infos

                        items[typID] = currType;
                        //items[typID].attributes = attributes;
                        items[typID].queryName = currType.name.en;
                        items[typID].catName = catName;
                        items[typID].grpName = grpName;
                        items[typID].typID = typID;
                        items[typID].iconFile = iconFile;
                        itemCount.Modules++;

                    }
                }
            }

            // -------- Process Blueprint

            if (catName.includes("Blueprint")) {

                if (currType.name.en)   // prevent a YAML error: item Id 48420 doesnt provide an English name
                {
                    if ((currType.published) && (catID == blueprintCatID)) {

                        let iconFile = '';
                        if (currType.iconID) {
                            iconFile = iconIDs[currType.iconID].iconFile;
                            iconFile = iconFile.split('/').pop().replace(/\.[^/.]+$/, '');
                        }

                        // store Module infos

                        items[typID] = currType;
                        //items[typID].attributes = attributes;
                        items[typID].queryName = currType.name.en;
                        items[typID].catName = catName;
                        items[typID].grpName = grpName;
                        items[typID].typID = typID;
                        items[typID].iconFile = iconFile;
                        itemCount.Blueprints++;

                    }
                }
            }
        }

        console.log("Bot is ready, SDE YAML processed: " + itemCount.Ships + " ships, " + itemCount.Modules + " modules, " + itemCount.Blueprints + " blueprints.");

    } catch (e) {
        console.log(e);
    }
};