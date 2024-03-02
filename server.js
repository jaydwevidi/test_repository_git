require('dotenv').config();


const express = require('express');
const app = express();








// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const userRoutes = require('./routes/userRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Using routes
app.use('/users', userRoutes);
app.use('/summarize', summaryRoutes);


app.post('/get-transcript', (req, res) => {
  const body = req.body;
  console.log('Received POST request:', body);
  res.status(200).json({ message: 'POST request received', data: body });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
