const express = require("express");
const router = express.Router();

const summaryController = require("../controllers/internal/summaryController");
const getMcqController = require("../controllers/internal/getMcqController");
const addVideoToDbController = require("../controllers/internal/addVideoToDbController");

router.post("/summarize", summaryController.summarize);
router.post("/getMcq", getMcqController.getMcq);
router.post("/addVideoToDb", addVideoToDbController.addVideoToDb);

module.exports = router;
