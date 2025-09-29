import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../services/api';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await AuthAPI.verifyEmail(token);
      
      if (response.success) {
        setVerificationStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        setUserInfo(response.user);
        
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified! You can now login.',
              email: response.user?.email 
            } 
          });
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(response.error || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (!userInfo?.email) {
      alert('Email not found. Please try signing up again.');
      return;
    }

    try {
      await AuthAPI.resendVerification({ email: userInfo.email });
      alert('📧 New verification email sent! Please check your inbox.');
    } catch (error) {
      alert('❌ Failed to send verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          
          {/* Status Icon */}
          <div className="mb-6">
            {verificationStatus === 'verifying' && (
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
            )}
            
            {verificationStatus === 'error' && (
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">❌</span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {verificationStatus === 'verifying' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified Successfully! 🎉</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              {userInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>Welcome {userInfo.name}!</strong><br/>
                    Your account ({userInfo.email}) is now active.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500">Redirecting to login page in 3 seconds...</p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  📧 Resend Verification Email
                </button>
                
                <Link
                  to="/signup"
                  className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
                >
                  🔄 Sign Up Again
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-800 font-medium transition-colors duration-300"
              >
                ← Back to Login
              </Link>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
              >
                Go to Home →
              </Link>
            </div>
          </div>

          {/* Brand Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <span className="text-2xl">🛒</span>
              <span className="font-semibold">GrocerryPoint</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Fresh groceries delivered with care</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;