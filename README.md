# GrocerryPoint - Complete Grocery E-commerce Platform 🛒

GrocerryPoint is a **comprehensive full-stack e-commerce platform** designed specifically for grocery shopping. Built with modern technologies, it provides a seamless experience for customers to browse, purchase groceries online, and for administrators to manage inventory, orders, and users efficiently.

## 🎯 Project Overview & Key Features

### **Customer Features**
- 🏠 **Modern Homepage** - Hero section with search, categories, deals, testimonials
- 🛍️ **Product Catalog** - Advanced filtering, sorting, pagination, and search functionality
- 🛒 **Smart Shopping Cart** - Real-time cart updates with quantity management
- ❤️ **Wishlist System** - Save favorite products for later
- 📦 **Order Management** - Place orders, track delivery, view order history
- 👤 **User Dashboard** - Profile management, order history, saved addresses
- 🔐 **Secure Authentication** - Email/password + Social login (Google & Facebook)
- 📍 **Address Management** - Multiple delivery addresses with default selection

### **Admin Features**
- 📊 **Dynamic Dashboard** - Real-time analytics, charts, and statistics
- 📦 **Product Management** - CRUD operations with category management
- 🎯 **Order Management** - View, update order status, detailed order tracking
- 👥 **Customer Management** - User data, order history, customer insights
- 📈 **Analytics & Reports** - Sales data, product performance, revenue tracking
- ⚙️ **System Settings** - Platform configuration and management

## 🛠 Technology Stack & Architecture

### **Frontend Technologies**
- **React 19** - Latest React with modern hooks and features
- **React Router DOM** - Client-side routing with nested routes
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **Axios** - HTTP client for API communication
- **Recharts** - Data visualization for admin analytics
- **Lucide React** - Modern, customizable icon library
- **Vite** - Fast build tool and development server

### **Backend Technologies**
- **Node.js & Express** - Server runtime and web framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Passport.js** - Authentication middleware for social logins
- **BCrypt** - Password hashing and security
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing configuration

## 📁 Detailed Project Architecture

```
GrocerryPoint/
├── 📂 src/                           # Frontend Source Code
│   ├── 📂 components/               # Reusable UI Components
│   │   ├── Header.jsx              # Navigation with cart, user menu
│   │   ├── Footer.jsx              # Site footer with links
│   │   ├── ProductCard.jsx         # Product display component
│   │   ├── FeaturedProducts.jsx    # Homepage featured section
│   │   ├── AddressFormModal.jsx    # Address management modal
│   │   ├── OrderHistory.jsx        # User order display
│   │   └── Wishlist.jsx           # Wishlist management
│   │
│   ├── 📂 contexts/                # React Context Providers
│   │   ├── AuthContext.jsx        # User authentication state
│   │   └── CartContext.jsx        # Shopping cart state management
│   │
│   ├── 📂 pages/                   # Application Pages
│   │   ├── HomePage.jsx           # Landing page with hero, categories
│   │   ├── ProductListPage.jsx    # Product catalog with filters
│   │   ├── ProductDetailsPage.jsx # Individual product view
│   │   ├── CartPage.jsx           # Shopping cart management
│   │   ├── CheckoutPage.jsx       # Order placement flow
│   │   ├── LoginPage.jsx          # User authentication
│   │   ├── SignupPage.jsx         # User registration
│   │   ├── UserDashboardPage.jsx  # User profile dashboard
│   │   └── 📂 admin/              # Admin Panel Pages
│   │       ├── AdminLoginPage.jsx        # Admin authentication
│   │       ├── DynamicAdminDashboard.jsx # Analytics dashboard
│   │       ├── ProductManagementPage.jsx # Product CRUD operations
│   │       ├── OrderManagementPage.jsx   # Order management
│   │       └── CustomerManagementPage.jsx # User management
│   │
│   ├── 📂 layouts/                 # Layout Components
│   │   ├── MainLayout.jsx         # User-facing layout with header/footer
│   │   └── AdminLayout.jsx        # Admin panel layout with sidebar
│   │
│   ├── 📂 services/               # API Services
│   │   └── api.js                 # Axios configuration & API calls
│   │
│   ├── 📂 hooks/                  # Custom React Hooks
│   │   └── useApi.js              # API integration hooks
│   │
│   └── 📂 routes/                 # Routing Configuration
│       └── AppRoutes.jsx          # Complete app routing setup
│
├── 📂 backend/                    # Backend Source Code
│   ├── 📂 models/                 # MongoDB Schema Definitions
│   │   ├── User.js                # User model with authentication
│   │   ├── Product.js             # Product schema
│   │   ├── Order.js               # Order management schema
│   │   ├── Cart.js                # Shopping cart schema
│   │   ├── Wishlist.js            # Wishlist schema
│   │   ├── Address.js             # User address schema
│   │   └── Review.js              # Product review schema
│   │
│   ├── 📂 controllers/            # Business Logic Controllers
│   │   ├── authController.js      # Authentication logic
│   │   ├── productController.js   # Product management
│   │   ├── orderController.js     # Order processing
│   │   ├── cartController.js      # Cart operations
│   │   ├── userController.js      # User profile management
│   │   └── adminController.js     # Admin operations
│   │
│   ├── 📂 routes/                 # API Route Definitions
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── productRoutes.js       # Product CRUD endpoints
│   │   ├── orderRoutes.js         # Order management endpoints
│   │   ├── cartRoutes.js          # Cart operations
│   │   ├── userRoutes.js          # User profile endpoints
│   │   └── adminRoutes.js         # Admin panel endpoints
│   │
│   ├── 📂 middlewares/            # Custom Middleware
│   │   ├── authMiddleware.js      # JWT token verification
│   │   ├── corsMiddleware.js      # CORS configuration
│   │   └── errorMiddleware.js     # Global error handling
│   │
│   ├── 📂 schemas/                # Data Schemas
│   │   └── productSchema.js       # Dynamic product generation
│   │
│   ├── server.js                  # Express server setup
│   ├── seeder.js                  # Database seeding script
│   └── package.json               # Backend dependencies
│
├── 📄 package.json                # Frontend dependencies
├── 📄 vite.config.js              # Vite configuration
├── 📄 tailwind.config.js          # TailwindCSS configuration
└── 📄 README.md                   # Project documentation
```

