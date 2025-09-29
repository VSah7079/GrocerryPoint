const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user items.product shippingAddress');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product shippingAddress');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user items.product shippingAddress');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Add status history
    if (!order.statusHistory) order.statusHistory = [];
    
    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      updatedBy: req.user._id,
      notes: `Status changed from ${order.status} to ${status}`
    });
    
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.adminNotes = notes;
    
    // Update delivery date for completed orders
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    await order.populate('user items.product');
    
    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// ENHANCED ADMIN ORDER MANAGEMENT FUNCTIONS

// @desc    Get admin order statistics
// @route   GET /api/orders/admin/stats
// @access  Admin
exports.getAdminOrderStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Overall statistics
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfDay } 
    });
    const monthlyOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    
    // Revenue statistics
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfDay },
          status: { $ne: 'cancelled' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Status-wise order count
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    
    // Top customers
    const topCustomers = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { 
        $group: { 
          _id: '$user', 
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        } 
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' }
    ]);
    
    // Daily sales for the last 7 days
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          todayOrders,
          monthlyOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          todayRevenue: todayRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
        },
        statusStats: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentOrders,
        topCustomers,
        dailySales
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get orders with advanced filtering
// @route   GET /api/orders/admin/filtered
// @access  Admin
exports.getFilteredOrders = async (req, res, next) => {
  try {
    const {
      status,
      startDate,
      endDate,
      customerId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (customerId) {
      query.user = customerId;
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order === 'desc' ? -1 : 1;
    
    // Get orders
    const orders = await Order.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image')
      .populate('shippingAddress');
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalOrders: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bulk update order status
// @route   PUT /api/orders/admin/bulk-update
// @access  Admin
exports.bulkUpdateOrders = async (req, res, next) => {
  try {
    const { orderIds, status, notes } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order IDs array is required'
      });
    }
    
    // Update orders
    const updateResult = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: { status },
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            notes: notes || `Bulk update to ${status}`
          }
        }
      }
    );
    
    res.json({
      success: true,
      data: {
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      message: `${updateResult.modifiedCount} orders updated to ${status}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order analytics for dashboard
// @route   GET /api/orders/admin/analytics
// @access  Admin
exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Order trends
    const orderTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalAmount', 0] } },
          cancelled: { 
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } 
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Payment method statistics
    const paymentStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);
    
    // Order value distribution
    const orderValueDistribution = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        } 
      },
      {
        $bucket: {
          groupBy: '$totalAmount',
          boundaries: [0, 500, 1000, 2000, 5000, 10000],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    
    // Peak order hours
    const peakHours = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { orders: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        orderTrends,
        paymentStats,
        orderValueDistribution,
        peakHours: peakHours.slice(0, 6) // Top 6 hours
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export orders to CSV
// @route   GET /api/orders/admin/export
// @access  Admin
exports.exportOrders = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (status && status !== 'all') query.status = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    
    // Convert to CSV format
    const csvData = orders.map(order => ({
      'Order ID': order._id,
      'Customer Name': order.user?.name || 'N/A',
      'Customer Email': order.user?.email || 'N/A',
      'Customer Phone': order.user?.phone || 'N/A',
      'Order Date': order.createdAt.toDateString(),
      'Status': order.status,
      'Total Amount': order.totalAmount,
      'Payment Method': order.paymentMethod,
      'Items Count': order.items.length,
      'Items': order.items.map(item => `${item.product?.name || 'Unknown'} (${item.quantity})`).join('; '),
      'Shipping Address': `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}, ${order.shippingAddress?.zipCode || ''}`,
      'Delivered At': order.deliveredAt ? order.deliveredAt.toDateString() : 'Not Delivered',
      'Tracking Number': order.trackingNumber || 'N/A'
    }));
    
    res.json({
      success: true,
      data: csvData,
      message: `${csvData.length} orders exported`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get low stock alerts based on orders
// @route   GET /api/orders/admin/stock-alerts
// @access  Admin
exports.getStockAlerts = async (req, res, next) => {
  try {
    // Get products with low stock based on recent order patterns
    const recentOrders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: 'cancelled' }
    }).populate('items.product');
    
    // Calculate demand for each product
    const productDemand = {};
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product._id.toString();
          productDemand[productId] = (productDemand[productId] || 0) + item.quantity;
        }
      });
    });
    
    // Get products that might run out of stock soon
    const Product = require('../models/Product');
    const alerts = [];
    
    for (const [productId, weeklyDemand] in Object.entries(productDemand)) {
      const product = await Product.findById(productId);
      if (product && product.stock) {
        const daysOfStock = Math.floor(product.stock / (weeklyDemand / 7));
        if (daysOfStock <= 3) { // Alert if less than 3 days of stock
          alerts.push({
            product: product,
            currentStock: product.stock,
            weeklyDemand,
            estimatedDaysLeft: daysOfStock,
            severity: daysOfStock <= 1 ? 'critical' : daysOfStock <= 2 ? 'high' : 'medium'
          });
        }
      }
    }
    
    res.json({
      success: true,
      data: alerts.sort((a, b) => a.estimatedDaysLeft - b.estimatedDaysLeft),
      message: `${alerts.length} stock alerts found`
    });
  } catch (err) {
    next(err);
  }
};
