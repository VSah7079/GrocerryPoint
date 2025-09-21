import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } else {
      setError('Invalid authentication response');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-green-500 text-6xl mb-4 animate-bounce">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h1>
            <p className="text-gray-600 mb-6">You have been successfully logged in.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to home...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage; 