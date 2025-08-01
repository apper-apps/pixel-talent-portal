import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/api/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userService.login(email, password);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await userService.signup(userData);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if service call fails
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;