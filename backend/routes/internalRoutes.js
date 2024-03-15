const express = require("express");
const router = express.Router();

const summaryController = require("../controllers/summaryController");
const getMcqController = require("../controllers/getMcqController");
const addVideoToDbController = require("../controllers/addVideoToDbController");

router.post("/summarize", summaryController.summarize);
router.post("/getMcq", getMcqController.getMcq);
router.post("/addVideoToDb", addVideoToDbController.addVideoToDb);

module.exports = router;
