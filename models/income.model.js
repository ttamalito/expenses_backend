const db = require('../database/databaseConfig');

const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'incomes'

/**
 * Saves an income to the database
 * @param amount
 * @param month
 * @param type
 * @param notes
 * @param year
 * @param date
 * @returns {Promise<any>}
 */
async function createIncome(amount, month, type, notes, year, date) {
    const result = await db.getDatabase().collection(COLLECTION).insertOne({
        amount: amount,
        type: type,
        notes: notes,
        month: month,
        year: year,
        date: date
    })

    return result.insertedId
}

/**
 *
 * @param {ObjectId} id
 * @returns {Promise<void>} the object with the data
 */
async function getIncomeById(id){
    const result  = await db.getDatabase().collection(COLLECTION).findOne(
        {_id: id}
    );
    return result;
}

module.exports = {
    getIncomeById,
    createIncome
}
