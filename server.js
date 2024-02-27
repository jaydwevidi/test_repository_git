const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const mysql = require('mysql2/promise');

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DB_HOST="database-2.cne282aq27vi.us-east-1.rds.amazonaws.com"
DB_USER="admin"
DB_PASS="00000000"

const dbConfig = {
  host: "database-2.cne282aq27vi.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "00000000",
  database: 'InsightHub' // Add your database name
};

const pool = mysql.createPool(dbConfig);

app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/users/register', async (req, res) => {
  try {
    const { fname, lname, email, password, phone, gender, dob } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (fname, lname, email, password, phone, gender, dob) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fname, lname, email, password, phone, gender, dob]
    );
    res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
