const db = require('../database/databaseConfig');
const ObjectId = require('mongodb').ObjectId;
const expensesModel = require('./expense.model');
const COLLECTION = 'months'

/**
 *
 * @param month
 * @param year
 * @param {number} maxBudget
 * @param {Object} typesBudget
 * @returns {Promise<boolean>}
 */
async function createMonth(month, year, maxBudget, typesBudget) {

    const result = await db.getDatabase().collection(COLLECTION).insertOne({
        month: month,
        year: year,
        budget: maxBudget,
        typesBudget: typesBudget,
        expenses: [],
        incomes: []
    })


    if (result.insertedId) {
        return true;
    }

    return false;
}

/**
 * @param {ObjectId} monthId
 * @returns {Promise<[ObjectId]>}
 */
async function getAllExpenses(monthId) {
    const result = await db.getDatabase().collection(COLLECTION).findOne(
        {_id: monthId});

    return result.expenses;
}

/**
 * Queries the list of incomes
 * @param {ObjectId} monthId
 * @returns {Promise<[]>}
 */
async function getAllIncomes(monthId) {
    const result = await db.getDatabase().collection(COLLECTION).findOne(
        {_id: monthId});

    return result.incomes;
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

/**
 *
 * @param {ObjectId} id
 * @param {ObjectId} expenseId
 * @returns {Promise<boolean>} true if successful
 */
async function addIncome(id, expenseId) {
    const result = await db.getDatabase().collection(COLLECTION).updateOne(
        {_id: id}, {$push: {incomes: expenseId}}
    );

    return result.modifiedCount === 1;
}

/**
 *
 * @param {number} month
 * @param {number} year
 * @returns {Promise<ObjectId>}
 */
async function getMonthIdByNumberAndYear(month, year) {
    const result = await db.getDatabase().collection(COLLECTION).findOne({
        month: month, year: year
    });

    if (result) {
        // there is something
        return result._id;
    }

    return null;
}

/**
 * Queries all the expenses of a given type for a month in a specific year.
 * @param month
 * @param year
 * @param type
 * @returns {Promise<void>}
 */
async function getExpensesOfAType(month, year, type) {
    const result = await db.getDatabase().collection(COLLECTION).find({
        month: month, year: year, type: type
    });

    // result should be converted to an array
    return result.toArray();

}

/**
 *
 * @param {ObjectId} id
 * @returns {Promise<*|null>}
 */
async function getMonth(id) {
    const result = await db.getDatabase().collection(COLLECTION).findOne({_id: id});
    if (!result) {
        return null;
    }

    return result;
}

/**
 * Queries the amount of money spent in a month
 * @param month
 * @param year
 * @returns {Promise<number | null>}
 */
async function queryTotalSpentOnTheMonth(month, year) {
    const monthId = await getMonthIdByNumberAndYear(month, year);

    if (!monthId) {
        return null;
    }

    const allExpenses = await getAllExpenses(monthId);

    if (!allExpenses) {
        return null;
    }

    if (allExpenses.length === 0) {
        return 0;
    }

    let total = 0;
    for (let i = 0; i < allExpenses.length; i++) {
        const expense = await expensesModel.getExpenseById(allExpenses[i]);
        total += expense.amount;
    }

    return total;
}

/**
 * Queries the amount of money spent in a month for a single type
 * @param {number} month
 * @param {number} year
 * @param {string} type
 * @returns {Promise<number | null>}
 */
async function queryTotalSpentOnTheMonthForAType(month, year, type) {
    const monthId = await getMonthIdByNumberAndYear(month, year);

    if (!monthId) {
        return null;
    }

    const allExpenses = await getAllExpenses(monthId);

    if (!allExpenses) {
        return null;
    }

    if (allExpenses.length === 0) {
        return 0;
    }

    let total = 0;
    for (let i = 0; i < allExpenses.length; i++) {
        const expense = await expensesModel.getExpenseById(allExpenses[i]);
        if (expense.type === type) {
            total += expense.amount;
        }
    }

    return total;
}

/**
 * Removes an expense from the month
 * @param {ObjectId} expenseId
 * @returns {Promise<boolean>}
 */
async function removeExpense(expenseId) {
    const result = await db.getDatabase().collection(COLLECTION).updateMany(
        {}, {$pull: {expenses: expenseId}}
    );

    return result.modifiedCount === 1;
}


module.exports = {
    createMonth: createMonth,
    getAllExpenses: getAllExpenses,
    addExpense: addExpense,
    getMonthIdByNumberAndYear: getMonthIdByNumberAndYear,
    getMonth: getMonth,
    getAllIncomes,
    addIncome,
    queryTotalSpentOnTheMonth,
    queryTotalSpentOnTheMonthForAType,
    removeExpense
}