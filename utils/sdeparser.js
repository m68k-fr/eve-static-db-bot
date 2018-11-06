const yaml = require('js-yaml');
const fs = require('fs');
const striptags = require('striptags');

const ships = [];

exports.parse = function () {


    const sdePath = './datas/sde/';
    const typeIdPath = sdePath + 'fsd/typeIDs.yaml';
    const groupIdPath = sdePath + 'fsd/groupIDs.yaml';
    const categoryIdPath = sdePath + 'fsd/categoryIDs.yaml';
    const chrRacePath = sdePath + 'bsd/chrRaces.yaml';


    const blueprintsPath = sdePath + 'fsd/blueprints.yaml';

    try {

        // import blueprints

        /*var blueprints = yaml.safeLoad(fs.readFileSync(blueprintsPath, 'utf8'));

        var bpMap = [];
        for (var bp in blueprints) {

            if (blueprints[bp]['activities']['manufacturing']) {
                var products = blueprints[bp]['activities']['manufacturing']['products'];
                if (products) {
                    for (var i = 0; i < products.length; i++) {
                        bpMap[products[i].typeID] = bp;
                    }
                }
            }
        }*/


        // Races

        const chrRaces = yaml.safeLoad(fs.readFileSync(chrRacePath, 'utf8'));
        let races = [];
        for (var currRace in chrRaces) {
            races[chrRaces[currRace].raceID] = chrRaces[currRace];
        }

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

                    // store ship infos

                    ships[typID] = currType;
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

        console.log("SDE YAML loaded: " + nbShips + " ship processed.");


        return ships;

    } catch (e) {
        console.log(e);
    }
};