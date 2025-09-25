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
} from '../services/realApi';

// Real API Hook - Uses backend
export const useApi = () => {
  return {
    get: async (endpoint) => {
      switch (true) {
        case endpoint === '/products':
          return await ProductAPI.getAllProducts();
        case endpoint.startsWith('/products/'):
          return await ProductAPI.getProductById(endpoint.split('/')[2]);
        case endpoint === '/cart':
          return await CartAPI.getCart();
        case endpoint === '/wishlist':
          return await WishlistAPI.getWishlist();
        case endpoint === '/orders/my':
          return await OrderAPI.getUserOrders();
        case endpoint.startsWith('/orders/'):
          return await OrderAPI.getOrderById(endpoint.split('/')[2]);
        case endpoint === '/addresses':
          return await AddressAPI.getUserAddresses();
        case endpoint === '/auth/me':
          return await AuthAPI.getCurrentUser();
        case endpoint === '/admin/stats':
          return await AdminAPI.getDashboardStats();
        default:
          throw new Error(`GET ${endpoint} not implemented`);
      }
    },
    post: async (endpoint, data) => {
      switch (true) {
        case endpoint === '/auth/login':
          return await AuthAPI.login(data);
        case endpoint === '/auth/signup':
          return await AuthAPI.signup(data);
        case endpoint === '/cart':
          return await CartAPI.addToCart(data.productId, data.quantity);
        case endpoint === '/wishlist':
          return await WishlistAPI.addToWishlist(data.productId);
        case endpoint === '/orders':
          return await OrderAPI.placeOrder(data);
        case endpoint === '/addresses':
          return await AddressAPI.addAddress(data);
        case endpoint === '/contact':
          return await ContactAPI.submitForm(data);
        case endpoint === '/newsletter':
          return await NewsletterAPI.subscribe(data.email);
        case endpoint === '/auth/logout':
          return await AuthAPI.logout();
        default:
          throw new Error(`POST ${endpoint} not implemented`);
      }
    },
    put: async (endpoint, data) => {
      switch (true) {
        case endpoint.startsWith('/products/'):
          return await ProductAPI.updateProduct(endpoint.split('/')[2], data);
        case endpoint.startsWith('/cart/'):
          return await CartAPI.updateQuantity(endpoint.split('/')[2], data.quantity);
        case endpoint.startsWith('/addresses/'):
          return await AddressAPI.updateAddress(endpoint.split('/')[2], data);
        case endpoint.startsWith('/orders/'):
          return await OrderAPI.updateOrderStatus(endpoint.split('/')[2], data.status);
        default:
          throw new Error(`PUT ${endpoint} not implemented`);
      }
    },
    delete: async (endpoint) => {
      switch (true) {
        case endpoint.startsWith('/products/'):
          return await ProductAPI.deleteProduct(endpoint.split('/')[2]);
        case endpoint.startsWith('/cart/'):
          return await CartAPI.removeFromCart(endpoint.split('/')[2]);
        case endpoint === '/cart':
          return await CartAPI.clearCart();
        case endpoint.startsWith('/wishlist/'):
          return await WishlistAPI.removeFromWishlist(endpoint.split('/')[2]);
        case endpoint.startsWith('/addresses/'):
          return await AddressAPI.deleteAddress(endpoint.split('/')[2]);
        default:
          throw new Error(`DELETE ${endpoint} not implemented`);
      }
    },
  };
};