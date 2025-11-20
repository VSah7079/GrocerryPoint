import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false, // Changed from true to false for CORS
});

// Add auth token to requests - check both user and admin tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  
  // Use admin token for admin routes, otherwise use regular token
  const authToken = config.url?.includes('/admin') || adminToken ? adminToken || token : token;
  
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Product API
export const ProductAPI = {
  getAllProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    console.log('Backend response:', res.data); // Debug log
    
    // Handle different response formats
    let products = [];
    
    if (res.data.success && res.data.data) {
      // New enhanced API format: { success: true, data: [...], pagination: {...} }
      products = res.data.data;
    } else if (Array.isArray(res.data)) {
      // Old format: directly array of products
      products = res.data;
    } else {
      // Fallback
      products = [];
    }
    
    return { 
      success: true, 
      data: { 
        products: Array.isArray(products) ? products : [] 
      } 
    };
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    const product = res.data.success ? res.data.data : res.data;
    return { success: true, data: { product } };
  },
  getFeaturedProducts: async (limit = 6) => {
    const res = await api.get('/products/featured', { params: { limit } });
    const products = res.data.success ? res.data.data : res.data;
    return { success: true, data: { products: Array.isArray(products) ? products : [] } };
  },
  getProductsByCategory: async (category) => {
    const res = await api.get('/products');
    const categoryProducts = res.data.filter(p => p.category === category);
    return { success: true, data: { products: categoryProducts } };
  },
  getProductStats: async () => {
    const res = await api.get('/products');
    return {
      success: true,
      data: {
        totalProducts: res.data.length,
        featuredProducts: res.data.filter(p => p.isFeatured).length
      }
    };
  },
  createProduct: async (productData) => {
    try {
      console.log('API: Creating product with data:', productData);
      const res = await api.post('/products', productData);
      console.log('API: Create response:', res.data);
      const product = res.data.success ? res.data.data : res.data;
      return { success: true, data: { product } };
    } catch (error) {
      console.error('API: Error creating product:', error);
      throw error;
    }
  },
  updateProduct: async (id, productData) => {
    try {
      console.log('API: Updating product with ID:', id, 'Data:', productData);
      const res = await api.put(`/products/${id}`, productData);
      console.log('API: Update response:', res.data);
      const product = res.data.success ? res.data.data : res.data;
      return { success: true, data: { product } };
    } catch (error) {
      console.error('API: Error updating product:', error);
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      console.log('API: Deleting product with ID:', id);
      const res = await api.delete(`/products/${id}`);
      console.log('API: Delete response:', res.data);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('API: Error deleting product:', error);
      throw error;
    }
  },
  
  // ADMIN-SPECIFIC FUNCTIONS FOR DYNAMIC MANAGEMENT
  getAdminProductStats: async () => {
    try {
      const res = await api.get('/products/admin/stats');
      return res.data;
    } catch (error) {
      console.error('API: Error fetching admin stats:', error);
      throw error;
    }
  },
  
  bulkUpdateProducts: async (productIds, updates) => {
    try {
      const res = await api.put('/products/admin/bulk-update', { productIds, updates });
      return res.data;
    } catch (error) {
      console.error('API: Error bulk updating products:', error);
      throw error;
    }
  },
  
  updateProductStock: async (productId, quantity, type, reason) => {
    try {
      const res = await api.put(`/products/admin/${productId}/stock`, {
        quantity,
        type, // 'add' or 'remove'
        reason
      });
      return res.data;
    } catch (error) {
      console.error('API: Error updating stock:', error);
      throw error;
    }
  },
  
  getProductCategories: async () => {
    try {
      // Get unique categories from products
      const products = await ProductAPI.getAllProducts();
      const categories = [...new Set(products.data.products.map(p => p.category))].filter(Boolean);
      return { success: true, data: { categories } };
    } catch (error) {
      console.error('API: Error fetching categories:', error);
      throw error;
    }
  }
};

