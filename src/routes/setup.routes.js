const express = require('express')

const router = express.Router();

const setUpController = require('../../controllers/setup.controller');


router.get('/getSetUp/:year', setUpController.getSetUp);

// route to create modify the existsing setup
router.post('/modifySetUp/:year', setUpController.modifySetUp);


module.exports = router;