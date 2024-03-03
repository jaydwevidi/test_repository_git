const express = require('express');
const router = express.Router();
const addVideoToDbController = require('../controllers/addVideoToDbController');

router.post('/', addVideoToDbController.addVideoToDb);

module.exports = router;