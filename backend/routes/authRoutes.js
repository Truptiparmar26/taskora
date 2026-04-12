// // const router = require("express").Router();
// // const { register, login } = require("../controllers/authController");

// // router.post("/register", register);
// // router.post("/login", login);

// // module.exports = router;

// const router = require("express").Router();
// const auth = require("../middleware/auth"); // Auth middleware import karein
// const { register, login, updateProfile, changePassword, deleteAccount } = require("../controllers/authController");
// const { protect } = require('../middleware/auth');
// const { updateUser } = require('../controllers/authController');

// console.log("Protect is:", protect); 
// console.log("UpdateUser is:", updateUser);
// router.post("/register", register);
// router.post("/login", login);

// // NEW: Update Profile Route
// router.put("/profile", auth, updateProfile); 
// router.put("/change-password", auth, changePassword); 
// router.delete("/delete-account", auth, deleteAccount);
// module.exports = router;

const router = require('express').Router();
const { register, login, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes (Need Token)
// Note: Use PUT for updates
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;