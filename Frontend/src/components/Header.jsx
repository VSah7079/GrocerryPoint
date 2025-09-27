import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import contexts with correct path
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, Settings, Menu, X } from 'lucide-react';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg sticky top-0 z-50 border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">GrocerryPoint</span>
              <span className="text-xs text-gray-500 font-medium">Fresh & Fast</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-green-50 group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/products"
              className="relative text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-green-50 group"
            >
              <span className="relative z-10">Products</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-green-50 group"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Cart with badge */}
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-green-600 p-3 rounded-xl transition-all duration-300 hover:bg-green-50 group"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Admin Panel */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/products"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 p-3 rounded-xl transition-all duration-300 hover:bg-green-50 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">{user.name}</span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 backdrop-blur-sm">
                      <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{user.email}</div>
                      </div>

                      <Link
                        to="/account/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium"
                      >
                        Profile
                      </Link>
                      
                      <Link
                        to="/account/orders"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium"
                      >
                        Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors duration-200 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-green-600 p-3 rounded-xl transition-all duration-300 hover:bg-green-50"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-green-200 py-6 bg-gradient-to-b from-green-50 to-emerald-50">
            <div className="space-y-3">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setShowMobileMenu(false)}
                className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
              >
                Products
              </Link>
              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
                  >
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/products"
                      onClick={() => setShowMobileMenu(false)}
                      className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 text-base font-semibold rounded-lg mx-2 shadow-lg"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    
                    <Link
                      to="/account/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
                    >
                      Profile
                    </Link>
                    
                    <Link
                      to="/account/orders"
                      onClick={() => setShowMobileMenu(false)}
                      className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
                    >
                      Orders
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg mx-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 text-base font-semibold rounded-lg mx-2 shadow-lg"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;