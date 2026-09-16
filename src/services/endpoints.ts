/**
 * Centralized API endpoints matching backend routes
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  CUSTOMERS: {
    BASE: '/api/customers',
    BY_ID: (id: string) => `/api/customers/${id}`,
    PRIORITY: (id: string) => `/api/customers/${id}/priority`,
    NOTES: (id: string) => `/api/customers/${id}/notes`,
  },
  CATEGORIES: {
    BASE: '/api/categories',
    BY_ID: (id: string) => `/api/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  BLOGS: {
    BASE: '/api/blogs',
    BY_ID: (id: string) => `/api/blogs/${id}`,
  },
} as const;