## 🔄 Application Workflow & Data Flow

### **1. User Authentication Flow**

**Authentication Process:**
1. User accesses application → Check authentication status
2. If not authenticated → Redirect to Login/Signup page
3. User chooses Email/Password or Social Login (Google/Facebook)
4. Backend validates credentials → Generate JWT token
5. Token stored in LocalStorage + AuthContext
6. User gains access to protected routes and features

### **2. Product Management Workflow**
```javascript
// Frontend: Product fetching with filters
const ProductAPI = {
  getAllProducts: async (params = {}) => {
    // GET /api/products with query parameters
    const response = await apiClient.get('/products', { params });
    return response.data;
  }
};

// Backend: Dynamic product generation
exports.getAllProducts = async (req, res) => {
  // Extract filters from query parameters
  const { page, limit, category, search, sortBy, minPrice, maxPrice } = req.query;
  
  // Generate products from schema
  let allProducts = productDatabase.forEach(categoryData => {
    const categoryProducts = categoryData.products.map(template => {
      return productGenerator.generateRandomProduct();
    });
  });
  
  // Apply filters and pagination
  // Return structured response
};
```

### **3. Shopping Cart Management**
```javascript
// Cart Context Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update existing item quantity
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Real-time cart count calculation
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
};
```

### **4. Order Processing Pipeline**

**Complete Order Flow:**
1. **Cart Review** → Validate products and quantities
2. **Address Selection** → Choose or add delivery address
3. **Payment Method** → Select COD or Online Payment
4. **Order Confirmation** → Generate Order ID and Invoice
5. **Order Tracking** → Real-time status updates
6. **Delivery Management** → Admin order fulfillment

### **5. Admin Dashboard Analytics**
```javascript
// Dynamic dashboard with real-time data
const DynamicAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    categoryData: [],
    salesData: []
  });

  // Fetch data from multiple API endpoints
  useEffect(() => {
    const fetchDashboardData = async () => {
      const [products, stats, topProducts] = await Promise.all([
        ProductAPI.getAllProducts({ limit: 50 }),
        ProductAPI.getProductStats(),
        ProductAPI.getTopSellingProducts(5)
      ]);
      
      // Process and set dashboard data
    };
    fetchDashboardData();
  }, []);
};
```

## 🔐 Authentication & Security Implementation

### **JWT Authentication System**
```javascript
// Token Generation (Backend)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Authentication Context (Frontend)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };
};
```

### **Social Login Integration**
- **Google OAuth 2.0** - Passport.js Google Strategy
- **Facebook Login** - Passport.js Facebook Strategy
- **Session Management** - Express sessions with MongoDB store

## 📊 Database Schema Design

### **User Schema**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.socialLogin; } },
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    newsletter: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });
```

### **Order Schema**
```javascript
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { /* address fields */ },
  paymentMethod: { type: String, default: 'COD' },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ installed
- MongoDB running locally or cloud instance
- Git for version control

