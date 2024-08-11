
const getMonth = require('../utils/getMonth')
const expenseModel = require('../models/expense.model');
const monthModel = require('../models/month.model');
const queryExpensesOfAType = require('../utils/queryExpensesOfAType');
const incomeModel = require('../models/income.model');
const setUpModel = require('../models/setup.model');

/**
 * Adds an expense/income to the database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function addExpense(req, res, next) {

    let amount = parseFloat(req.body.amount);
    // amount should be greter than zero
    if (amount <= 0) {
        return res.json({result: false, message: 'Amount is negative'});
    }
    const month = Number(req.body.month);
    const year = Number(req.body.year);
    // verify that it is the correct month
    const correctMonth = getMonth(month);
    if (correctMonth === 'a') {
        res.json({result: false, message: 'Invalid Month'});
    }
    const type = req.body.type;
    const notes = req.body.notes;
    const date = req.body.date;
    // get the type of transaction
    const transaction = req.body.transaction;
    // check it amount should be converted to negative
    if (transaction === 'expense') {
        // make it negative
        amount = (-1) * amount;
    }
    // now that we have the data
    // save it to the data base
    let expenseId;
    if (transaction === 'expense') {
        expenseId = await expenseModel.createExpense(amount, month, type, notes, year,date);
    } else {
        // it is an income
        expenseId = await incomeModel.createIncome(amount, month, type, notes, year, date);
    }

    // now save it to the month
    const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);

    // check if null
    if (!monthId) {
        // there is nothing
        // create a new month
        // query the global set up from the database
        const setUp = await setUpModel.getSetUpByYear(2024);
        const monthResult = await monthModel.createMonth(month, year, setUp.monthBudget, setUp.typesBudget);
        if (monthResult) {
            // all gucci
            const monthId2 = await monthModel.getMonthIdByNumberAndYear(month, year);
            let saveResult;
            if (transaction === 'expense') {
                saveResult = await monthModel.addExpense(monthId2, expenseId)
            } else {
                saveResult = await monthModel.addIncome(monthId2, expenseId)
            }
            // check if it could not be saved
            if (!saveResult) {
                return res.json({result: false, message: 'CHeck backend'});
            }
        }
    } else {
        let saveResult;
        if (transaction === 'expense') {
            saveResult = await monthModel.addExpense(monthId, expenseId)
        } else {
            saveResult = await monthModel.addIncome(monthId, expenseId)
        }
        // check if it could not be saved
        if (!saveResult) {
            return res.json({result: false, message: 'CHeck backend'});
        }
    }

    // all gucci
    return res.json({result: true});
} // end of add expense

/**
 * Returns the expenses for a given month
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getExpensesForAMonth(req, res, next) {
    // get the month
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    // get the month
    const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);
    if (!monthId) {
        // there is nothing in the database
        return res.json({result: false, message: 'Not a valid month or year'});
    }

    // otherwise, get all the expense for that month
    const expensesIds = await monthModel.getAllExpenses(monthId);
    if (!expensesIds) {
        return res.json({result: false, message: 'No expenses for that month'})
    }

    const incomesIds = await monthModel.getAllIncomes(monthId);
    if (!incomesIds) {
        return res.json({result: false, message: 'Something went wrong while getting the incomes'})
    }
    // get the incomes
    const incomes = await Promise.all(incomesIds.map(async id => {
        return await incomeModel.getIncomeById(id)
    }))
    // get the expenses
    const expenses = await Promise.all(expensesIds.map(async id => {
        return await expenseModel.getExpenseById(id)
    }))

    // get the whole month
    const monthObject   = await monthModel.getMonth(monthId);
    // send the budgets

    // seems to be all good
    res.json({
        result: true,
        expenses: expenses,
        monthBudget: monthObject.budget,
        typesBudget: monthObject.typesBudget,
        incomes: incomes
    })
}

/**
 * Returns all the expenses of a single type for a month
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function getExpensesOfATypeForAMonth(req, res, next) {
    // get the type from the body, i.e. the form
    const type = req.body.type;
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    // return the incomes, if necessary
    if (type === 'income') {
        const incomesOfTheMonth = await incomeModel.queryIncomesByMonthAndYear(month, year);
        if (!incomesOfTheMonth) {
            // there is nothing in the database
            return res.status(400).json({result: false, message: 'Failed to query the incomes, check your request'});
        }
        return res.json({result: true, expenses: incomesOfTheMonth});
    }
    // query the data base
    const expensesOfAType = await expenseModel.getExpensesOfAType(type);
    // get all the expenses for a month
    const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);
    if (!monthId) {
        // there is nothing in the database
        return res.json({result: false, message: 'Not a valid month or year'});
    }
    const expensesOfTheMonth = await monthModel.getAllExpenses(monthId);

    // get all the expenses of the type for the month
    const finalExpenses = queryExpensesOfAType.queryExpensesForAMonth(expensesOfTheMonth, expensesOfAType);
    res.json({result: true, expenses: finalExpenses});
} // end of getExpensesOFATypeForAMonth

/**
 * Retrieves the expenses and incomes for a given year from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the response is sent.
 */
async function getExpensesForAYear(req, res, next) {
    try {
        const year = Number(req.params.year);
        const expensesOfTheYear = await expenseModel.getAllExpensesForAYear(year);
        const incomesOfTheYear = await incomeModel.queryAllIncomesOfAYear(year);
        res.json({result: true, expenses: expensesOfTheYear, incomes: incomesOfTheYear});
    } catch (err) {
        console.log(err);
        res.status(500).json({result: false, message: 'Failed to query the expenses, check your request'});
    }

}

/**
 * Retrieves the expenses of a specific type for a given year from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the response is sent.
 */
async function getExpensesForAYearOfAType(req, res, next) {
    try {
        const year = Number(req.params.year);
        const type = req.body.type;

        if (type === 'income') {
            const incomesOfTheYear = await incomeModel.queryAllIncomesOfAYear(year);
            return res.json({result: true, expenses: incomesOfTheYear});
        }

        const expensesOfTheYear = await expenseModel.getExpensesForAYearOfAType(year, type);
        res.json({result: true, expenses: expensesOfTheYear});
    } catch (err) {
        console.log(err);
        res.status(500).json({result: false, message: 'Failed to query the expenses, check your request'});
    }
}

module.exports = {
    addExpense: addExpense,
    getExpensesForAMonth: getExpensesForAMonth,
    getExpensesOfATypeForAMonth: getExpensesOfATypeForAMonth,
    getExpensesForAYear: getExpensesForAYear,
    getExpensesForAYearOfAType: getExpensesForAYearOfAType
}