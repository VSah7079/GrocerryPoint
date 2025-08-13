import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || '/';
  const action = location.state?.action || '';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const { success, user, token } = res.data;
      
      if (success && user && token) {
        login(user, token);
        setIsLoading(false);

        if (action === 'buy') navigate('/checkout');
        else if (action === 'cart') navigate(from);
        else navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4 relative">
      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce" />
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse" />
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 animate-pulse">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800">Welcome Back!</h1>
          <p className="text-green-500">Sign in to your GrocerryPoint account</p>
          {action && (
            <div className="mt-4 bg-green-100 text-green-800 text-sm font-medium p-2 rounded">
              {action === 'buy' ? 'Please login to complete your purchase' : 'Please login to add items to cart'}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 text-lg"
              >
                {showPassword ? '🙈' : '🙉'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-green-600 hover:underline">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-transform duration-300 transform hover:scale-105 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin border-2 border-white border-b-transparent h-5 w-5 rounded-full mr-2"></span>
                Signing in...
              </div>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-600 hover:underline font-medium">Sign up here</Link>
        </p>
      </div>

      {/* Features */}
      <div className="absolute bottom-4 text-white text-sm text-center">
        🚚 Fast Delivery • 🌱 Fresh Products • 💰 Best Prices • 🛡️ Secure Shopping
      </div>
    </div>
  );
};

export default LoginPage;
