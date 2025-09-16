import { useAuth } from '../contexts/AuthContext';
import { 
  ProductAPI, 
  AuthAPI, 
  CartAPI, 
  WishlistAPI, 
  OrderAPI, 
  ContactAPI, 
  NewsletterAPI,
  AddressAPI,
  AdminAPI
} from '../services/api';

// Mock API Hook - Frontend Only Version
export const useApi = () => {
  const { user } = useAuth();

  // Simulate network delay for realistic experience
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const apiCall = async (endpoint, options = {}) => {
    try {
      await delay(200); // Add small delay for realism
      
      const { method = 'GET', body } = options;
      const data = body ? JSON.parse(body) : null;

      // Route mock API calls based on endpoint
      switch (true) {
        // Orders endpoints
        case endpoint === '/orders/my':
          return await OrderAPI.getUserOrders();
        
        case endpoint.startsWith('/orders/') && method === 'GET':
          const orderId = endpoint.split('/')[2];
          return await OrderAPI.getOrderById(orderId);
        
        case endpoint === '/orders' && method === 'POST':
          return await OrderAPI.placeOrder(data);
        
        // Wishlist endpoints
        case endpoint === '/wishlist':
          if (method === 'GET') {
            return await WishlistAPI.getWishlist();
          } else if (method === 'POST') {
            return await WishlistAPI.addToWishlist(data.productId);
          }
          break;
        
        case endpoint.startsWith('/wishlist/') && method === 'DELETE':
          const productId = endpoint.split('/')[2];
          return await WishlistAPI.removeFromWishlist(productId);
        
        // Cart endpoints
        case endpoint === '/cart':
          if (method === 'GET') {
            return await CartAPI.getCart();
          } else if (method === 'POST') {
            return await CartAPI.addToCart(data.productId, data.quantity);
          }
          break;
        
        case endpoint.startsWith('/cart/') && method === 'DELETE':
          const cartProductId = endpoint.split('/')[2];
          return await CartAPI.removeFromCart(cartProductId);
        
        case endpoint.startsWith('/cart/') && method === 'PUT':
          const updateProductId = endpoint.split('/')[2];
          return await CartAPI.updateQuantity(updateProductId, data.quantity);
        
        // Address endpoints
        case endpoint === '/addresses':
          if (method === 'GET') {
            return await AddressAPI.getUserAddresses();
          } else if (method === 'POST') {
            return await AddressAPI.addAddress(data);
          }
          break;
        
        case endpoint.startsWith('/addresses/') && method === 'PUT':
          const addressId = endpoint.split('/')[2];
          return await AddressAPI.updateAddress(addressId, data);
        
        case endpoint.startsWith('/addresses/') && method === 'DELETE':
          const deleteAddressId = endpoint.split('/')[2];
          return await AddressAPI.deleteAddress(deleteAddressId);
        
        // Contact endpoints
        case endpoint === '/contact' && method === 'POST':
          return await ContactAPI.submitForm(data);
        
        // Newsletter endpoints
        case endpoint === '/newsletter/subscribe' && method === 'POST':
          return await NewsletterAPI.subscribe(data.email);
        
        // Auth endpoints
        case endpoint === '/auth/me':
          return await AuthAPI.getCurrentUser();
        
        case endpoint === '/auth/login' && method === 'POST':
          return await AuthAPI.login(data);
        
        case endpoint === '/auth/signup' && method === 'POST':
          return await AuthAPI.signup(data);
        
        case endpoint === '/auth/logout' && method === 'POST':
          return await AuthAPI.logout();
        
        // Admin endpoints
        case endpoint === '/admin/stats':
          return await AdminAPI.getDashboardStats();
        
        default:
          console.warn(`Unhandled API endpoint: ${method} ${endpoint}`);
          return {
            success: false,
            message: `Endpoint ${endpoint} not implemented in mock API`
          };
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const get = (endpoint) => apiCall(endpoint, { method: 'GET' });
  const post = (endpoint, data) => apiCall(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
  const put = (endpoint, data) => apiCall(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });
  const del = (endpoint) => apiCall(endpoint, { method: 'DELETE' });

  return { get, post, put, delete: del };
}; 