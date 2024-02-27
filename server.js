const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  host: "database-2.cne282aq27vi.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "00000000",
  database: 'InsightHub' // Add your database name
};

const pool = mysql.createPool(dbConfig);


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

const crypto = require('crypto');

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const token = crypto.randomBytes(20).toString('hex');

        await pool.query('INSERT INTO tokens (user_id, token) VALUES (?, ?)', [user.id, token]);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
