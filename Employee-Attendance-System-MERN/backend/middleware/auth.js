const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "8fbd2e4c3f9e4f7a93a9e6f8b1c1d9e3e6a8a2f6d1c9f7e4b3a2d8c7f4e9a1b6");
    const user = await User.findById(decoded.id);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("TOEKN: ",token);
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "8fbd2e4c3f9e4f7a93a9e6f8b1c1d9e3e6a8a2f6d1c9f7e4b3a2d8c7f4e9a1b6");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin, authMiddleware };
