const db = require('../database/databaseConfig');

const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'expenses'

async function createExpense(amount, month, type, notes, year) {
    const result = await db.getDatabase().collection(COLLECTION).insertOne({
        amount: amount,
        type: type,
        notes: notes,
        month: month,
        year: year
    })

    return result.insertedId
}

/**
 *
 * @param {ObjectId} id
 * @returns {Promise<void>} the object with the data
 */
async function getExpenseById(id){
    const result  = await db.getDatabase().collection(COLLECTION).findOne(
        {_id: id}
    );
    return result;
}


module.exports = {
    createExpense: createExpense,
    getExpenseById: getExpenseById
}