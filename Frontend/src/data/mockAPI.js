// Mock API Services - Complete backend replacement for frontend-only mode

// Mock Authentication API
export class MockAuthAPI {
  static async login(email, password) {
    // Mock user database
    const mockUsers = [
      { 
        _id: 'user001', 
        name: 'John Doe', 
        email: 'john@example.com', 
        password: 'password123',
        phone: '+91 9876543210',
        role: 'user'
      },
      { 
        _id: 'user002', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        password: 'password123',
        phone: '+91 9876543211',
        role: 'user'
      },
      {
        _id: 'admin001',
        name: 'Admin User',
        email: 'admin@grocerrypoint.com',
        password: 'admin123',
        phone: '+91 9876543212',
        role: 'admin'
      }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Store user session
    const userSession = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
    
    localStorage.setItem('user', JSON.stringify(userSession));
    localStorage.setItem('token', 'mock_token_' + Date.now());
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: userSession,
        token: localStorage.getItem('token')
      }
    };
  }
  
  static async signup(userData) {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userExists = existingUsers.some(u => u.email === userData.email);
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      _id: 'user_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // In real app, this would be hashed
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Store in mock database
    existingUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    
    // Auto login after signup
    const userSession = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };
    
    localStorage.setItem('user', JSON.stringify(userSession));
    localStorage.setItem('token', 'mock_token_' + Date.now());
    
    return {
      success: true,
      message: 'Account created successfully',
      data: {
        user: userSession,
        token: localStorage.getItem('token')
      }
    };
  }
  
  static async getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      throw new Error('No active session found');
    }
    
    return {
      success: true,
      data: { user }
    };
  }
  
  static async logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
}

// Mock Cart API
export class MockCartAPI {
  static async getCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return {
      success: true,
      data: { cart }
    };
  }
  
  static async addToCart(productId, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return {
      success: true,
      message: 'Product added to cart',
      data: { cart }
    };
  }
  
  static async removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return {
      success: true,
      message: 'Product removed from cart',
      data: { cart }
    };
  }
  
  static async updateQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return {
      success: true,
      message: 'Cart updated',
      data: { cart }
    };
  }
  
  static async clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    
    return {
      success: true,
      message: 'Cart cleared',
      data: { cart: [] }
    };
  }
}

// Mock Wishlist API
export class MockWishlistAPI {
  static async getWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return {
      success: true,
      data: { wishlist }
    };
  }
  
  static async addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    return {
      success: true,
      message: 'Product added to wishlist',
      data: { wishlist }
    };
  }
  
  static async removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    return {
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlist }
    };
  }
}

// Mock Order API
export class MockOrderAPI {
  static async getUserOrders() {
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    return {
      success: true,
      data: { orders }
    };
  }
  
  static async getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    const order = orders.find(o => o._id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return {
      success: true,
      data: { order }
    };
  }
  
  static async placeOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    
    const newOrder = {
      _id: 'order_' + Date.now(),
      ...orderData,
      status: 'pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    orders.push(newOrder);
    localStorage.setItem('user_orders', JSON.stringify(orders));
    
    // Clear cart after successful order
    localStorage.setItem('cart', JSON.stringify([]));
    
    return {
      success: true,
      message: 'Order placed successfully',
      data: { order: newOrder }
    };
  }
  
  // Admin functions
  static async getAllOrders() {
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    return {
      success: true,
      data: { orders }
    };
  }
  
  static async updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    const order = orders.find(o => o._id === orderId);
    
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem('user_orders', JSON.stringify(orders));
    }
    
    return {
      success: true,
      message: 'Order status updated',
      data: { order }
    };
  }
}

// Mock Contact API
export class MockContactAPI {
  static async submitForm(formData) {
    // Store contact messages
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    
    const newMessage = {
      _id: 'msg_' + Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };
    
    messages.push(newMessage);
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    
    return {
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      data: { messageId: newMessage._id }
    };
  }
}

// Mock Newsletter API
export class MockNewsletterAPI {
  static async subscribe(email) {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    
    if (subscribers.includes(email)) {
      throw new Error('Email already subscribed to newsletter');
    }
    
    subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!'
    };
  }
}

// Mock Review API
export class MockReviewAPI {
  static async getProductReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem('product_reviews') || '{}');
    const productReviews = reviews[productId] || [];
    
    return {
      success: true,
      data: { reviews: productReviews }
    };
  }
  
  static async addReview(productId, reviewData) {
    const reviews = JSON.parse(localStorage.getItem('product_reviews') || '{}');
    
    if (!reviews[productId]) {
      reviews[productId] = [];
    }
    
    const newReview = {
      _id: 'review_' + Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    
    reviews[productId].push(newReview);
    localStorage.setItem('product_reviews', JSON.stringify(reviews));
    
    return {
      success: true,
      message: 'Review added successfully',
      data: { review: newReview }
    };
  }
}

// Export all mock APIs
export default {
  MockAuthAPI,
  MockCartAPI,
  MockWishlistAPI,
  MockOrderAPI,
  MockContactAPI,
  MockNewsletterAPI,
  MockReviewAPI
};