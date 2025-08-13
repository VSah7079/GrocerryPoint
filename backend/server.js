const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

// Load env vars
dotenv.config();
const app = express();
// Debug environment variables
console.log('Environment check:');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');

// Middleware
const corsMiddleware = require('./middlewares/corsMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

// Apply core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS middleware
app.use(corsMiddleware);

// Trust proxy
app.set('trust proxy', 1);

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/'
  },
  name: 'sessionId'
}));

// MongoDB connection with fallback
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/grocerypoint';
console.log('Connecting to MongoDB:', mongoUrl);

mongoose.connect(mongoUrl, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 Make sure MongoDB is running on your system');
  console.log('💡 Or update MONGODB_URL in your .env file');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const addressRoutes = require('./routes/addressRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('GroceryPoint Backend API Running');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 