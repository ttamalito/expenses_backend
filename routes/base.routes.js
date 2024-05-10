const express = require('express')

const router = express.Router();

const baseController = require('../controllers/base.controller');


router.get('/', baseController.base);


module.exports = router;