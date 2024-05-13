
const getMonth = require('../utils/getMonth')
const expenseModel = require('../models/expense.model');
const monthModel = require('../models/month.model')

async function addExpense(req, res, next) {

    const amount = parseFloat(req.body.amount);
    const month = Number(req.body.month);
    const year = Number(req.body.year);
    // verify that it is the correct month
    const correctMonth = getMonth(month);
    if (correctMonth === 'a') {
        res.json({result: false, message: 'Invalid Month'});
    }
    const type = req.body.type;
    const notes = req.body.notes;

    // now that we have the data
    // save it to the data base
    const expenseId = await expenseModel.createExpense(amount, month, type, notes, year);

    // now save it to the month
    const monthId = await monthModel.getMonthIdByNumberAndYear(month, year);

    // check if null
    if (!monthId) {
        // there is nothing
        // create a new one
        const monthResult = await monthModel.createMonth(month, year);
        if (monthResult) {
            // all gucci
            const monthId2 = await monthModel.getMonthIdByNumberAndYear(month, year);
            const res = await monthModel.addExpense(monthId2, expenseId)
        }
    } else {
        // it exists
        const res = await monthModel.addExpense(monthId, expenseId)
    }

    // all gucci
    return res.json({result: true});
} // end of add expense

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

    // get the expenses
    const expenses = await Promise.all(expensesIds.map(async id => {
        return await expenseModel.getExpenseById(id)
    }))

    // seems to be all good
    res.json({
        result: true,
        expenses: expenses
    })
}


module.exports = {
    addExpense: addExpense,
    getExpensesForAMonth: getExpensesForAMonth
}