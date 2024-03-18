const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const pool = require("../config/db");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(`\nVerifying Authenticating token - ${token.slice(0, 15)}`);

  if (!token) {
    console.log(`Token not Provided.`);
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user_id_decoded = decoded.userId;
    req.body.user_id = user_id_decoded; // Add User Id to req.body
    console.log(`Token is Authentic. User Id - ${user_id_decoded}`);

    await pool.query(
      "INSERT INTO authVerificationLogs (token, login_time, status, user_id) VALUES (?, NOW(), ?, ?)",
      [token, 1, user_id_decoded]
    );

    next();
  } catch (error) {
    console.log(`Token is Invalid + ${error}`);
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
