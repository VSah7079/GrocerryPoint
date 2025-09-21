// Mock API Service - Frontend Only Version
import { MockProductAPI } from '../data/mockProducts';
import { MockAuthAPI, MockCartAPI, MockWishlistAPI, MockOrderAPI, MockContactAPI, MockNewsletterAPI } from '../data/mockAPI';

// Simulate network delay for realistic experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Product API Service (using mock data)
export const ProductAPI = {
  // Get all products with filters and pagination
  getAllProducts: async (params = {}) => {
    try {
      await delay(300);
      return await MockProductAPI.getAllProducts(params);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      await delay(200);
      return await MockProductAPI.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      await delay(250);
      return await MockProductAPI.getProductStats();
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  },

  // Get top selling products
  getTopSellingProducts: async (limit = 5) => {
    try {
      await delay(300);
      const response = await MockProductAPI.getAllProducts();
      const topProducts = response.data.products.slice(0, limit);
      return {
        success: true,
        data: { products: topProducts }
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    try {
      await delay(250);
      return await MockProductAPI.getFeaturedProducts(limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      await delay(300);
      return await MockProductAPI.getProductsByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    try {
      await delay(500);
      // Mock create - just return success
      return {
        success: true,
        message: 'Product created successfully',
        data: { product: { _id: Date.now().toString(), ...productData } }
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    try {
      await delay(400);
      // Mock update - just return success
      return {
        success: true,
        message: 'Product updated successfully',
        data: { product: { _id: id, ...productData } }
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      await delay(300);
      // Mock delete - just return success
      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Authentication API Service
export const AuthAPI = {
  login: async (credentials) => {
    try {
      await delay(800);
      return await MockAuthAPI.login(credentials.email, credentials.password);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      await delay(1000);
      return await MockAuthAPI.signup(userData);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      await delay(200);
      return await MockAuthAPI.getCurrentUser();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await delay(100);
      return await MockAuthAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
};

// Cart API Service
export const CartAPI = {
  getCart: async () => {
    try {
      await delay(200);
      return await MockCartAPI.getCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      await delay(300);
      return await MockCartAPI.addToCart(productId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      await delay(250);
      return await MockCartAPI.removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      await delay(200);
      return await MockCartAPI.updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await delay(200);
      return await MockCartAPI.clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// Wishlist API Service
export const WishlistAPI = {
  getWishlist: async () => {
    try {
      await delay(200);
      return await MockWishlistAPI.getWishlist();
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      await delay(300);
      return await MockWishlistAPI.addToWishlist(productId);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      await delay(250);
      return await MockWishlistAPI.removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }
};

// Order API Service
export const OrderAPI = {
  getUserOrders: async () => {
    try {
      await delay(400);
      return await MockOrderAPI.getUserOrders();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      await delay(300);
      return await MockOrderAPI.getOrderById(orderId);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  placeOrder: async (orderData) => {
    try {
      await delay(1000);
      return await MockOrderAPI.placeOrder(orderData);
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  // Admin order management
  getAllOrders: async () => {
    try {
      await delay(500);
      return await MockOrderAPI.getAllOrders();
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await delay(400);
      return await MockOrderAPI.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Contact API Service
export const ContactAPI = {
  submitForm: async (formData) => {
    try {
      await delay(800);
      return await MockContactAPI.submitForm(formData);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

// Newsletter API Service
export const NewsletterAPI = {
  subscribe: async (email) => {
    try {
      await delay(500);
      return await MockNewsletterAPI.subscribe(email);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
};

// Address API Service (Mock)
export const AddressAPI = {
  getUserAddresses: async () => {
    try {
      await delay(300);
      const addresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
      return {
        success: true,
        data: { addresses }
      };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  addAddress: async (addressData) => {
    try {
      await delay(400);
      const addresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
      const newAddress = {
        _id: Date.now().toString(),
        ...addressData,
        createdAt: new Date().toISOString()
      };
      addresses.push(newAddress);
      localStorage.setItem('user_addresses', JSON.stringify(addresses));
      
      return {
        success: true,
        message: 'Address added successfully',
        data: { address: newAddress }
      };
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      await delay(400);
      const addresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
      const index = addresses.findIndex(addr => addr._id === addressId);
      
      if (index !== -1) {
        addresses[index] = { ...addresses[index], ...addressData };
        localStorage.setItem('user_addresses', JSON.stringify(addresses));
        
        return {
          success: true,
          message: 'Address updated successfully',
          data: { address: addresses[index] }
        };
      }
      
      throw new Error('Address not found');
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      await delay(300);
      const addresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
      const filteredAddresses = addresses.filter(addr => addr._id !== addressId);
      localStorage.setItem('user_addresses', JSON.stringify(filteredAddresses));
      
      return {
        success: true,
        message: 'Address deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
};

// Admin API Service (Mock)
export const AdminAPI = {
  login: async (credentials) => {
    try {
      await delay(800);
      // Mock admin login - use simple credentials
      if (credentials.email === 'admin@grocerrypoint.com' && credentials.password === 'admin123') {
        const adminUser = {
          _id: 'admin123',
          email: 'admin@grocerrypoint.com',
          name: 'Admin User',
          role: 'admin'
        };
        
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        localStorage.setItem('admin_token', 'mock_admin_token_' + Date.now());
        
        return {
          success: true,
          message: 'Admin login successful',
          data: {
            user: adminUser,
            token: localStorage.getItem('admin_token')
          }
        };
      }
      
      throw new Error('Invalid admin credentials');
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  },

  getCurrentAdmin: async () => {
    try {
      await delay(200);
      const adminUser = JSON.parse(localStorage.getItem('admin_user') || 'null');
      const token = localStorage.getItem('admin_token');
      
      if (adminUser && token) {
        return {
          success: true,
          data: { user: adminUser }
        };
      }
      
      throw new Error('No admin session found');
    } catch (error) {
      console.error('Error fetching current admin:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await delay(100);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      
      return {
        success: true,
        message: 'Admin logout successful'
      };
    } catch (error) {
      console.error('Error during admin logout:', error);
      throw error;
    }
  },

  // Dashboard stats
  getDashboardStats: async () => {
    try {
      await delay(500);
      const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      return {
        success: true,
        data: {
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue: totalRevenue,
          pendingOrders: orders.filter(o => o.status === 'pending').length
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

// Default export for backward compatibility
export default {
  ProductAPI,
  AuthAPI,
  CartAPI,
  WishlistAPI,
  OrderAPI,
  ContactAPI,
  NewsletterAPI,
  AddressAPI,
  AdminAPI
};