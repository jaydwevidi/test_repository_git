const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authToken = require("../middleware/authToken");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserDetails", authToken, userController.getUserDetails);

module.exports = router;
