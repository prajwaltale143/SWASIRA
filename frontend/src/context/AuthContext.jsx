import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('swasira_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[AuthContext] Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token) {
      localStorage.setItem('swasira_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.signup({ name, email, password });
    if (data.token) {
      localStorage.setItem('swasira_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('swasira_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  const refreshUser = async () => {
    try {
      const response = await api.getMe();
      if (response && response.user) {
        setUser(response.user);
        return response.user;
      }
    } catch (err) {
      console.warn('[AuthContext] refreshUser failed:', err.message);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      updateUser,
      refreshUser,
      isAuthenticated: Boolean(token && user),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
