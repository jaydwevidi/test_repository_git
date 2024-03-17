require("dotenv").config();
const cors = require("cors");

const express = require("express");
const path = require("path");
const app = express();

// Body parsing middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const userRoutes = require("./routes/userRoutes");
const internalRoutes = require("./routes/internalRoutes");
const userDataRoutes = require("./routes/userDataRoutes");

// Using routes
app.use("/users", userRoutes);

app.use("/userData", userDataRoutes);
app.use("/internal", internalRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Serve the login page or other frontend pages
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "homePage.html"));
});

// Serve the userDetails page
app.get("/user-details", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "userDetails.html"));
});

app.get("/summarize", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "generateQuestions.html")
  );
});

app.get("/generate-question", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "generateQuestions.html")
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
