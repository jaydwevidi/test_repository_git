const pool = require("../config/db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const SECRET_KEY = "your_secret_key";

exports.register = async (req, res) => {
  try {
    const { fname, lname, email, password, phone, gender, dob } = req.body;

    // Check if all required fields are provided
    if (!fname || !lname || !email || !password || !phone || !gender || !dob) {
      return res.status(400).json({
        message:
          "Please provide all required fields: fname, lname, email, password, phone, gender, dob",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      "INSERT INTO users (fname, lname, email, password, phone, gender, dob) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, email, hashedPassword, phone, gender, dob]
    );

    res
      .status(201)
      .json({ message: "User added successfully", userId: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide all required fields: fname, lname, email, password, phone, gender, dob",
      });
    }

    const [usersByEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (usersByEmail.length === 0) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const user = usersByEmail[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const email = req.email;

    if (!email) {
      return res.status(400).json({
        message: "Please provide email",
      });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      userEmail,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found " + userEmail });
    }

    const userData = users[0];

    res.json({ name: userData.name, email: userData.email });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details",
      error: error.message,
      reqBody: req.body,
    });
  }
};
