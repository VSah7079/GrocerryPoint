import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product API
export const ProductAPI = {
  getAllProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return { success: true, data: { products: res.data } };
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return { success: true, data: { product: res.data } };
  },
  getFeaturedProducts: async (limit = 6) => {
    const res = await api.get('/products');
    const featuredProducts = res.data.filter(p => p.isFeatured).slice(0, limit);
    return { success: true, data: { products: featuredProducts } };
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
    const res = await api.post('/products', productData);
    return { success: true, data: { product: res.data } };
  },
  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return { success: true, data: { product: res.data } };
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return { success: true, message: 'Product deleted successfully' };
  },
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
    if (res.data.success && res.data.data.token) {
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
    return { success: true, message: 'Logged out successfully' };
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
  getAllOrders: async () => {
    const res = await api.get('/orders');
    return { success: true, data: { orders: res.data } };
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}`, { status });
    return { success: true, data: { order: res.data } };
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

// Admin API
export const AdminAPI = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/stats');
    return { success: true, data: res.data };
  },
};
