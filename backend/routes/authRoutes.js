const router = require('express').Router();
const { register, login, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Protected Identity & Security Routes (Requires JWT Authorization)
router.put('/profile', protect, updateProfile);

// Password Calibration (Supporting both endpoint naming formats)
router.put('/change-password', protect, changePassword);
router.put('/password', protect, changePassword);

// Account Termination (Supporting both endpoint naming formats)
router.delete('/account', protect, deleteAccount);
router.delete('/profile', protect, deleteAccount);

module.exports = router;