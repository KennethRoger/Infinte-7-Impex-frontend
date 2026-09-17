import { ENV } from '../config/env';
import type { ApiResponse } from '../types/api';

export class ApiRequestError extends Error {
  statusCode: number;
  codeMsg?: string;
  details: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    codeMsg?: string,
    details: Array<{ field: string; message: string }> = []
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.codeMsg = codeMsg;
    this.details = details;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  skipCache?: boolean;
  ttl?: number; // Cache time-to-live in ms (default: 3 minutes)
}

interface CacheEntry<T> {
  data: ApiResponse<T>;
  expiresAt: number;
}

// In-memory cache store and in-flight request deduplication
const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<ApiResponse<any>>>();

/**
 * Flush cached API responses.
 * Pass a prefix (e.g. '/api/products') to flush specific endpoints, or omit to flush everything.
 */
export function clearApiCache(prefix?: string): void {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(prefix)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Generic type-safe API client with in-memory caching & request deduplication
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, token, headers, skipCache = false, ttl = 180000, ...customConfig } = options;
  const method = (customConfig.method || 'GET').toUpperCase();

  let url = endpoint.startsWith('http') ? endpoint : `${ENV.API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

  // 1. Check in-memory cache for GET requests
  const isCacheable = method === 'GET' && !skipCache;
  const cacheKey = `${storedToken ? 'auth:' : 'pub:'}${url}`;

  if (isCacheable) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data as ApiResponse<T>;
    }

    // 2. Request deduplication: if identical request is already in-flight, return the same promise
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey)! as Promise<ApiResponse<T>>;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  // Execute request
  const fetchPromise = (async (): Promise<ApiResponse<T>> => {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...(headers as Record<string, string>),
        },
        ...customConfig,
      });
    } catch (networkErr: unknown) {
      if (import.meta.env.DEV) {
        console.error('[API Network Error]', networkErr);
      }
      throw new ApiRequestError(
        'Unable to connect to the server. Please check your internet connection or try again later.',
        0,
        'NETWORK_ERROR'
      );
    }

    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      throw new ApiRequestError(
        'Server error. Please try again later.',
        response.status
      );
    }

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_user');
      clearApiCache();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    if (!response.ok || !data.success) {
      throw new ApiRequestError(
        data.message || 'An unexpected error occurred',
        response.status,
        data.error?.codeMsg,
        data.error?.details || []
      );
    }

    // Cache successful GET responses
    if (isCacheable) {
      memoryCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + ttl,
      });
    } else if (method !== 'GET') {
      // Invalidate cache on mutations (POST, PUT, PATCH, DELETE)
      clearApiCache();
    }

    return data;
  })();

  if (isCacheable) {
    inFlightRequests.set(cacheKey, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  }

  return fetchPromise;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),

  clearCache: clearApiCache,
};
