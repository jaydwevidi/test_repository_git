const express = require("express");
const router = express.Router();
const getSummaryController = require("../controllers/getSummaryController");
const postMcqScoreController = require("../controllers/postMcqScoreController");
const getHistory = require("../controllers/getHistory");
const authToken = require("../middleware/authToken");

router.post("/getSummary",authToken , getSummaryController.getSummary);
router.post("/postMcqScore", authToken,  postMcqScoreController.postMcqScore);
router.post("/getHistory",authToken , getHistory.getHistory);

module.exports = router;
