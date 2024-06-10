const db = require('../database/databaseConfig');
const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'setup'

/**
 * Creates the global setup
 * @param year
 * @param monthBudget
 * @param typesBudget
 * @returns {Promise<boolean>}
 */
async function createSetUp(year, monthBudget, typesBudget) {

    const result = await db.getDatabase().collection(COLLECTION).insertOne({
        year: year,
        monthBudget: monthBudget,
        typesBudget: typesBudget
    })


    if (result.insertedId) {
        return true;
    }

    return false;
}

/**
 * Queries the global set up for a year
 * @param year
 * @returns {Promise<{_id}|*|null>}
 */
async function getSetUpByYear(year) {
    const result = await db.getDatabase().collection(COLLECTION).findOne({year: year});

    if (result._id) {
        return result;
    }

    return null;
} // end of getSetUPByYear

/**
 * modifies the global setup for a year
 * @param year
 * @param monthBudget
 * @param typesBudget
 * @returns {Promise<boolean>}
 */
async function modifySetUpByYear(year, monthBudget, typesBudget) {
    const result = await db.getDatabase().collection(COLLECTION).updateOne({
        year: year
    }, {$set: {monthBudget: monthBudget, typesBudget: typesBudget}});

    if (result.modifiedCount === 1) {
        console.log(`Global set up modified`);
        return true;
    }
    return false;
}

module.exports = {
    getSetUpByYear: getSetUpByYear,
    modifySetUpByYear: modifySetUpByYear
}
