const express = require('express')

const router = express.Router();

const baseController = require('../../controllers/base.controller');


router.post('/', baseController.base);

router.get('/', (req, res, next) => {
    res.send('Hello from the backend');
} );


module.exports = router;