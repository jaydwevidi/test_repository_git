const express = require("express");
const router = express.Router();
const getSummaryController = require("../controllers/getSummaryController");

router.post("/getSummary", getSummaryController.getSummary);

module.exports = router;
