const express = require("express");
const router = express.Router();
const getSummaryController = require("../controllers/userActions/getSummaryController");
const postMcqScoreController = require("../controllers/userActions/postMcqScoreController");
const getHistory = require("../controllers/userActions/getHistory");

const authToken = require("../middleware/authToken");

router.post("/getSummary", authToken, getSummaryController.getSummary);
router.post("/postMcqScore", authToken, postMcqScoreController.postMcqScore);
router.post("/getHistory", authToken, getHistory.getHistory);

module.exports = router;
