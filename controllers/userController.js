const pool = require('../config/db');
const crypto = require('crypto');

exports.register = async (req, res) => {
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
  };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [usersByEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
        if (usersByEmail.length === 0) {
            return res.status(404).json({ message: 'Email does not exist' });
        }
  
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
  };