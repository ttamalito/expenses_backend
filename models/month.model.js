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



module.exports = {
    createMonth: createMonth
}