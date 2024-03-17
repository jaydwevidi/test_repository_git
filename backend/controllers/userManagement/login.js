const pool = require("../../config/db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const SECRET_KEY = "your_secret_key";

exports.login = async (req, res) => {
  console.log("Logging in User = " + JSON.stringify(req.body));

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email & password",
      });
    }

    const [usersByEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (usersByEmail.length === 0) {
      await pool.query(
        "INSERT INTO loginHistory (user_id, login_time, status ) VALUES (?, NOW(), ?)",
        [null, null]
      );
      return res.status(404).json({ message: "Email does not exist" });
    }

    const user = usersByEmail[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await pool.query(
        "INSERT INTO loginHistory (user_id, login_time, status ) VALUES (?, NOW(), ?)",
        [user.id, 0]
      );
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    await pool.query(
      "INSERT INTO loginHistory (user_id, login_time, status ) VALUES (?, NOW(), ?)",
      [user.id, 1]
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
