const express = require('express');

const router = express.Router();

const expensesController = require('../controllers/expenses.controller');


router.post('/addExpense', expensesController.addExpense);

router.get('/getExpenseForMonth/:month/:year', expensesController.getExpensesForAMonth);

router.post('/getExpensesOfType/:month/:year', expensesController.getExpensesOfATypeForAMonth);

router.get('/getExpensesForAYear/:year', expensesController.getExpensesForAYear);

module.exports = router;