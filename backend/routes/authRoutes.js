const express = require('express');
const { signup, login, getCurrentUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// User registration
router.post('/register', signup);
// User login
router.post('/login', login);
// Get current user profile
router.get('/me', protect, getCurrentUser);
// Update user profile
router.put('/profile', protect, updateProfile);

module.exports = router;
