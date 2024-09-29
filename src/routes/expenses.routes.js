const express = require('express');

const router = express.Router();

const expensesController = require('../controllers/expenses.controller');
const expensesValidator = require('../controllers/middlewares/expenses.validation');


router.post('/addExpense', expensesValidator.addExpense ,expensesController.addExpense);

router.get('/expenses/monthly/:month/:year', expensesController.getExpensesForAMonth);

router.post('/expenses/single-type/:month/:year', expensesController.getExpensesOfATypeForAMonth);

router.get('/getExpensesForAYear/:year', expensesController.getExpensesForAYear);

router.get('/expenses/single-type', expensesController.getExpensesForAYearOfAType); // query params: year, type

router.get('/expenses/total-spent', expensesController.getTotalSpentOnAYear); // query params: year

router.post('/expenses/modify', expensesController.modifySingleExpense) // query params: id

module.exports = router;