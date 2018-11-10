const yaml = require('js-yaml');
const fs = require('fs');
const striptags = require('striptags');

const ships = [];


exports.getShips = function () {
    return ships;
};

exports.parse = function () {


    const sdePath = './datas/sde/';
    const typeIdPath = sdePath + 'fsd/typeIDs.yaml';
    const groupIdPath = sdePath + 'fsd/groupIDs.yaml';
    const categoryIdPath = sdePath + 'fsd/categoryIDs.yaml';
    const chrRacePath = sdePath + 'bsd/chrRaces.yaml';

    const eveUnitPath = sdePath + 'bsd/eveUnits.yaml';
    const dgmAttributeTypePath = sdePath + 'bsd/dgmAttributeTypes.yaml';
    const dgmTypeAttributePath = sdePath + 'bsd/dgmTypeAttributes.yaml';

    try {

        // Load Races

        const chrRaces = yaml.safeLoad(fs.readFileSync(chrRacePath, 'utf8'));
        let races = [];
        for (let currRace in chrRaces) {
            races[chrRaces[currRace].raceID] = chrRaces[currRace];
        }

        // Load Item Attributes

        const eveUnits = yaml.safeLoad(fs.readFileSync(eveUnitPath, 'utf8'));
        let units = [];
        for (let currUnit in eveUnits) {
            units[eveUnits[currUnit].unitID] = eveUnits[currUnit];
        }

        const dgmAttributeTypes = yaml.safeLoad(fs.readFileSync(dgmAttributeTypePath, 'utf8'));
        let attributeTypes = [];
        for (let currAttributeTypes in dgmAttributeTypes) {
            attributeTypes[dgmAttributeTypes[currAttributeTypes].attributeID] = dgmAttributeTypes[currAttributeTypes];
        }

        const dgmTypeAttributes = yaml.safeLoad(fs.readFileSync(dgmTypeAttributePath, 'utf8'));

        // Import Items (Only ships catID=6)

        const shipCatID = 6;
        const typeIDs = yaml.safeLoad(fs.readFileSync(typeIdPath, 'utf8'));
        const groupIDs = yaml.safeLoad(fs.readFileSync(groupIdPath, 'utf8'));
        const categoryIDs = yaml.safeLoad(fs.readFileSync(categoryIdPath, 'utf8'));

        let nbShips = 0;
        for (const typID in typeIDs) {

            const currType = typeIDs[typID];

            const grpID = currType.groupID;
            const catID = groupIDs[grpID].categoryID;
            const catName = categoryIDs[catID].name.en;
            const grpName = groupIDs[grpID].name.en;

            if (currType.name.en)   // prevent a YAML error: item Id 48420 doesnt provide an English name
            {
                if ((currType.published) && (catID == shipCatID)) {

                    // sanitize description text

                    if (currType.description) {
                        currType.description.en = striptags(currType.description.en);
                    }

                    // sanitize bonuses text & get Bonus type Label

                    let typeBonusName = '';
                    if (currType.traits) {

                        if (currType.traits.types) {
                            for (let typeBonus in currType.traits.types) {
                                typeBonusName = typeIDs[typeBonus].name.en;
                                for (let bonusId in currType.traits.types[typeBonus]) {
                                    currType.traits.types[typeBonus][bonusId].bonusText.en = striptags(currType.traits.types[typeBonus][bonusId].bonusText.en);
                                }
                            }
                        }

                        if (currType.traits.roleBonuses) {
                            for (let i = 0; i < currType.traits.roleBonuses.length; i++) {
                                currType.traits.roleBonuses[i].bonusText.en = striptags(currType.traits.roleBonuses[i].bonusText.en);
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


                            let unit = '';
                            if (attributeTypes[dgmTypeAttributes[currIdx].attributeID].unitID) {
                                unit = units[attributeTypes[dgmTypeAttributes[currIdx].attributeID].unitID].displayName
                            }
                            attributes[dgmTypeAttributes[currIdx].attributeID].unit = unit;
                            // Convert meters to km if needed.
                            if ((attributes[dgmTypeAttributes[currIdx].attributeID].unit == 'm') && (attributes[dgmTypeAttributes[currIdx].attributeID].value > 1000)) {
                                attributes[dgmTypeAttributes[currIdx].attributeID].unit = 'km';
                                attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].value / 1000;
                            }

                            // 's' unit is declared as ms, need to divide by 1000
                            if (attributes[dgmTypeAttributes[currIdx].attributeID].unit == 's') {
                                attributes[dgmTypeAttributes[currIdx].attributeID].value = attributes[dgmTypeAttributes[currIdx].attributeID].value / 1000;
                            }



                            // Required Skills
                            if (categoryID == 8) {
                                const skillID = attributes[dgmTypeAttributes[currIdx].attributeID].value;
                                if (skillID > 5) {
                                    const skill = typeIDs[skillID];

                                    attributes[dgmTypeAttributes[currIdx].attributeID].displayName = skill.name.en;
                                    attributes[dgmTypeAttributes[currIdx].attributeID].value = '';
                                    attributes[dgmTypeAttributes[currIdx].attributeID].unit = '';
                                }
                                else {
                                    delete attributes[dgmTypeAttributes[currIdx].attributeID];
                                    // todo: Get the required lvl for the skill and paste result to the corresponding skill entry (lvl1-lvl5)
                                }
                            }

                            // Damage Multiplier converted to %
                            if ((dgmTypeAttributes[currIdx].attributeID == 109) ||
                                (dgmTypeAttributes[currIdx].attributeID == 110) ||
                                (dgmTypeAttributes[currIdx].attributeID == 111) ||
                                (dgmTypeAttributes[currIdx].attributeID == 113) ||
                                (dgmTypeAttributes[currIdx].attributeID == 267) ||
                                (dgmTypeAttributes[currIdx].attributeID == 268) ||
                                (dgmTypeAttributes[currIdx].attributeID == 269) ||
                                (dgmTypeAttributes[currIdx].attributeID == 270) ||
                                (dgmTypeAttributes[currIdx].attributeID == 271) ||
                                (dgmTypeAttributes[currIdx].attributeID == 272) ||
                                (dgmTypeAttributes[currIdx].attributeID == 273) ||
                                (dgmTypeAttributes[currIdx].attributeID == 274)) {
                                attributes[dgmTypeAttributes[currIdx].attributeID].value = Math.round((1 - attributes[dgmTypeAttributes[currIdx].attributeID].value) * 100);
                            }
                        }
                    }

                    // store ship infos

                    ships[typID] = currType;
                    ships[typID].attributes = attributes;
                    ships[typID].queryName = currType.name.en;
                    ships[typID].catName = catName;
                    ships[typID].grpName = grpName;
                    ships[typID].typID = typID;
                    ships[typID].typeBonusName = typeBonusName;
                    if (currType.raceID) {
                        const raceName = races[currType.raceID].raceName;
                        ships[typID].raceName = raceName;
                    }
                    nbShips++;

                }
            }
        }

        console.log("Bot is ready, SDE YAML processed: " + nbShips + " ship registered.");

    } catch (e) {
        console.log(e);
    }
};