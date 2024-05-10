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

/**
 *
 * @param {ObjectId} id
 * @param {ObjectId} expenseId
 * @returns {Promise<boolean>} true if successful
 */
async function addExpense(id, expenseId) {
    const result = await db.getDatabase().collection(COLLECTION).updateOne(
        {_id: id}, {$push: {expenses: expenseId}}
    );

    return result.modifiedCount === 1;
}



module.exports = {
    createMonth: createMonth,
    getAllExpenses: getAllExpenses
}