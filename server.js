require("dotenv").config();

const express = require("express");
const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const userRoutes = require("./routes/userRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const getMcqRoutes = require("./routes/getMcq");
const userDataRoutes = require("./routes/userDataRoutes");

// Using routes
app.use("/users", userRoutes);
app.use("/summarize", summaryRoutes);
app.use("/getMcq", getMcqRoutes);
app.use("/userData", userDataRoutes);

const addVideoToDbController = require("./routes/addVideoToDbRoutes");
app.use("/addVideoToDb", addVideoToDbController);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
