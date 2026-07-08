'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAuthToken, isAuthenticated, getDashboardPath } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('choice'); // choice | login | register

  useEffect(() => {
    if (isAuthenticated()) {
      api.auth.me()
        .then(setUser)
        .catch(() => {
          setAuthToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((mode = 'choice') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalMode('choice');
  }, []);

  const login = async (email, password) => {
    const { token, user: userData } = await api.auth.login(email, password);
    setAuthToken(token);
    setUser(userData);
    setAuthModalOpen(false);
    return userData;
  };

  const register = async (data) => {
    const { token, user: userData } = await api.auth.register(data);
    setAuthToken(token);
    setUser(userData);
    setAuthModalOpen(false);
    return userData;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuth: !!user,
      isAdmin: user?.role === 'admin',
      isManager: user?.role === 'manager',
      isConsultant: user?.role === 'consultant',
      isStudent: user?.role === 'student',
      dashboardPath: user ? getDashboardPath(user.role) : '/login',
      authModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
