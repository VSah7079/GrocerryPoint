
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('GrocerryPoint API is running');
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));
// Admin dashboard routes
app.use('/api/admin', require('./routes/adminRoutes'));
// Contact & Newsletter routes
app.use('/api', require('./routes/contactRoutes'));
// Review routes
app.use('/api/reviews', require('./routes/reviewRoutes'));
// Address routes
app.use('/api/addresses', require('./routes/addressRoutes'));
// Order routes
app.use('/api/orders', require('./routes/orderRoutes'));
// Wishlist routes
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
// Cart routes
app.use('/api/cart', require('./routes/cartRoutes'));
// Category routes
app.use('/api/categories', require('./routes/categoryRoutes'));
// Product routes
app.use('/api/products', require('./routes/productRoutes'));

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
