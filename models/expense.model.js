const db = require('../database/databaseConfig');

const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'expenses'

/**
 * Saves an expense to the database
 * @param amount
 * @param month
 * @param type
 * @param notes
 * @param year
 * @param date
 * @returns {Promise<any>}
 */
async function createExpense(amount, month, type, notes, year, date) {
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
async function getExpenseById(id){
    const result  = await db.getDatabase().collection(COLLECTION).findOne(
        {_id: id}
    );
    return result;
}

/**
 * Queries all the expenses of a given type
 * @param {string} type
 * @returns {Promise<*>}
 */
async function getExpensesOfAType(type) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        type: type
    })

    return result.toArray();
}

/**
 * Queries all the expenses for a given year.
 *
 * @param {number} year - The year for which expenses are queried
 * @return {Promise<Array>} An array of expenses for the given year
 */
async function getAllExpensesForAYear(year) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        year: year
    })

    return result.toArray();
}

/**
 * Queries all the expenses for a given year and type.
 *
 * @param {number} year - The year for which expenses are queried
 * @param {string} type - The type of expenses to query
 * @return {Promise<Array>} An array of expenses for the given year and type
 */
async function getExpensesForAYearOfAType(year, type) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        year: year,
        type: type
    })

    return result.toArray();
}

/**
 * Calculates the total amount spent on expenses for a specific year.
 *
 * @param {number} year - The year for which the total spent is calculated
 * @return {number} The total amount spent on expenses for the given year
 */
async function getTotalSpentOnAYear(year) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        year: year
    });
    let total = 0;
    for (let expense of result) {
        total = total + expense.amount;

    }
    return total;

}

module.exports = {
    createExpense: createExpense,
    getExpenseById: getExpenseById,
    getExpensesOfAType: getExpensesOfAType,
    getAllExpensesForAYear: getAllExpensesForAYear,
    getExpensesForAYearOfAType: getExpensesForAYearOfAType,
    getTotalSpentOnAYear: getTotalSpentOnAYear
}