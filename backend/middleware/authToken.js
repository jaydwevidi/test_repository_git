const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // res.redirect("/login.html");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.body.user_id = decoded.userId; // Add User Id to req.body
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    //res.redirect("/login.html");
  }
};

module.exports = authenticateToken;
