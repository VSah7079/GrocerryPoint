import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { _id: id, name, category, price, discount, image, rating } = product;
  const newPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleBuyNow = () => {
    console.log('Buy Now clicked, user:', user, 'loading:', loading);
    if (loading) {
      console.log('Still loading, please wait');
      return;
    }
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      // Redirect to login page if user is not authenticated
      navigate('/login', { state: { from: `/product/${id}`, action: 'buy' } });
      return;
    }
    
    console.log('User authenticated, proceeding to checkout');
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    console.log('Add to Cart clicked, user:', user, 'loading:', loading);
    if (loading) {
      console.log('Still loading, please wait');
      return;
    }
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      // Redirect to login page if user is not authenticated
      navigate('/login', { state: { from: `/product/${id}`, action: 'cart' } });
      return;
    }
    
    console.log('User authenticated, adding to cart');
    addToCart(product);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
      <Link to={`/product/${id}`} className="relative block">
        <div className="relative w-full h-48 bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 w-full h-full"></div>
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-4xl">🛒</div>
            </div>
          ) : (
            <img 
              src={image} 
              alt={name} 
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {discount}% OFF
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            {rating} ★
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 flex-grow">
          <Link to={`/product/${id}`} className="hover:text-green-600 transition-colors duration-200">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-3 font-medium">{category}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-green-600">₹{newPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="mt-auto pt-4 space-y-2">
            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-green-100 text-green-700 py-3 rounded-lg hover:bg-green-200 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (user ? 'Add to Cart' : ' Add to Cart')}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (user ? 'Buy Now' : 'Buy Now')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 