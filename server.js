const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const axios = require('axios');


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

app.post('/summarize', async (req, res) => {
  try {
    const token = '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';
    const transcript = req.body.transcript; // Extracting transcript from the request body

    const requestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Your job is to return the summary of a video transcript in 10-200 words. Smaller The better."
        },
        {
          "role": "user",
          "content": transcript // Using the extracted transcript
        }
      ]
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Add any other headers you need here
      }
    });

    // Extracting the content and usage from the response
    const summaryContent = response.data.choices[0].message.content;
    const usage = response.data.usage;

    // Creating a custom response object
    const customResponse = {
      summary: summaryContent,
      usage: usage
    };

    res.status(200).send(customResponse); // Sending the custom response
  } catch (error) {
    res.status(500).send(error.message);
  }
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
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
