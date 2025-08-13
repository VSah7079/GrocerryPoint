const express = require('express');
const passport = require('passport');
const { register, login, adminLogin, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const corsMiddleware = require('../middlewares/corsMiddleware');
const router = express.Router();

// Enable CORS for auth routes
router.use(corsMiddleware);

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.put('/profile', protect, updateProfile);

module.exports = router; 