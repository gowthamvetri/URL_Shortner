import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
        } catch (err) {
          console.error('Failed to load user', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const verifyEmail = async (code) => {
    setError(null);
    try {
      await authService.verifyEmail(code);
      setUser(prev => ({ ...prev, isVerified: true }));
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      return false;
    }
  };

  const resendVerification = async () => {
    setError(null);
    try {
      await authService.resendVerification();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification code');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, verifyEmail, resendVerification, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
