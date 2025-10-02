const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    res.json({
      users: userCount,
      products: productCount,
      orders: orderCount,
      totalSales: totalSales[0] ? totalSales[0].total : 0,
    });
  } catch (err) {
    next(err);
  }
};

// CUSTOMER MANAGEMENT FUNCTIONS

// @desc    Get all customers with analytics
// @route   GET /api/admin/customers
// @access  Admin
exports.getAllCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    
    // Build query - Only fetch users with role 'user', exclude admins
    let query = { 
      $and: [
        { role: 'user' }, // Only users with role 'user'
        { role: { $ne: 'admin' } } // Explicitly exclude admin role
      ]
    };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status !== 'all') {
      query.isActive = status === 'active';
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get customers with order analytics
    const customers = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $cond: [
                    { $ne: ['$$order.status', 'cancelled'] },
                    '$$order.totalAmount',
                    0
                  ]
                }
              }
            }
          },
          lastOrderDate: {
            $max: '$orders.createdAt'
          }
        }
      },
      {
        $project: {
          password: 0,
          orders: 0
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum }
    ]);
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalCustomers: total,
          limit: limitNum
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer analytics
// @route   GET /api/admin/customers/analytics
// @access  Admin
exports.getCustomerAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Overall customer stats
    const totalCustomers = await User.countDocuments({ isAdmin: { $ne: true } });
    const activeCustomers = await User.countDocuments({ 
      isAdmin: { $ne: true }, 
      isActive: true 
    });
    const newCustomers = await User.countDocuments({
      isAdmin: { $ne: true },
      createdAt: { $gte: startDate }
    });
    
    // Customer registration trends
    const registrationTrends = await User.aggregate([
      {
        $match: {
          isAdmin: { $ne: true },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Top customers by spending
    const topCustomers = await User.aggregate([
      { $match: { isAdmin: { $ne: true } } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $cond: [
                    { $ne: ['$$order.status', 'cancelled'] },
                    '$$order.totalAmount',
                    0
                  ]
                }
              }
            }
          },
          totalOrders: { $size: '$orders' }
        }
      },
      { $match: { totalSpent: { $gt: 0 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          email: 1,
          totalSpent: 1,
          totalOrders: 1
        }
      }
    ]);
    
    // Customer spending distribution
    const spendingDistribution = await User.aggregate([
      { $match: { isAdmin: { $ne: true } } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $cond: [
                    { $ne: ['$$order.status', 'cancelled'] },
                    '$$order.totalAmount',
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 500, 1000, 2500, 5000, 10000],
          default: 'High Spender',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          activeCustomers,
          newCustomers,
          retentionRate: totalCustomers > 0 ? (activeCustomers / totalCustomers * 100).toFixed(2) : 0
        },
        registrationTrends,
        topCustomers,
        spendingDistribution
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single customer details
// @route   GET /api/admin/customers/:id
// @access  Admin
exports.getCustomerById = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const customer = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $lookup: {
          from: 'addresses',
          localField: '_id',
          foreignField: 'user',
          as: 'addresses'
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $cond: [
                    { $ne: ['$$order.status', 'cancelled'] },
                    '$$order.totalAmount',
                    0
                  ]
                }
              }
            }
          },
          averageOrderValue: {
            $cond: [
              { $gt: [{ $size: '$orders' }, 0] },
              {
                $divide: [
                  {
                    $sum: {
                      $map: {
                        input: '$orders',
                        as: 'order',
                        in: {
                          $cond: [
                            { $ne: ['$$order.status', 'cancelled'] },
                            '$$order.totalAmount',
                            0
                          ]
                        }
                      }
                    }
                  },
                  { $size: '$orders' }
                ]
              },
              0
            ]
          },
          lastOrderDate: { $max: '$orders.createdAt' }
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ]);
    
    if (!customer || customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer[0]
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer status
// @route   PUT /api/admin/customers/:id/status
// @access  Admin
exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const { isActive, reason } = req.body;
    
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isActive,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new customer (Admin)
// @route   POST /api/admin/customers
// @access  Admin
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password = 'tempPassword123' } = req.body;
    
    // Check if customer already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }
    
    const customer = new User({
      name,
      email,
      phone,
      password,
      isActive: true,
      isAdmin: false,
      createdAt: new Date()
    });
    
    await customer.save();
    
    // Remove password from response
    const customerResponse = customer.toObject();
    delete customerResponse.password;
    
    res.status(201).json({
      success: true,
      data: customerResponse,
      message: 'Customer created successfully'
    });
  } catch (err) {
    next(err);
  }
};
