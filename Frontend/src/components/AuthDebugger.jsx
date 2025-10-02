import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebugger = () => {
  const { user, token } = useAuth();
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    // Get all auth-related data from localStorage
    const data = {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      adminToken: localStorage.getItem('adminToken'),
    };
    setLocalStorageData(data);
  }, []);

  const parseUser = (userString) => {
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  };

  const isAdmin = () => {
    const localUser = parseUser(localStorageData.user);
    return (user?.role === 'admin') || (localUser?.role === 'admin');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs text-xs z-50">
      <h3 className="font-bold mb-2 text-blue-600">🐛 Auth Debug Info</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Context User:</strong>
          <pre className="text-xs bg-gray-100 p-1 mt-1 rounded">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <strong>Context Token:</strong>
          <div className="text-xs bg-gray-100 p-1 mt-1 rounded">
            {token ? `${token.substring(0, 20)}...` : 'null'}
          </div>
        </div>
        
        <div>
          <strong>LocalStorage Token:</strong>
          <div className="text-xs bg-gray-100 p-1 mt-1 rounded">
            {localStorageData.token ? `${localStorageData.token.substring(0, 20)}...` : 'null'}
          </div>
        </div>
        
        <div>
          <strong>LocalStorage User:</strong>
          <pre className="text-xs bg-gray-100 p-1 mt-1 rounded">
            {localStorageData.user ? JSON.stringify(parseUser(localStorageData.user), null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <strong>Admin Token:</strong>
          <div className="text-xs bg-gray-100 p-1 mt-1 rounded">
            {localStorageData.adminToken ? `${localStorageData.adminToken.substring(0, 20)}...` : 'null'}
          </div>
        </div>
        
        <div className={`font-bold ${isAdmin() ? 'text-green-600' : 'text-red-600'}`}>
          Status: {isAdmin() ? '✅ Admin' : '❌ Not Admin'}
        </div>
      </div>
      
      <button
        onClick={() => setLocalStorageData({
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user'),
          adminToken: localStorage.getItem('adminToken'),
        })}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
};

export default AuthDebugger;