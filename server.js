require("dotenv").config();

const express = require("express");
const app = express();

// Body parsing middleware
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
