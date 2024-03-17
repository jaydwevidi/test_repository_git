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
const userManagementRoutes = require("./routes/userManagementRoutes");
const internalRoutes = require("./routes/internalRoutes");
const userActionsRoutes = require("./routes/userActionsRoutes");

const uiRoutes = require("./routes/uiRoutes");

// Using routes
app.use("/user/management", userManagementRoutes);
app.use("/user/action", userActionsRoutes);
app.use("/internal", internalRoutes);
app.use("/", uiRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "..", "frontend")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