// Auth API
export const AuthAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    // Don't auto-store token on signup - user must verify email first
    // Token will only be present if email verification is not required
    if (res.data.success && res.data.data && res.data.data.token && !res.data.requiresVerification) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    return { success: true, message: 'Logged out successfully' };
  },
  adminLogin: async (credentials) => {
    const res = await api.post('/auth/admin-login', credentials);
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('adminToken', res.data.data.token);
    }
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', email);
    return res.data;
  },
  resetPassword: async (token, password) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },
  verifyEmail: async (token) => {
    const res = await api.post(`/auth/verify-email/${token}`);
    return res.data;
  },
  resendVerification: async (email) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  },
};

// Cart API
export const CartAPI = {
  getCart: async () => {
    const res = await api.get('/cart');
    return { success: true, data: { cart: res.data } };
  },
  addToCart: async (productId, quantity) => {
    const res = await api.post('/cart', { productId, quantity });
    return { success: true, data: { cart: res.data } };
  },
  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return { success: true, data: { cart: res.data } };
  },
  updateQuantity: async (productId, quantity) => {
    const res = await api.put('/cart', { productId, quantity });
    return { success: true, data: { cart: res.data } };
  },
  clearCart: async () => {
    const res = await api.delete('/cart');
    return { success: true, data: { cart: res.data } };
  },
};

// Wishlist API
export const WishlistAPI = {
  getWishlist: async () => {
    const res = await api.get('/wishlist');
    return { success: true, data: { wishlist: res.data } };
  },
  addToWishlist: async (productId) => {
    const res = await api.post('/wishlist', { productId });
    return { success: true, data: { wishlist: res.data } };
  },
  removeFromWishlist: async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return { success: true, data: { wishlist: res.data } };
  },
};

