const pool = require("../../config/db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const SECRET_KEY = "your_secret_key";

exports.editProfile = async (req, res) => {
  console.log("Edit Profile of User - " + JSON.stringify(req.body));

  const { fname, lname, password, phone, gender, dob, user_id } = req.body;

  // Check if all required fields are provided
  if (!fname || !lname || !password || !phone || !gender || !dob) {
    return res.status(400).json({
      message:
        "Please provide all required fields: fname, lname, password, phone, gender, dob",
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      "UPDATE users SET fname = ?, lname = ?, password = ?, phone = ?, gender = ?, dob = ? WHERE id = ?",
      [fname, lname, hashedPassword, phone, convertGender(gender), dob, user_id]
    );

    res
      .status(201)
      .json({ message: "User Edited successfully", userId: user_id });

    console.log("Edited Profile Successfully");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing user", error: error.message });
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
