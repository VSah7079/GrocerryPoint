import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthAPI } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await AuthAPI.forgotPassword({ email });
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        setError(response.error || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const steps = [
    { icon: '📧', title: 'Enter Email', desc: 'Provide your registered email address' },
    { icon: '🔐', title: 'Reset Link', desc: 'We\'ll send you a secure reset link' },
    { icon: '✅', title: 'New Password', desc: 'Create your new password' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 animate-pulse">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-green-100">Don't worry! We'll help you reset it</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-gray-400">📧</span>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending reset link...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Process Steps */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">How it works:</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{step.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-800">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email!</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and click the link to reset your password.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 text-xl">💡</span>
                  <div className="text-left">
                    <h4 className="font-medium text-blue-800 mb-1">Didn't receive the email?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Check your spam folder</li>
                      <li>• Make sure you entered the correct email</li>
                      <li>• Wait a few minutes before requesting again</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 mb-4"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <Link 
                to="/login" 
                className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors duration-300"
              >
                ← Back to Login
              </Link>
              <Link 
                to="/signup" 
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-white">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">
              🔒 <strong>Security Notice:</strong> Reset links expire in 1 hour for your security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 