const ObjectId = require('mongodb').ObjectId;
const arrayContainsObjectId = require('./arrayContainsObjectId');
/**
 * Returns all the expenses that belong to that month and year
 * It filters them based on the id
 * @param {number} month
 * @param {number} year
 * @param {[ObjectId]} expensesOfTheMonth
 * @param {[Object]}expensesOfAType
 */
function queryExpensesForAMonth(expensesOfTheMonth, expensesOfAType) {
    const finalExpenses = [];
    for (const expenseOfAType of expensesOfAType) {
        if (arrayContainsObjectId(expensesOfTheMonth, expenseOfAType._id.toString()))
            finalExpenses.push(expensesOfAType); // add the expense because it belongs to the month
    }
    // return the finalExpenses
    return finalExpenses;
} // end of queryExpensesForAMonth


module.exports = {
    queryExpensesForAMonth: queryExpensesForAMonth
}