const express = require('express');
const { 
  signup, 
  login, 
  getCurrentUser, 
  updateProfile, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  resendVerification 
} = require('../controllers/authController');
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

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);

// Email verification routes
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;
