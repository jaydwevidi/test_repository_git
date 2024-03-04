const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Use the same secret key used for signing the tokens

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.email = decoded.email; // Set the user's email in the request object
    next(); // Proceed to the next middleware or endpoint function
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
