const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All routes are protected and require admin role
router.use(protect, admin);

// Dashboard routes
router.get('/dashboard-stats', adminController.getDashboardStats);

// Order routes
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Customer routes
router.get('/customers', adminController.getAllCustomers);

module.exports = router;
