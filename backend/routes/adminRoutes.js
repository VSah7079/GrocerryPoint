const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Dashboard stats
router.get('/stats', protect, admin, adminController.getStats);

// Customer Management Routes
router.get('/customers', protect, admin, adminController.getAllCustomers);
router.get('/customers/analytics', protect, admin, adminController.getCustomerAnalytics);
router.get('/customers/:id', protect, admin, adminController.getCustomerById);
router.put('/customers/:id/status', protect, admin, adminController.updateCustomerStatus);
router.post('/customers', protect, admin, adminController.createCustomer);

module.exports = router;
