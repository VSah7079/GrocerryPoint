import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status when user or token changes
  useEffect(() => {
    const checkAdminStatus = () => {
      if (user && user.role === 'admin' && token) {
        setIsAdmin(true);
        console.log('✅ Admin status confirmed:', user.email, user.role);
      } else {
        setIsAdmin(false);
        console.log('❌ Not admin or not logged in');
      }
    };
    
    checkAdminStatus();
  }, [user, token]);

  const login = (userData, tokenData) => {
    console.log('🔐 Logging in user:', userData.email, 'Role:', userData.role);
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    
    // If admin login, also store admin token
    if (userData.role === 'admin') {
      localStorage.setItem('adminToken', tokenData);
      console.log('👑 Admin token stored');
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
