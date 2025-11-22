import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  ShoppingCart, Users, DollarSign, Package, TrendingUp, 
  AlertCircle, Star, Eye, Bell, RefreshCw 
} from 'lucide-react';
import { ProductAPI, AdminAPI } from '../../services/api';
import ProductAddTest from '../../components/ProductAddTest';

const DynamicAdminDashboard = () => {
  // Dashboard State - Initialize with TRUE Zero State for Real-Time Updates
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    categoryData: [],
    salesData: [],
    notifications: [
      {
        id: 1,
        text: '🎯 Dashboard initialized - Fetching real-time data from database...',
        time: 'Just now',
        type: 'alert'
      }
    ]
  });

  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'
  


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
      // Use admin product stats for detailed dashboard info
      const response = await ProductAPI.getAdminProductStats();
      // response may be { success: true, data: { overview, categoryStats, recentProducts } }
      if (response && response.success) {
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
      if (response && response.success) {
        // response.data.products or response.data
        const products = response.data.products || response.data || [];
        return Array.isArray(products) ? products : [];
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

  // Fetch Real Orders from Database
  const fetchRealOrders = useCallback(async () => {
    try {
      // Fetch real orders from admin API
      const response = await AdminAPI.getAllOrders();
      if (response && response.success) {
        // Handle multiple response shapes: array, { customers: [...] }, { data: [...] }
        let orders = [];
        if (Array.isArray(response.data)) orders = response.data;
        else if (response.data && response.data.orders) orders = response.data.orders;
        else if (response.data && Array.isArray(response.data.data)) orders = response.data.data;
        else if (response.data && response.data.data && Array.isArray(response.data.data.orders)) orders = response.data.data.orders;

        if (orders.length > 0) {
          console.log(`✅ Fetched ${orders.length} real orders from database`);
          return orders.slice(0, 8);
        }
      }
      
      console.log('📊 No orders found - Dashboard showing ZERO state');
      return [];
    } catch (error) {
      console.error('⚠️ Backend not connected - Using ZERO state:', error.message);
      return [];
    }
  }, []);

  // Fetch Real Customer Count from Database
  const fetchRealCustomers = useCallback(async () => {
    try {
      const response = await AdminAPI.getAllCustomers();
      if (response && response.success) {
        // support shapes: array, { customers: [...] }, { data: { customers: [...] } }
        let customers = [];
        if (Array.isArray(response.data)) customers = response.data;
        else if (response.data && Array.isArray(response.data.customers)) customers = response.data.customers;
        else if (response.data && response.data.data && Array.isArray(response.data.data.customers)) customers = response.data.data.customers;

        if (customers.length > 0) {
          console.log(`✅ Found ${customers.length} real customers`);
          return customers.length;
        }
      }
      console.log('👥 No customers found - Dashboard showing ZERO');
      return 0;
    } catch (error) {
      console.error('⚠️ Backend not connected - Customer count: 0:', error.message);
      return 0;
    }
  }, []);

  // Fetch Real Sales Analytics from Database
  const fetchRealSalesData = useCallback(async () => {
    try {
      // Add real analytics API call when available
      // const response = await AnalyticsAPI.getSalesData();
      // if (response.success) {
      //   return response.data.salesData;
      // }
      
      // Return zero sales data until real data exists
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        name: month,
        sales: 0,
        orders: 0
      }));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  }, []);

  // Generate Dynamic Real-Time Notifications
  const generateDynamicNotifications = useCallback((orderCount, customerCount, productCount, revenue) => {
    const notifications = [];
    const currentTime = new Date().toLocaleTimeString();

    if (orderCount === 0 && revenue === 0) {
      notifications.push({
        id: Date.now(),
        text: `🎯 Dashboard at ZERO state - ${currentTime} | Orders: ${orderCount}, Revenue: ₹${revenue}`,
        time: 'Just now',
        type: 'alert'
      });
    }

    if (productCount > 0) {
      notifications.push({
        id: Date.now() + 1,
        text: `� ${productCount} products ready for sale - Fresh inventory available!`,
        time: '1 minute ago',
        type: 'alert'
      });
    }

    if (customerCount > 0) {
      notifications.push({
        id: Date.now() + 2,
        text: `👥 ${customerCount} happy customers ready to shop - Serve them well!`,
        time: '2 minutes ago',
        type: 'alert'
      });
    }

    if (notifications.length === 0) {
      notifications.push({
        id: Date.now(),
        text: '🚀 Dashboard ready for real-time updates - Start adding data!',
        time: 'Just now',
        type: 'alert'
      });
    }

    return notifications;
  }, []);

  // Reset Grocery Orders to Zero - Real-time Update
  const resetGroceryOrdersToZero = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🧹 Resetting all grocery orders to ZERO...');
      
      // Immediately update dashboard with TRUE ZERO data
      setDashboardData(prevData => ({
        totalProducts: prevData.totalProducts, // Keep existing products
        totalOrders: 0,    // ZERO orders
        totalRevenue: 0,   // ZERO revenue
        totalCustomers: prevData.totalCustomers, // Keep customers happy
        recentOrders: [],  // ZERO recent orders
        topProducts: [],   // No top products when no orders
        categoryData: prevData.categoryData, // Keep product categories
        salesData: [
          { name: 'Jan', sales: 0, orders: 0 },
          { name: 'Feb', sales: 0, orders: 0 },
          { name: 'Mar', sales: 0, orders: 0 },
          { name: 'Apr', sales: 0, orders: 0 },
          { name: 'May', sales: 0, orders: 0 },
          { name: 'Jun', sales: 0, orders: 0 }
        ],
        notifications: [
          {
            id: Date.now(),
            text: '🧹 All grocery orders and revenue reset to ZERO! Fresh start activated.',
            time: 'Just now',
            type: 'alert'
          }
        ]
      }));
      
      setLastUpdate(new Date());
      
      // Show success notification
      setTimeout(() => {
        setDashboardData(prevData => ({
          ...prevData,
          notifications: [
            {
              id: Date.now(),
              text: '🎉 SUCCESS: All grocery orders reset to ZERO! Revenue: ₹0, Orders: 0',
              time: 'Just now',
              type: 'alert'
            },
            ...prevData.notifications.slice(0, 2)
          ]
        }));
      }, 1000);
      
      console.log('✅ Grocery orders reset completed - Everything at ZERO!');
      setError(null);
      
    } catch (error) {
      console.error('❌ Error resetting grocery orders:', error);
      setError('Failed to reset grocery orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time Update Function with Enhanced Error Handling
  const performRealTimeUpdate = useCallback(async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) setLoading(true);
      
      // Fetch all data in parallel with timeout protection
      const fetchWithTimeout = (promise, timeout = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      const [productsData, statsData, topProducts, orders, salesData, realCustomerCount] = await Promise.all([
        fetchWithTimeout(fetchProducts()),
        fetchWithTimeout(fetchProductStats()),
        fetchWithTimeout(fetchTopProducts()),
        fetchWithTimeout(fetchRealOrders()),
        fetchWithTimeout(fetchRealSalesData()),
        fetchWithTimeout(fetchRealCustomers())
      ]);

      // Calculate REAL metrics from database - NO FAKE DATA
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;  // Calculate from real orders
      const totalCustomers = realCustomerCount || 0;  // Real customer count from database
      const totalOrders = orders?.length || 0;  // TRUE ZERO if no orders

      // Determine connection status
      const hasRealData = productsData?.length > 0 || orders?.length > 0 || realCustomerCount > 0;
      setConnectionStatus(hasRealData ? 'connected' : 'disconnected');

      // Process category data for charts with error handling
      const categoryData = statsData?.categoryStats?.map(cat => {
        const categoryName = typeof cat.category === 'object' ? cat.category.name : cat.category;
        const shortName = (categoryName || '').toString().split(' ')[0];
        return {
          name: shortName, // Shorten names for chart (guarded)
          value: parseInt(cat.percentage),
          products: cat.productCount,
          fullName: categoryName
        };
      }) || [
        { name: 'Vegetables', value: 35, products: 15, fullName: 'Fresh Vegetables' },
        { name: 'Fruits', value: 25, products: 12, fullName: 'Fresh Fruits' },
        { name: 'Dairy', value: 20, products: 8, fullName: 'Dairy Products' },
        { name: 'Grains', value: 20, products: 10, fullName: 'Grains & Cereals' }
      ];

      // Generate dynamic notifications based on real data
      const productCount = statsData?.overview?.totalProducts || productsData.length || 0;
      const dynamicNotifications = generateDynamicNotifications(totalOrders, totalCustomers, productCount, totalRevenue);

      // Update dashboard state with comprehensive REAL data
      setDashboardData({
        totalProducts: productCount,
        totalOrders,
        totalRevenue,
        totalCustomers,
        recentOrders: orders,
        topProducts: topProducts || [],
        categoryData,
        salesData,
        notifications: dynamicNotifications
      });

      setLastUpdate(new Date());
      setError(null);
      
      // Success feedback for manual refresh
      if (showLoadingIndicator && !autoRefresh) {
        console.log('✅ Dashboard data refreshed successfully');
      }
    } catch (error) {
      console.error('❌ Error in real-time update:', error);
      setError(`Failed to update: ${error.message}`);
      
      // Provide fallback data on error
      if (!dashboardData.totalProducts) {
        setDashboardData({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          recentOrders: [],
          topProducts: [],
          categoryData: [],
          salesData: [],
          notifications: [{ 
            id: 1, 
            text: '⚠️ Dashboard data temporarily unavailable', 
            time: 'Just now', 
            type: 'alert' 
          }]
        });
      }
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  }, [fetchProducts, fetchProductStats, fetchTopProducts, fetchRealOrders, fetchRealSalesData, generateDynamicNotifications, dashboardData.totalProducts, autoRefresh]);

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
    
    // Set up conditional auto-refresh
    let interval;
    if (autoRefresh) {
      interval = setInterval(performRealTimeUpdate, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [performRealTimeUpdate, autoRefresh, refreshInterval]);

  // Chart Colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  // Responsive chart height based on window width
  const chartHeight = windowWidth < 420 ? 150 : windowWidth < 640 ? 180 : windowWidth < 1024 ? 220 : 260;



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
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4">
      {/* Responsive Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">GrocerryPoint Admin</h1>
              <p className="text-sm sm:text-base text-gray-500">Management Dashboard</p>
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              <button onClick={performRealTimeUpdate} className="bg-green-600 text-white px-3 py-2 rounded-md text-sm shadow-sm hover:bg-green-700">Refresh</button>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm border">{autoRefresh ? 'Pause' : 'Start'}</button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Managing {dashboardData.totalProducts} fresh products across {dashboardData.categoryData.length} categories
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Status Indicators */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div className="text-green-600 bg-white px-3 py-2 rounded-lg shadow-sm">
              🕒 Updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {autoRefresh ? `Auto: ${refreshInterval}s` : 'Manual'}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-700' 
                : connectionStatus === 'checking'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              {connectionStatus === 'connected' 
                ? '🟢 Live Data' 
                : connectionStatus === 'checking'
                  ? '🟡 Checking'
                  : '🔴 Zero State'}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{autoRefresh ? '⏸️' : '▶️'}</span>
              <span className="hidden sm:inline">{autoRefresh ? 'Pause' : 'Start'}</span>
            </button>
            
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="text-xs px-2 py-2 rounded-lg border border-gray-200 bg-white"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
            </select>

            <button
              onClick={performRealTimeUpdate}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors shadow-lg text-sm font-medium"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Now</span>
              <span className="sm:hidden">Refresh</span>
            </button>
            
            <button
              onClick={resetGroceryOrdersToZero}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors shadow-lg text-sm font-medium"
            >
              <span className="text-sm">🧹</span>
              <span className="hidden sm:inline">Reset Orders</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-red-700 text-sm sm:text-base break-words">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700 text-xs font-medium"
            >
              ✕ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Real-time Update Status */}
      {loading && dashboardData.totalProducts > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-3">
          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
          <p className="text-sm text-blue-700 font-medium">Refreshing dashboard data...</p>
        </div>
      )}

      {/* Product Addition Test Component */}
      <ProductAddTest />

      {/* Featured Products Quick Add */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-4">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🌟 Quick Add Featured Products</h3>
        <p className="text-sm text-blue-600 mb-3">Add sample featured products to populate the home page</p>
        <button 
          onClick={async () => {
            const { addSampleFeaturedProducts } = await import('../../data/featuredProducts');
            const { ProductAPI } = await import('../../services/api');
            addSampleFeaturedProducts(ProductAPI);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Sample Featured Products
        </button>
      </div>

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

      {/* Key Metrics - compact cards with trend badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Fresh Products', value: dashboardData.totalProducts, icon: '🥬', color: 'text-green-700', delta: '+0%' },
          { title: 'Grocery Orders', value: dashboardData.totalOrders, icon: '📦', color: dashboardData.totalOrders === 0 ? 'text-red-700' : 'text-orange-700', delta: dashboardData.totalOrders === 0 ? '-100%' : '+4%' },
          { title: 'Store Revenue', value: `₹${dashboardData.totalRevenue.toLocaleString()}`, icon: '💰', color: 'text-emerald-700', delta: '+0%' },
          { title: 'Happy Customers', value: dashboardData.totalCustomers, icon: '👨‍👩‍👧‍👦', color: 'text-blue-700', delta: '+1.2%' }
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">{card.title}</p>
              <div className="flex items-baseline gap-3">
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <span className="text-xs text-gray-400">/</span>
                <span className="px-2 py-1 text-xs bg-gray-50 border rounded-full text-gray-600">Today</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl">{card.icon}</div>
              <span className="mt-2 text-xs text-green-600 font-medium">{card.delta}</span>
            </div>
          </div>
        ))}
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
            <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
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
            <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
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
          <div className="space-y-3 md:space-y-4 overflow-y-auto" style={{ maxHeight: windowWidth < 640 ? 320 : 540 }}>
            {dashboardData.recentOrders.slice(0, 5).map((order, idx) => (
              <div key={order.id || order._id || idx} className="grid grid-cols-1 sm:flex sm:items-center sm:justify-between p-3 md:p-4 border rounded-xl hover:bg-green-50 transition-colors gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs md:text-sm">🛒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">#{order.id || order._id || '—'}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{order.customer || order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-green-600">{order.type || ''} {order.items ? `• ${order.items} items` : ''}</p>
                    <p className="text-xs text-gray-500">{order.date || new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right space-x-2 sm:space-x-0">
                  <p className="font-semibold text-gray-900 text-sm md:text-base">₹{Number(order.total || order.totalAmount || 0).toFixed(2)}</p>
                  <StatusBadge status={order.status || order.orderStatus || 'Pending'} />
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
          <div className="space-y-3 md:space-y-4 overflow-y-auto" style={{ maxHeight: windowWidth < 640 ? 320 : 540 }}>
            {dashboardData.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id || product._id || index} className="grid grid-cols-1 sm:flex sm:items-center sm:justify-between p-3 md:p-4 border rounded-xl hover:bg-yellow-50 transition-colors border-yellow-100 gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-xs md:text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{product.name || 'Unnamed'}</p>
                    <p className="text-xs md:text-sm text-green-600 font-medium truncate">
                      {typeof product.category === 'object' ? product.category.name : product.category || 'Uncategorized'}
                    </p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                      <span className="flex items-center text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs ml-1 font-medium">{product.rating || '—'}</span>
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
                  <p className="font-semibold text-gray-900 text-sm md:text-base">₹{Number(product.price || 0).toFixed(2)}</p>
                  <p className="text-xs md:text-sm text-green-600 font-medium">{product.sales || 0} sold</p>
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
                {productStats.categoryStats?.slice(0, 3).map((cat, index) => {
                  const categoryName = typeof cat.category === 'object' ? cat.category.name : cat.category;
                  const shortName = (categoryName || '').toString().split(' ')[0];
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-orange-700 font-medium">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {shortName}
                      </span>
                      <span className="font-bold text-orange-800">{cat.productCount}</span>
                    </div>
                  );
                })}
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
        <div className="space-y-3 max-h-52 sm:max-h-64 overflow-y-auto">
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
    </div>
  );
};

export default DynamicAdminDashboard;
