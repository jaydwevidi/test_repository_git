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

  exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        const [tokens] = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);

        if (tokens.length === 0) {
            return res.status(404).json({ message: 'Token not found' });
        }

        // Assuming you have a column in your tokens table named 'expires_at' that stores the expiration date of the token
        const tokenData = tokens[0];
        const now = new Date();
        const expirationDate = new Date(tokenData.expires_at);

        if (now > expirationDate) {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.json({ message: 'Token is valid' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying token', error: error.message });
    }
};
