const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

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
