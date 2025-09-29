const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get user wallet balance
// @route   GET /api/wallet
// @access  Private
exports.getWalletBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json({
      success: true,
      balance: user.wallet || 0
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add money to wallet
// @route   POST /api/wallet/add
// @access  Private
exports.addMoney = async (req, res, next) => {
  try {
    const { amount, paymentMethod = 'card' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    if (amount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Maximum amount per transaction is ₹50,000'
      });
    }

    const user = await User.findById(req.user._id);
    const previousBalance = user.wallet || 0;
    user.wallet = previousBalance + amount;
    
    // Add transaction to user's wallet history
    if (!user.walletHistory) {
      user.walletHistory = [];
    }
    
    user.walletHistory.push({
      type: 'credit',
      amount: amount,
      description: `Money added via ${paymentMethod}`,
      balance: user.wallet,
      date: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: `₹${amount} added to wallet successfully`,
      balance: user.wallet,
      transaction: {
        type: 'credit',
        amount: amount,
        previousBalance: previousBalance,
        newBalance: user.wallet
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Deduct money from wallet (used during order)
// @route   POST /api/wallet/deduct
// @access  Private
exports.deductMoney = async (req, res, next) => {
  try {
    const { amount, orderId, description = 'Order payment' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    const user = await User.findById(req.user._id);
    const currentBalance = user.wallet || 0;

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient wallet balance',
        currentBalance: currentBalance,
        requiredAmount: amount
      });
    }

    const previousBalance = user.wallet;
    user.wallet = currentBalance - amount;
    
    // Add transaction to user's wallet history
    if (!user.walletHistory) {
      user.walletHistory = [];
    }
    
    user.walletHistory.push({
      type: 'debit',
      amount: amount,
      description: description,
      orderId: orderId,
      balance: user.wallet,
      date: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: `₹${amount} deducted from wallet`,
      balance: user.wallet,
      transaction: {
        type: 'debit',
        amount: amount,
        previousBalance: previousBalance,
        newBalance: user.wallet,
        orderId: orderId
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get wallet transaction history
// @route   GET /api/wallet/history
// @access  Private
exports.getWalletHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user._id).select('walletHistory wallet');
    
    if (!user.walletHistory || user.walletHistory.length === 0) {
      return res.json({
        success: true,
        transactions: [],
        currentBalance: user.wallet || 0,
        totalTransactions: 0
      });
    }

    // Sort by date (newest first)
    const sortedHistory = user.walletHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      transactions: paginatedHistory,
      currentBalance: user.wallet || 0,
      totalTransactions: user.walletHistory.length,
      page: parseInt(page),
      totalPages: Math.ceil(user.walletHistory.length / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process wallet payment for order
// @route   POST /api/wallet/pay-order
// @access  Private
exports.processOrderPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order already paid'
      });
    }

    const user = await User.findById(req.user._id);
    const currentBalance = user.wallet || 0;

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient wallet balance',
        currentBalance: currentBalance,
        requiredAmount: amount
      });
    }

    // Deduct money from wallet
    user.wallet = currentBalance - amount;
    
    // Add transaction to wallet history
    if (!user.walletHistory) {
      user.walletHistory = [];
    }
    
    user.walletHistory.push({
      type: 'debit',
      amount: amount,
      description: `Payment for Order #${orderId}`,
      orderId: orderId,
      balance: user.wallet,
      date: new Date()
    });

    // Update order payment status
    order.paymentStatus = 'paid';
    order.paymentMethod = 'wallet';
    order.paidAt = new Date();

    await Promise.all([user.save(), order.save()]);

    res.json({
      success: true,
      message: 'Order payment successful',
      orderId: orderId,
      amountPaid: amount,
      remainingBalance: user.wallet,
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.totalAmount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Refund money to wallet
// @route   POST /api/wallet/refund
// @access  Private (Admin can also use this)
exports.refundToWallet = async (req, res, next) => {
  try {
    const { userId, amount, orderId, reason = 'Order refund' } = req.body;
    
    // Admin can refund to any user, regular user can only refund to themselves
    const targetUserId = req.user.role === 'admin' ? (userId || req.user._id) : req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Refund amount must be greater than 0'
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const previousBalance = user.wallet || 0;
    user.wallet = previousBalance + amount;
    
    // Add refund transaction to wallet history
    if (!user.walletHistory) {
      user.walletHistory = [];
    }
    
    user.walletHistory.push({
      type: 'credit',
      amount: amount,
      description: reason,
      orderId: orderId,
      balance: user.wallet,
      date: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: `₹${amount} refunded to wallet`,
      refundAmount: amount,
      newBalance: user.wallet,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};