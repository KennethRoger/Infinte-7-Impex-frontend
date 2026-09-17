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

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

/**
 * Generic type-safe API client
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, token, headers, ...customConfig } = options;

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

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

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

  return data;
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
};
