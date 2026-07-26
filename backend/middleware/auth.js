
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   if (!authHeader) {
//     return res.status(401).json({ msg: "No token" });
//   }

//   try {
//     const token = authHeader.split(" ")[1]; // 🔥 IMPORTANT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1. DEBUG: Check if middleware runs
  console.log("--- Auth Middleware Hit ---");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      // IMPORTANT: We must attach the user to req.user
      req.user = await User.findById(decoded.id).select("-password");

      // 2. DEBUG: Check if user is found
      console.log("User found in Middleware:", req.user);

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};