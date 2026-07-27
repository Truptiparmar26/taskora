const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_if_empty");

      // Get user from the token and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ 
          msg: "User account no longer found in database. Please clear browser storage or log in again.",
          message: "User account no longer found in database. Please clear browser storage or log in again." 
        });
      }

      return next();
    } catch (error) {
      console.error("Auth Token Verification Error:", error.message);
      return res.status(401).json({ 
        msg: "Not authorized, authentication token failed or expired. Please sign in again.",
        message: "Not authorized, authentication token failed or expired. Please sign in again."
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      msg: "Not authorized, no session token provided. Please log in first.",
      message: "Not authorized, no session token provided. Please log in first." 
    });
  }
};