const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// ADMIN ROUTES - Advanced Order Management
// Get admin order statistics
router.get('/admin/stats', protect, admin, orderController.getAdminOrderStats);
// Get filtered orders with pagination
router.get('/admin/filtered', protect, admin, orderController.getFilteredOrders);
// Get order analytics
router.get('/admin/analytics', protect, admin, orderController.getOrderAnalytics);
// Export orders
router.get('/admin/export', protect, admin, orderController.exportOrders);
// Get stock alerts based on orders
router.get('/admin/stock-alerts', protect, admin, orderController.getStockAlerts);
// Bulk update orders
router.put('/admin/bulk-update', protect, admin, orderController.bulkUpdateOrders);

// GENERAL ROUTES
// Admin: get all orders
router.get('/', protect, admin, orderController.getOrders);
// User: get own orders
router.get('/my', protect, orderController.getMyOrders);
// Get single order (user or admin)
router.get('/:id', protect, orderController.getOrderById);
// Create order
router.post('/', protect, orderController.createOrder);
// Admin: update order status
router.put('/:id', protect, admin, orderController.updateOrderStatus);

module.exports = router;
