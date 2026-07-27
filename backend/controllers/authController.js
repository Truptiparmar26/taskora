const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill out all required fields (Name, Email, and Password)." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must contain at least 6 characters." });
    }

    // 2. Check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        msg: "An account with this email address is already registered. Please log in instead or use a different email." 
      });
    }

    // 3. Hash password and save new user
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key_default", { expiresIn: "7d" });

    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, img: user.img },
      msg: "Account created successfully!"
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "An account with this email address is already registered. Please log in instead." });
    }
    res.status(500).json({ msg: "Server error occurred during registration. Please try again later." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter both your email address and password." });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email address. Please check your spelling or register for a new account." });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect password. Please check your password and try again." });
    }

    // 4. Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key_default", { expiresIn: "7d" });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, img: user.img },
      msg: "Logged in successfully!"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Internal server error occurred while logging in. Please try again later." });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { name, email, img } = req.body;
  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (img !== undefined) updateData.img = img;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ msg: "User account not found." });
    }

    res.json({ 
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, img: updatedUser.img },
      msg: "Profile updated successfully!"
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Error updating profile details." });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User account not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Your current password is incorrect." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error while changing password." });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ msg: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ msg: "Error deleting account." });
  }
};