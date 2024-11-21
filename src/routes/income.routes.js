const express = require('express')

const router = express.Router();

const incomeController = require('../controllers/income.controller');

router.get('/total-earned', incomeController.getTotalEarnedForAYear); // query params: year

router.get('/month', incomeController.getTotalEarnedInAMonth) // query params: month, year

router.get('/year/monthly', incomeController.getTotalEarnedInAYearInAMonthlyBasis) // query params: year

module.exports = router;