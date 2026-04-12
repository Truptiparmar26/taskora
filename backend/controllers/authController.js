
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, img: user.img } 
    });

  } catch (err) {
    res.status(500).json({ msg: "Error registering user" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, img: user.img } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { name, img } = req.body;
  try {
    // FIX: Use req.user._id
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { name, img }, 
      { new: true }
    );
    
    res.json({ 
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, img: updatedUser.img } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // FIX: Use req.user._id
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    // FIX: Use req.user._id
    await User.findByIdAndDelete(req.user._id);
    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting account" });
  }
};