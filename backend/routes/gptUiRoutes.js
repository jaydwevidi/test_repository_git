const express = require("express");
const router = express.Router();
const path = require("path");

router.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gpt_frontend/homePage.html"));
});

// Serve the login page or other frontend pages
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gpt_frontend/login.html"));
});

// Serve the userDetails page
router.get("/upload_with_url", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../gpt_frontend/summary/upload_with_url.html")
  );
});

module.exports = router;
