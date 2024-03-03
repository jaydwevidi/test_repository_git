const express = require('express');
const router = express.Router();
const getMcqController = require('../controllers/getMcqController');

router.post('/', getMcqController.getMcq);

module.exports = router;