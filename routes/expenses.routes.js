const express = require('express');

const router = express.Router();

const expensesController = require('../controllers/expenses.controller');


router.post('/addExpense', expensesController.addExpense);

router.get('/getExpenseForMonth/:month/:year', expensesController.getExpensesForAMonth);

module.exports = router;