
const getMonth = require('../utils/getMonth')
const expenseModel = require('../models/expense.model');
const monthModel = require('../models/month.model');
const queryExpensesOfAType = require('../utils/queryExpensesOfAType');
const incomeModel = require('../models/income.model');
const budgetModel = require('../models/budget.model');
const {ObjectId} = require("mongodb");

/**
 * Adds an expense/income to the database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function addExpense(req, res, next) {

    let amount = parseFloat(req.body.amount);
    const month = Number(req.body.month);
    const year = Number(req.body.year);
    const type = req.body.type;
    const notes = req.body.notes;
    const date = req.body.date;
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
        // TODO: address #21
        const setUp = await budgetModel.getSetUpByYear(2024);
        if (!setUp) {
            // there is nothing in the database
            return res.json({result: false, message: 'No setup for the year'});
        }
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
        const year = Number(req.query.year);
        const type = req.query.type;

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

/**
 * Retrieves the total amount spent on expenses for a specific year from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the response is sent.
 */
async function getTotalSpentOnAYear(req, res, next) {
    try {
        const year = Number(req.query.year);
        const totalSpent = await expenseModel.queryTotalSpentOnAYear(year);
        return res.json({result: true, totalSpent: totalSpent});
    } catch (err) {
        console.log(err);
        res.status(500).json({result: false, message: 'Failed to query the expenses, check your request'});
    }
}

async function getTotalEarnedOnAYear(req, res, next) {
    try {
        const year = Number(req.query.year);
        const totalEarned = await incomeModel.queryTotalEarnedOnAYear(year);
        return res.json({result: true, totalEarned: totalEarned});
    } catch (err) {
        console.log(err);
        res.status(500).json({result: false, message: 'Failed to query the incomes, check your request'});
    }
}

/**
 * Modifies a single expense in the database.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function modifySingleExpense(req, res, next) {
    const id = req.query.id;
    const amount = parseFloat(req.body.amount);
    const date = req.body.date;
    const notes = req.body.notes;
    const type = req.body.type;


    const expenseId = new ObjectId(id);

    const expense = await expenseModel.getExpenseById(expenseId);
    if (!expense) {
        res.status(400).json({result: false, message: 'The expense does not exist'});
    }

    try {
        const result = await expenseModel.modifySingleExpense(expenseId, amount, expense.month, type, notes, expense.year ,date);
        if (result) {
            return res.status(204).send();
        } else {
            return res.status(500).json({result: false, message: 'Failed to modify the expense'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({result: false, message: 'Failed to modify the expense'});
    }
}

/**
 * Returns the total spent on a month
 * There are 3 query parameters
 * month: the month
 * year: the year
 * type: the type expense
 * if type === all, the query the total spent on the month
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getTotalSpentOnAMonth(req, res, next) {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const type = req.query.type;

    let totalSpent = 0;
    if (type === 'all') {
        const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);
        if (monthId === null) {
            return res.status(200).json({message: 'No expenses for the month and year', totalSpent: 0});
        }
        const totalSpentOnAllTypes = await monthModel.queryTotalSpentOnTheMonth(month, year);
        if (totalSpentOnAllTypes === null || totalSpentOnAllTypes === undefined) {
            return res.status(500).json({message: 'Failed to query the total spent on the month'});
        }
         totalSpent = totalSpentOnAllTypes;
    } else {
        const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);
        if (monthId === null) {
            return res.status(200).json({message: 'No expenses for the month and year', totalSpent: 0});
        }
        const totalSpentOnSingleType = await monthModel.queryTotalSpentOnTheMonthForAType(month, year, type);
        if (totalSpentOnSingleType === null || totalSpentOnSingleType === undefined) {
            return res.status(500).json({message: 'Failed to query the total spent on the month'});
        }
        totalSpent = totalSpentOnSingleType;
    }

    return res.status(200).json({totalSpent: totalSpent});
}

/**
 * Deletes an expense from the database
 * by removing it from the month and then deleting the expense
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function deleteExpense(req, res, next) {
    const expenseId = req.body.expenseId;

    let expenseIdAsObjectId;
    try {
        expenseIdAsObjectId = new ObjectId(expenseId);
    } catch (err) {
        return res.status(400).json({ message: 'The expense is not a valid ObjectID'});
    }


    const expenseWasRemovedFromMonth = await monthModel.removeExpense(expenseIdAsObjectId);

    if (!expenseWasRemovedFromMonth) {
        return res.status(500).json({ message: 'Failed to remove the expense from the month'});
    }

    const expenseWasDeleted = await expenseModel.deleteExpense(expenseIdAsObjectId);

    if (!expenseWasDeleted) {
        return res.status(500).json({ message: 'Failed to delete the expense'});
    }

    return res.status(204).send();
}



module.exports = {
    addExpense: addExpense,
    getExpensesForAMonth: getExpensesForAMonth,
    getExpensesOfATypeForAMonth: getExpensesOfATypeForAMonth,
    getExpensesForAYear: getExpensesForAYear,
    getExpensesForAYearOfAType: getExpensesForAYearOfAType,
    getTotalSpentOnAYear: getTotalSpentOnAYear,
    modifySingleExpense: modifySingleExpense,
    getTotalSpentOnAMonth: getTotalSpentOnAMonth,
    deleteExpense: deleteExpense
}