// Order API
export const OrderAPI = {
  // Customer Order Functions
  getUserOrders: async () => {
    const res = await api.get('/orders/my');
    return { success: true, data: { orders: res.data } };
  },
  getOrderById: async (orderId) => {
    const res = await api.get(`/orders/${orderId}`);
    return { success: true, data: { order: res.data } };
  },
  placeOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return { success: true, data: { order: res.data } };
  },
  
  // Admin Order Functions
  getAllOrders: async (params = {}) => {
    const res = await api.get('/orders', { params });
    return { success: true, data: { orders: Array.isArray(res.data) ? res.data : [] } };
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}`, { status });
    return { success: true, data: { order: res.data } };
  },
  cancelOrder: async (orderId) => {
    const res = await api.put(`/orders/${orderId}/cancel`);
    return { success: true, data: { order: res.data } };
  },
  getOrderStats: async () => {
    const res = await api.get('/orders/stats');
    return { success: true, data: res.data };
  },
};

// Address API
export const AddressAPI = {
  getUserAddresses: async () => {
    const res = await api.get('/addresses');
    return { success: true, data: { addresses: res.data } };
  },
  addAddress: async (addressData) => {
    const res = await api.post('/addresses', addressData);
    return { success: true, data: { address: res.data } };
  },
  updateAddress: async (addressId, addressData) => {
    const res = await api.put(`/addresses/${addressId}`, addressData);
    return { success: true, data: { address: res.data } };
  },
  deleteAddress: async (addressId) => {
    const res = await api.delete(`/addresses/${addressId}`);
    return { success: true, message: 'Address deleted successfully' };
  },
};

// Contact API
export const ContactAPI = {
  submitForm: async (formData) => {
    const res = await api.post('/contact', formData);
    return { success: true, message: 'Contact form submitted successfully' };
  },
};

// Newsletter API
export const NewsletterAPI = {
  subscribe: async (email) => {
    const res = await api.post('/newsletter', { email });
    return { success: true, message: 'Subscribed to newsletter successfully' };
  },
};

// Category API
export const CategoryAPI = {
  getAllCategories: async () => {
    const res = await api.get('/categories');
    return { success: true, data: { categories: res.data } };
  },
  getCategoryById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return { success: true, data: { category: res.data } };
  },
  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return { success: true, data: { category: res.data } };
  },
  updateCategory: async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return { success: true, data: { category: res.data } };
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return { success: true, message: 'Category deleted successfully' };
  },
};

// Wallet API
export const WalletAPI = {
  getWalletBalance: async () => {
    try {
      const res = await api.get('/wallet');
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch wallet balance');
    }
  },
  getWalletHistory: async () => {
    try {
      const res = await api.get('/wallet/history');
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch wallet history');
    }
  },
  addMoney: async (amount, paymentMethod = 'card') => {
    try {
      const res = await api.post('/wallet/add', { amount, paymentMethod });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add money to wallet');
    }
  },
  processOrderPayment: async (orderId, amount) => {
    try {
      const res = await api.post('/wallet/pay-order', { orderId, amount });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to process payment');
    }
  },
};

// Upload API
export const UploadAPI = {
  uploadProductImage: async (formData) => {
    try {
      const res = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload product image');
    }
  },
  uploadProductGallery: async (formData) => {
    try {
      const res = await api.post('/upload/product-gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload product gallery');
    }
  },
  uploadUserAvatar: async (formData) => {
    try {
      const res = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload avatar');
    }
  },
  uploadCategoryImage: async (formData) => {
    try {
      const res = await api.post('/upload/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload category image');
    }
  },
  deleteFile: async (filename) => {
    try {
      const res = await api.delete(`/upload/${filename}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete file');
    }
  },
  listFiles: async () => {
    try {
      const res = await api.get('/upload/list');
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to list files');
    }
  },
  getFileInfo: async (filename) => {
    try {
      const res = await api.get(`/upload/info/${filename}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get file info');
    }
  },
};

// Admin API
export const AdminAPI = {
  // Dashboard & Analytics
  getDashboardStats: async () => {
    const res = await api.get('/admin/stats');
    return { success: true, data: res.data };
  },
  
  // Customer Management
  getAllCustomers: async (params = {}) => {
    const res = await api.get('/admin/customers', { params });
    return { success: true, data: res.data };
  },
  getCustomerById: async (customerId) => {
    const res = await api.get(`/admin/customers/${customerId}`);
    return { success: true, data: res.data };
  },
  updateCustomerStatus: async (customerId, status) => {
    const res = await api.put(`/admin/customers/${customerId}/status`, { status });
    return { success: true, data: res.data };
  },
  deleteCustomer: async (customerId) => {
    const res = await api.delete(`/admin/customers/${customerId}`);
    return { success: true, message: 'Customer deleted successfully' };
  },
  
  // Order Management
  getAllOrders: async (params = {}) => {
    const res = await api.get('/admin/orders', { params });
    return { success: true, data: res.data };
  },
  getOrderById: async (orderId) => {
    const res = await api.get(`/admin/orders/${orderId}`);
    return { success: true, data: res.data };
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return { success: true, data: res.data };
  },
  bulkUpdateOrders: async (orderIds, action) => {
    const res = await api.put('/admin/orders/bulk', { orderIds, action });
    return { success: true, data: res.data };
  },
  
  // Product Management (Admin specific)
  getAllProducts: async (params = {}) => {
    const res = await api.get('/admin/products', { params });
    return { success: true, data: res.data };
  },
  updateProductStock: async (productId, stock) => {
    const res = await api.put(`/admin/products/${productId}/stock`, { stock });
    return { success: true, data: res.data };
  },
  bulkUpdateProducts: async (productIds, action) => {
    const res = await api.put('/admin/products/bulk', { productIds, action });
    return { success: true, data: res.data };
  },
  
  // Analytics & Reports
  getSalesAnalytics: async (params = {}) => {
    const res = await api.get('/admin/analytics/sales', { params });
    return { success: true, data: res.data };
  },
  getProductAnalytics: async () => {
    const res = await api.get('/admin/analytics/products');
    return { success: true, data: res.data };
  },
  getCustomerAnalytics: async () => {
    const res = await api.get('/admin/analytics/customers');
    return { success: true, data: res.data };
  },
};
