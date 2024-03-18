const express = require("express");
const router = express.Router();

const loginController = require("../controllers/userManagement/login");
const registerController = require("../controllers/userManagement/register");
const getUserDetailsController = require("../controllers/userManagement/getUserDetails");
const editProfileController = require("../controllers/userManagement/editProfile");

const authToken = require("../middleware/authToken");

router.post("/register", registerController.register);
router.post("/login", loginController.login);

router.post("/editProfile", authToken, editProfileController.editProfile);

router.post(
  "/getUserDetails",
  authToken,
  getUserDetailsController.getUserDetails
);

module.exports = router;
