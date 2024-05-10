const db = require('../database/databaseConfig');
const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'months'

async function createMonth(month, year) {

    const result = await db.getDatabase().collection(COLLECTION).insertOne({
        month: month,
        year: year,
        expenses: []
    })


    if (result.insertedId) {
        return true;
    }

    return false;
}

/**
 *
 * @returns {Promise<[ObjectId]>}
 */
async function getAllExpenses() {
    const result = await db.getDatabase().collection(COLLECTION).find({});

    return result.toArray();
}



module.exports = {
    createMonth: createMonth,
    getAllExpenses: getAllExpenses
}