### **Installation & Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VSah7079/GrocerryPoint.git
   cd GrocerryPoint
   ```

2. **Install Dependencies**
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Backend environment setup
   cd backend
   node setup-env.js  # Creates .env file with required variables
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Update MONGODB_URL in backend/.env if needed
   
   # Seed database with sample data
   cd backend
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start Backend (Port 8080)
   cd backend
   npm run dev

   # Terminal 2: Start Frontend (Port 5173)
   npm run dev
   ```

6. **Access Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8080
   - **Admin Panel**: http://localhost:5173/admin

## 🎯 API Endpoints Documentation

### **Authentication Endpoints**
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/admin-login  # Admin login
PUT    /api/auth/profile      # Update user profile
GET    /api/auth/google       # Google OAuth login
GET    /api/auth/facebook     # Facebook OAuth login
```

### **Product Endpoints**
```
GET    /api/products          # Get all products (with filters)
GET    /api/products/:id      # Get product by ID
POST   /api/products          # Create new product (Admin)
PUT    /api/products/:id      # Update product (Admin)
DELETE /api/products/:id      # Delete product (Admin)
GET    /api/products/categories        # Get all categories
GET    /api/products/featured         # Get featured products
GET    /api/products/top-selling      # Get top selling products
GET    /api/products/stats           # Get product statistics
```

### **Order Endpoints**
```
GET    /api/orders           # Get user orders
POST   /api/orders           # Create new order
GET    /api/orders/:id       # Get order details
PUT    /api/orders/:id       # Update order status (Admin)
```

## 💻 Development Scripts

### **Frontend Commands**
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code analysis
```

### **Backend Commands**
```bash
npm run dev          # Start with Nodemon (auto-reload)
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run seed:destroy # Clear all seeded data
```

## 🔧 Configuration Files

### **Vite Configuration** (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
```

### **TailwindCSS Configuration** (`tailwind.config.js`)
```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.green
      }
    }
  }
};
```

## 🌟 Key Features Implementation

### **1. Responsive Design**
- Mobile-first approach using TailwindCSS
- Responsive navigation with mobile menu
- Grid layouts that adapt to screen sizes
- Touch-friendly interfaces for mobile users

### **2. State Management**
- **AuthContext**: User authentication state across the app
- **CartContext**: Real-time cart state with persistence
- **LocalStorage**: Persist user session and cart data

### **3. Performance Optimizations**
- Code splitting with React Router
- Lazy loading for admin components
- Optimized images with proper sizing
- API response caching strategies

### **4. Error Handling**
- Global error boundaries in React
- API error handling with user-friendly messages
- Form validation with real-time feedback
- Network error recovery mechanisms

## 🚀 Deployment Guide

### **Frontend Deployment (Vercel/Netlify)**
```bash
npm run build        # Generate production build
# Deploy dist/ folder to hosting service
```

### **Backend Deployment (Heroku/Railway)**
```bash
# Ensure all environment variables are set
# Deploy with Node.js buildpack
# Set PORT environment variable for hosting service
```

### **Database Deployment (MongoDB Atlas)**
- Create MongoDB Atlas cluster
- Update MONGODB_URL in production environment
- Configure IP whitelist and security settings

## 📝 Project Insights & Learning Outcomes

### **Technical Skills Demonstrated**
- **Full-Stack Development**: Complete MERN stack implementation
- **Modern React Patterns**: Hooks, Context API, functional components
- **RESTful API Design**: Well-structured endpoints with proper HTTP methods
- **Database Modeling**: Efficient MongoDB schema design
- **Authentication Systems**: JWT + Social login implementation
- **Responsive UI/UX**: Modern, mobile-first design approach
- **State Management**: Global state handling with Context API
- **Error Handling**: Comprehensive error management strategies

### **Software Engineering Practices**
- **Component Architecture**: Reusable, maintainable React components
- **Separation of Concerns**: Clear distinction between frontend/backend logic
- **API Design**: Consistent, documented REST API structure
- **Code Organization**: Logical folder structure and file naming
- **Security Implementation**: Password hashing, JWT tokens, input validation

### **Real-World Applications**
This project demonstrates practical e-commerce development skills applicable to:
- Online retail platforms
- Marketplace development
- Admin dashboard creation
- User authentication systems
- Payment processing integration
- Inventory management systems

---

## 📞 Contact & Support

**Developer**: Satish Das  
**GitHub**: [@VSah7079](https://github.com/VSah7079)  
**Repository**: [GrocerryPoint](https://github.com/VSah7079/GrocerryPoint)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*This comprehensive documentation showcases the complete architecture, implementation details, and technical depth of the GrocerryPoint e-commerce platform. The project demonstrates modern full-stack development practices with a focus on scalability, security, and user experience.*
