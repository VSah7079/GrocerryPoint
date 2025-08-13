const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get total orders and revenue
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // Get this week's orders and revenue
        const thisWeekOrders = await Order.countDocuments({ createdAt: { $gte: lastWeek } });
        const thisWeekRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: lastWeek } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // Get total customers
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const newCustomers = await User.countDocuments({ 
            role: 'customer',
            createdAt: { $gte: lastWeek }
        });

        // Get daily sales for the last 7 days
        const dailySales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastWeek }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                thisWeekOrders,
                thisWeekRevenue: thisWeekRevenue[0]?.total || 0,
                totalCustomers,
                newCustomers
            },
            dailySales,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders with pagination
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            orders,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email');

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all customers with pagination
exports.getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const customers = await User.find({ role: 'customer' })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ role: 'customer' });

        res.json({
            customers,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
