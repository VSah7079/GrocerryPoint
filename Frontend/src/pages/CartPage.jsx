import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaPlus, FaMinus, FaHeart, FaRegSmile, FaLock, FaUndo } from 'react-icons/fa';
import { useState } from 'react';

const FREE_DELIVERY_THRESHOLD = 499;

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
  const { user } = useAuth();

  // Admin users can also use cart (removed restriction)
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // 'success' | 'error' | null
  const [wishlist, setWishlist] = useState([]); // UI only

  const total = cartItems.reduce((acc, item) => {
    const price = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price;
    return acc + price * item.quantity;
  }, 0);

  const savings = cartItems.reduce((acc, item) => {
    return acc + (item.discount > 0 ? (item.price * item.discount / 100) * item.quantity : 0);
  }, 0);

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'SAVE10'.toLowerCase()) {
      setCouponStatus('success');
    } else {
      setCouponStatus('error');
    }
  };

  const handleMoveToWishlist = (id) => {
    setWishlist([...wishlist, id]);
    removeFromCart(id);
  };

  const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);
  const amountLeft = Math.max(0, FREE_DELIVERY_THRESHOLD - total);

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-green-200">
        <div className="text-7xl mb-6 text-green-500 animate-bounce"><FaShoppingCart /></div>
        <h1 className="text-4xl font-extrabold mb-2 text-green-800">Your Cart is Empty</h1>
        <p className="text-lg text-green-700 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-500 to-green-700 py-10 mb-10 shadow-lg rounded-b-3xl flex items-center justify-center">
        <FaShoppingCart className="text-white text-5xl mr-4 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Your Shopping Cart</h1>
      </div>
      <div className="container mx-auto px-4">
        {/* Progress Bar for Free Delivery */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-800">{amountLeft > 0 ? `You're ₹${amountLeft} away from Free Delivery!` : 'You have unlocked Free Delivery!'}</span>
            <span className="text-green-700 font-bold">₹{FREE_DELIVERY_THRESHOLD}+</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-8">
            {/* Personalized Message */}
            <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-400 rounded-xl px-4 py-3 mb-2 animate-fade-in">
              <FaRegSmile className="text-green-500 text-2xl" />
              <span className="font-semibold text-green-800">Great choice! People love these products.</span>
            </div>
            {cartItems.map((item, idx) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 group animate-slide-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                  <div className="relative group">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border-2 border-green-200 mr-6 transform group-hover:scale-110 transition-transform duration-300" />
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">{item.discount}% OFF</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-900 mb-1">{item.name}</h2>
                    {item.discount > 0 && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mr-2">You save ₹{((item.price * item.discount / 100) * item.quantity).toFixed(0)}</span>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold"><FaTrashAlt /> Remove</button>
                      <button onClick={() => handleMoveToWishlist(item.id)} className="text-pink-500 hover:text-pink-700 flex items-center gap-1 text-sm font-semibold"><FaHeart /> Move to Wishlist</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end">
                  <div className="flex items-center bg-green-50 rounded-lg px-2 py-1 shadow-inner">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 text-green-700 hover:text-green-900 disabled:opacity-50" disabled={item.quantity <= 1}><FaMinus /></button>
                    <input 
                      type="number" 
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                      className="w-14 p-2 border-2 border-green-200 rounded-md text-center mx-2 font-bold text-green-900 bg-white"
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-green-700 hover:text-green-900"><FaPlus /></button>
                  </div>
                  <p className="font-extrabold text-green-800 text-xl">
                    ₹{((item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl self-start sticky top-8 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-green-700 mb-6 flex items-center gap-2"><FaShoppingCart /> Order Summary</h2>
            <div className="flex justify-between mb-2 text-green-700 font-semibold">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-green-700 font-semibold">
              <span>Shipping</span>
              <span>{amountLeft > 0 ? `₹${Math.min(50, amountLeft / 10).toFixed(0)}` : 'Free'}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between mb-2 text-green-600 font-bold">
                <span>Savings</span>
                <span>-₹{savings.toFixed(0)}</span>
              </div>
            )}
            <hr className="my-4 border-green-200" />
            <div className="flex justify-between font-extrabold text-2xl text-green-900">
              <span>Total</span>
              <span>₹{(total + (amountLeft > 0 ? Math.min(50, amountLeft / 10) : 0)).toFixed(2)}</span>
            </div>
            {/* Coupon Section */}
            <div className="mt-6">
              <label className="block text-green-700 font-semibold mb-2">Have a promo code?</label>
              <div className="flex">
                <input type="text" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponStatus(null); }} placeholder="Enter code (try SAVE10)" className="p-2 border-2 border-green-200 rounded-l-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <button onClick={handleApplyCoupon} type="button" className="bg-green-600 text-white px-4 rounded-r-lg font-semibold hover:bg-green-700 transition-colors">Apply</button>
              </div>
              {couponStatus === 'success' && <div className="text-green-600 mt-2 font-semibold">Coupon applied! 🎉</div>}
              {couponStatus === 'error' && <div className="text-red-500 mt-2 font-semibold">Invalid coupon code.</div>}
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mt-8 justify-center animate-fade-in">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full shadow text-green-700 font-semibold text-xs"><FaLock /> 100% Secure Payments</div>
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full shadow text-yellow-700 font-semibold text-xs"><FaUndo /> Easy Returns</div>
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full shadow text-blue-700 font-semibold text-xs">🚚 Fast Delivery</div>
            </div>
            {/* Sticky Checkout Button (Mobile) */}
            <Link to="/checkout" className="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white py-4 mt-8 rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 fixed md:static left-0 right-0 bottom-0 z-40 md:mt-8">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-slide-in { animation: slideIn 0.7s both; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
        .group:hover .group-hover\\:scale-110 { transform: scale(1.10); }
      `}</style>
    </div>
  );
};

export default CartPage; 