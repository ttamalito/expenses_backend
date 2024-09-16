const express = require('express')

const router = express.Router();

const incomeController = require('../../controllers/income.controller');

router.get('/total-earned', incomeController.getTotalEarnedForAYear); // query params: year

module.exports = router;