const express = require('express');
const { getCurrentUser, getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/name', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 