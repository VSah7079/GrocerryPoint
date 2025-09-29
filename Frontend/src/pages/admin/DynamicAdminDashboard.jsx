import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  ShoppingCart, Users, DollarSign, Package, TrendingUp, 
  AlertCircle, Star, Eye, Bell, RefreshCw 
} from 'lucide-react';
import { ProductAPI } from '../../services/api';

const DynamicAdminDashboard = () => {
  // Dashboard State
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    categoryData: [],
    salesData: [],
    notifications: []
  });

  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  


  // Fetch Products from API
  const fetchProducts = useCallback(async () => {
    try {
      const response = await ProductAPI.getAllProducts({ limit: 50 });
      if (response.success) {
        setProducts(response.data.products);
        return response.data.products;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      return [];
    }
  }, []);

  // Fetch Product Statistics
  const fetchProductStats = useCallback(async () => {
    try {
      const response = await ProductAPI.getProductStats();
      if (response.success) {
        setProductStats(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching product stats:', error);
      return null;
    }
  }, []);

  // Fetch Top Selling Products
  const fetchTopProducts = useCallback(async () => {
    try {
      const response = await ProductAPI.getTopSellingProducts(5);
      if (response.success) {
        return response.data.products;
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }, []);

  // Fetch Featured Products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await ProductAPI.getFeaturedProducts(6);
      if (response.success) {
        return response.data.products;
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }, []);

  // Generate Random Orders (Simulated)
  const generateRandomOrders = useCallback(() => {
    const orderStatuses = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const customerNames = ['Sharma Family', 'Patel Household', 'Kumar Family', 'Singh Residence', 'Gupta Family'];
    const groceryItems = ['Rice & Dal', 'Fresh Vegetables', 'Dairy Products', 'Spices & Oil', 'Mixed Groceries'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `GP${1000 + i}`,
      customer: customerNames[Math.floor(Math.random() * customerNames.length)],
      total: Math.floor(Math.random() * 1500) + 300,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      items: Math.floor(Math.random() * 8) + 2,
      type: groceryItems[Math.floor(Math.random() * groceryItems.length)]
    }));
  }, []);

  // Generate Sales Data
  const generateSalesData = useCallback(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 200) + 50
    }));
  }, []);

  // Generate Notifications
  const generateNotifications = useCallback(() => {
    const notifications = [
      '🛒 New grocery order from Rahul Sharma - ₹1,250 (Basmati Rice, Fresh Milk)',
      '📦 "Organic Turmeric Powder" is running low - Only 5 units left',
      '📊 Weekly fresh produce sales report is ready for review',
      '👋 New family joined GrocerryPoint: The Patels from Sector 15',
      '💳 Payment confirmed for grocery order #GP1001 - ₹890'
    ];
    
    return notifications.slice(0, 3).map((text, index) => ({
      id: index + 1,
      text,
      time: `${Math.floor(Math.random() * 60)} minutes ago`,
      type: index % 2 === 0 ? 'order' : 'alert'
    }));
  }, []);

  // Real-time Update Function
  const performRealTimeUpdate = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsData, statsData, topProducts, orders, salesData, notifications] = await Promise.all([
        fetchProducts(),
        fetchProductStats(),
        fetchTopProducts(),
        Promise.resolve(generateRandomOrders()),
        Promise.resolve(generateSalesData()),
        Promise.resolve(generateNotifications())
      ]);

      // Calculate metrics from product stats
      const totalRevenue = statsData?.overview?.totalRevenue || 0;
      const totalCustomers = Math.floor(Math.random() * 500) + 200;
      const totalOrders = statsData?.overview?.totalSales || 0;

      // Process category data for charts
      const categoryData = statsData?.categoryStats?.map(cat => ({
        name: cat.category.split(' ')[0], // Shorten names for chart
        value: parseInt(cat.percentage),
        products: cat.productCount
      })) || [];

      // Update dashboard state
      setDashboardData({
        totalProducts: statsData?.overview?.totalProducts || productsData.length,
        totalOrders,
        totalRevenue,
        totalCustomers,
        recentOrders: orders,
        topProducts: topProducts || [],
        categoryData,
        salesData,
        notifications
      });

      setLastUpdate(new Date());
      setError(null);
    } catch (error) {
      console.error('Error in real-time update:', error);
      setError('Failed to update dashboard data');
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchProductStats, fetchTopProducts, generateRandomOrders, generateSalesData, generateNotifications]);

  // Responsive state for chart sizing
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Dashboard
  useEffect(() => {
    performRealTimeUpdate();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(performRealTimeUpdate, 10000);
    
    return () => clearInterval(interval);
  }, [performRealTimeUpdate]);

  // Chart Colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];



  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Processing': return 'bg-yellow-100 text-yellow-800';
        case 'Pending': return 'bg-orange-100 text-orange-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  if (loading && !dashboardData.totalProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm sm:text-base text-gray-600">Loading dashboard data from API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* Responsive Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 truncate">GrocerryPoint Admin</h1>
              <p className="text-sm sm:text-base text-green-600 font-medium">Fresh Groceries Management Dashboard</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Managing {dashboardData.totalProducts} fresh products across {dashboardData.categoryData.length} categories
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-xs sm:text-sm text-green-600 bg-white px-3 py-2 rounded-lg shadow-sm text-center">
            🕒 Updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={performRealTimeUpdate}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Store Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Responsive Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm sm:text-base break-words">{error}</span>
        </div>
      )}

      {/* Responsive Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 shadow-sm">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">🏪</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-green-800 font-semibold text-sm sm:text-base">GrocerryPoint Store Status: Online</p>
          <p className="text-green-600 text-xs sm:text-sm break-words">
            ✅ {dashboardData.totalProducts} fresh products • {dashboardData.categoryData.length} categories • All systems operational
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fresh Products</p>
              <p className="text-3xl font-bold text-green-700">{dashboardData.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🥬</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium">� Available in store</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grocery Orders</p>
              <p className="text-3xl font-bold text-orange-700">{dashboardData.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2 font-medium">🚚 Fast delivery orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Store Revenue</p>
              <p className="text-3xl font-bold text-emerald-700">₹{dashboardData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2 font-medium">� Fresh groceries sales</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Happy Customers</p>
              <p className="text-3xl font-bold text-blue-700">{dashboardData.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2 font-medium">🏠 Families served</p>
        </div>
      </div>

      {/* Responsive Charts Section */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 xl:grid-cols-2 md:gap-4 xl:gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
              <span className="text-xs md:text-sm">📈</span>
            </div>
            <span className="truncate">GrocerryPoint Sales Trends</span>
          </h3>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <LineChart data={dashboardData.salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
              <span className="text-xs md:text-sm">🛒</span>
            </div>
            <span className="truncate">Grocery Categories Distribution</span>
          </h3>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={windowWidth < 640 ? 50 : windowWidth < 1024 ? 65 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Responsive Recent Orders and Top Products */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 xl:grid-cols-2 md:gap-4 xl:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
              <span className="text-xs md:text-sm">🛍️</span>
            </div>
            <span className="truncate">Recent Grocery Orders</span>
          </h3>
          <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
            {dashboardData.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-xl hover:bg-green-50 transition-colors space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs md:text-sm">🛒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">#{order.id}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{order.customer}</p>
                    <p className="text-xs text-green-600">{order.type} • {order.items} items</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right space-x-2 sm:space-x-0">
                  <p className="font-semibold text-gray-900 text-sm md:text-base">₹{order.total}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products from API */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
              <span className="text-xs md:text-sm">⭐</span>
            </div>
            <span className="truncate">Top Fresh Products</span>
          </h3>
          <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
            {dashboardData.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-xl hover:bg-yellow-50 transition-colors border-yellow-100 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-xs md:text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{product.name}</p>
                    <p className="text-xs md:text-sm text-green-600 font-medium truncate">{product.category}</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                      <span className="flex items-center text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs ml-1 font-medium">{product.rating}</span>
                      </span>
                      {product.isOrganic && (
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                          🌱 Organic
                        </span>
                      )}
                      <span className="text-xs text-orange-600 font-medium whitespace-nowrap">🔥 Bestseller</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right">
                  <p className="font-semibold text-gray-900 text-sm md:text-base">₹{product.price}</p>
                  <p className="text-xs md:text-sm text-green-600 font-medium">{product.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Product Statistics from API */}
      {productStats && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-purple-500">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
              <span className="text-xs md:text-sm">📊</span>
            </div>
            <span className="truncate">🥕 Fresh Inventory Analytics</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center justify-center">
                📦 Stock Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 font-medium">✅ Fresh Stock</span>
                  <span className="font-bold text-green-800">{productStats.stockStatus?.inStock || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-700 font-medium">⚠️ Low Stock</span>
                  <span className="font-bold text-yellow-800">{productStats.stockStatus?.lowStock || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-700 font-medium">❌ Out of Stock</span>
                  <span className="font-bold text-red-800">{productStats.stockStatus?.outOfStock || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center justify-center">
                💰 Price Range
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 font-medium">💵 Minimum</span>
                  <span className="font-bold text-blue-800">₹{productStats.priceRange?.min || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 font-medium">💎 Maximum</span>
                  <span className="font-bold text-blue-800">₹{productStats.priceRange?.max || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 font-medium">📊 Average</span>
                  <span className="font-bold text-blue-800">₹{productStats.overview?.avgPrice || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
              <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center justify-center">
                🛒 Top Categories
              </h4>
              <div className="space-y-3">
                {productStats.categoryStats?.slice(0, 3).map((cat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-orange-700 font-medium">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {cat.category.split(' ')[0]}
                    </span>
                    <span className="font-bold text-orange-800">{cat.productCount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Live Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
            <span className="text-xs md:text-sm">🔔</span>
          </div>
          <span className="truncate">Store Notifications</span>
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {dashboardData.notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                notification.type === 'order' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-gray-900 break-words">{notification.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicAdminDashboard;
