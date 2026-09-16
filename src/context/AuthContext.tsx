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

  // Listen for unauthorized 401 events dispatched from api-client
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  useEffect(() => {
    // Initial validation check with backend
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setToken(null);
      setAdmin(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    api
      .get<{ admin: AdminUser }>('/api/auth/me')
      .then((response) => {
        if (isMounted) {
          if (response.success && response.data?.admin) {
            setToken(savedToken);
            setAdmin(response.data.admin);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.admin));
          } else {
            logout();
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          // Token is rejected or invalid - clear it
          logout();
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = useCallback(async (credentials: { email: string; password: string }): Promise<void> => {
    setIsLoading(true);
    try {
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
      if (err instanceof ApiRequestError) {
        throw new Error(err.message || 'Invalid email or password');
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unable to reach authentication server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
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
