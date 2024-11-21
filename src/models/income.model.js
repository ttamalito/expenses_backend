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

/**
 * Queries all the incomes for a given year.
 *
 * @param {number} year - The year for which incomes are queried.
 * @return {Promise<Array>} A promise that resolves to an array of incomes for the given year.
 */
async function queryAllIncomesOfAYear(year) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        year: year
    })
    return result.toArray();
}

/**
 * Queries the total amount earned for a given year
 * @param {number} year
 * @returns {Promise<number>}
 */
async function queryTotalEarnedForAYear(year) {
    const incomes = await queryAllIncomesOfAYear(year);
    let total = 0;
    for (const income of incomes) {
        total += income.amount;
    }
    return total;
}

/**
 * Queries the total amount earned for a given month
 * @param month
 * @param year
 * @returns {Promise<number>}
 */
async function queryTotalEarnedForAMonth(month, year) {
    const incomes = await queryIncomesByMonthAndYear(month, year);
    if (!incomes) {
        return 0;
    }
    let total = 0;
    for (const income of incomes) {
        total += income.amount;
    }
    return total;
}

async function queryTotalEarnedForAYearInAMonthlyBasis(year) {
    let result = [];

    for (let i = 1; i <= 12; i++) {
        const total = await queryTotalEarnedForAMonth(i, year);
        result.push({month: i, total: total});
    }
    return result;
}


module.exports = {
    getIncomeById,
    createIncome,
    queryIncomesByMonthAndYear,
    queryAllIncomesOfAYear,
    queryTotalEarnedForAYear,
    queryTotalEarnedForAMonth,
    queryTotalEarnedForAYearInAMonthlyBasis
}
