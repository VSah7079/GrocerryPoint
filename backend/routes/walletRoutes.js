const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect, admin } = require('../middlewares/authMiddleware');

// User wallet routes
router.get('/', protect, walletController.getWalletBalance);
router.get('/history', protect, walletController.getWalletHistory);
router.post('/add', protect, walletController.addMoney);
router.post('/pay-order', protect, walletController.processOrderPayment);

// Admin wallet routes
router.post('/refund', protect, admin, walletController.refundToWallet);

module.exports = router;