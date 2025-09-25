const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// User signup
router.post('/signup', signup);
// User login
router.post('/login', login);
// Get current user
router.get('/me', protect, getCurrentUser);

module.exports = router;
