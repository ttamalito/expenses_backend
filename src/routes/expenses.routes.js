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

module.exports = router;