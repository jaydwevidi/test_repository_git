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
      [fname, lname, email, hashedPassword, phone, convertGender(gender), dob]
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
      return res.status(404).json({ message: "Email does not exist" });
    }

    const user = usersByEmail[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
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
    const user_id = req.body.user_id;

    if (!user_id) {
      return res.status(400).json({
        message: "No User ID Provided. Internal Server Error",
        reqBody: req.body,
      });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found " + email });
    }

    const userData = users[0];

    res.json({ ...userData });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details",
      error: error.message,
      reqBody: req.body,
    });
  }
};

function convertGender(gender) {
  // Convert gender to lowercase for case-insensitive comparison
  const genderLower = gender.toLowerCase();

  // Assign a number to each gender
  // 1 = Male, 2 = Female, 3 = Non-Binary, 4 = Transgender, 5 = Intersex, 6 = Prefer Not to Say, 7 = Other
  switch (genderLower) {
    case "male":
    case "m":
      return 1;
    case "female":
    case "f":
      return 2;
    case "non-binary":
    case "nonbinary":
    case "nb":
      return 3;
    case "transgender":
    case "trans":
    case "tg":
      return 4;
    case "intersex":
    case "i":
      return 5;
    case "prefer not to say":
    case "pnts":
      return 6;
    case "other":
    case "o":
      return 7;
    default:
      // If gender is not recognized, return null
      return null;
  }
}
