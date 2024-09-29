const express = require('express')

const router = express.Router();

const budgetController = require('../controllers/budget.controller');


router.get('/:year', budgetController.getSetUp);

// route to create or modify the existsing setup
router.post('/modify/:year', budgetController.modifySetUp);


module.exports = router;