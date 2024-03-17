const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(`\nVerifying Authenticating token - ${token}\n`);

  if (!token) {
    console.log(`Token not Provided.`);
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    req.body.user_id = decoded.userId; // Add User Id to req.body
    console.log(`Token is Authentic`);
    next();
  } catch (error) {
    console.log(`Token is Invalid`);
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
