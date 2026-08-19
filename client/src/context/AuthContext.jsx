import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { initSocketClient, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('task_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('task_token') || '');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('task_user', JSON.stringify(res.data));
          initSocketClient(token);
        } catch (err) {
          console.error('[Auth Check Failed]:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const extractErrorMessage = (err, defaultMsg) => {
    if (err.response?.data) {
      if (typeof err.response.data.message === 'string') return err.response.data.message;
      if (typeof err.response.data.error === 'string') return err.response.data.error;
      if (Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        return err.response.data.errors[0].message;
      }
      if (typeof err.response.data === 'string' && err.response.data.length < 300 && !err.response.data.includes('<!DOCTYPE')) {
        return err.response.data;
      }
    }
    if (err.response?.status === 404) {
      return 'Backend API route not found (404). Please ensure the backend server or Netlify function is running.';
    }
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      return 'Cannot connect to backend server. Please verify the server is running.';
    }
    return err.message || defaultMsg;
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, ...userData } = res.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('task_token', newToken);
      localStorage.setItem('task_user', JSON.stringify(userData));

      initSocketClient(newToken);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Login failed. Please check credentials.');
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: newToken, ...userData } = res.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('task_token', newToken);
      localStorage.setItem('task_user', JSON.stringify(userData));

      initSocketClient(newToken);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Registration failed. Please try again.');
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('task_token');
    localStorage.removeItem('task_user');
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
