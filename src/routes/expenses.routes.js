const express = require('express');

const router = express.Router();

const expensesController = require('../controllers/expenses.controller');
const expensesValidator = require('../controllers/middlewares/expenses.validation');


router.post('/add', expensesValidator.addExpense ,expensesController.addExpense);

router.get('/monthly/:month/:year', expensesController.getExpensesForAMonth);

router.post('/single-type/:month/:year', expensesController.getExpensesOfATypeForAMonth);

router.get('/yearly/:year', expensesController.getExpensesForAYear);

router.get('/single-type', expensesController.getExpensesForAYearOfAType); // query params: year, type

router.get('/total-spent', expensesController.getTotalSpentOnAYear); // query params: year

router.post('/modify', expensesController.modifySingleExpense) // query params: id

router.get('/total-spent/monthly', expensesValidator.getTotalSpentOnAMonth , expensesController.getTotalSpentOnAMonth); // query params: month, year, type

router.delete('/delete', expensesValidator.deleteExpense, expensesController.deleteExpense); // params are in the body (expenseId, month, year)

router.options('/delete', (req, res, next) => {
    res.append('content-type', 'application/json',)
    return res.status(200).send();
})

module.exports = router;