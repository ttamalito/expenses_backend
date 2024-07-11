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

/**
 * Queries all the incomes for a given month and year
 * @param month
 * @param year
 * @returns {Promise<[]|null>} The array of incomes
 */
async function queryIncomesByMonthAndYear(month, year) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        month: month,
        year: year
    }).toArray();
    if (!result) {
        return null
    }
    return result;
} // end ofo queryIncomesByMonthAndYear

module.exports = {
    getIncomeById,
    createIncome,
    queryIncomesByMonthAndYear
}
