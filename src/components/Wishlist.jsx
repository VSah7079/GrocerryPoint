import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';

const Wishlist = () => {
  const { user } = useAuth();
  const { get, delete: deleteApi } = useApi();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await get('/wishlist');
        setWishlistItems(response.items || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        // Keep empty array on error
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user, get]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await deleteApi(`/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart', {
        productId: product._id,
        quantity: 1
      });
      // You might want to show a success message here
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">My Wishlist</h2>
        <Link
          to="/products"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🛒</span>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {item.product.name}
              </h3>
              
              <p className="text-slate-600 mb-4 line-clamp-2">
                {item.product.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₹{item.product.price?.toFixed(2) || '0.00'}
                </span>
                <span className="text-sm text-slate-500">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAddToCart(item.product)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item.product._id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h3>
          <p className="text-slate-600 mb-6">Start adding products to your wishlist to see them here.</p>
          <Link
            to="/products"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 