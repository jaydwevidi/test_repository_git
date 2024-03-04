const express = require("express");
const router = express.Router();
const getSummaryController = require("../controllers/getSummaryController");
const postMcqScoreController = require("../controllers/postMcqScoreController");
const getHistory = require("../controllers/getHistory");

router.post("/getSummary", getSummaryController.getSummary);
router.post("/postMcqScore", postMcqScoreController.postMcqScore);
router.post("/getHistory", getHistory.getHistory);

module.exports = router;
