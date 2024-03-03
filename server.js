require('dotenv').config();

const express = require('express');
const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const userRoutes = require('./routes/userRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const mcqRoutes = require('./routes/getMcqRoutes');
const addVideoToDbRoutes = require('./routes/addVideoToDbRoutes');

// Using routes
app.use('/users', userRoutes);
app.use('/summarize', summaryRoutes);
app.use('/getMcq', mcqRoutes);
app.use('/addVideoToDb', addVideoToDbRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
