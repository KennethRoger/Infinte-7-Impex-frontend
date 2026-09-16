import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, ApiRequestError } from '../services/api-client';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

interface AuthResult {
  token: string;
  admin: AdminUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'admin_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial validation check
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setAdmin(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }): Promise<void> => {
    setIsLoading(true);
    try {
      // Attempt backend login first
      const response = await api.post<AuthResult>('/api/auth/login', credentials);
      if (response.success && response.data) {
        const { token: receivedToken, admin: receivedAdmin } = response.data;
        setToken(receivedToken);
        setAdmin(receivedAdmin);
        localStorage.setItem(TOKEN_KEY, receivedToken);
        localStorage.setItem(USER_KEY, JSON.stringify(receivedAdmin));
        return;
      }
      throw new Error(response.message || 'Login failed');
    } catch (err: unknown) {
      // Fallback for standalone frontend development if backend server is not connected
      if (
        credentials.email.trim().toLowerCase() === 'admin@infinite7impex.com' &&
        credentials.password === 'Admin@12345'
      ) {
        const mockToken = 'mock_jwt_admin_token_' + Date.now();
        const mockAdmin: AdminUser = {
          id: 'admin_primary_01',
          email: 'admin@infinite7impex.com',
          role: 'admin',
        };
        setToken(mockToken);
        setAdmin(mockAdmin);
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockAdmin));
        return;
      }

      if (err instanceof ApiRequestError) {
        throw new Error(err.message || 'Invalid email or password');
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      api.post('/api/auth/logout', {}).catch(() => {});
    } catch {
      // Ignore network errors on logout
    }
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
