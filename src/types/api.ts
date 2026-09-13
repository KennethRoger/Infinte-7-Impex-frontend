/**
 * Standard API error detail definition matching backend envelope
 */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

/**
 * Standard API error object
 */
export interface ApiError {
  codeMsg: string;
  details: ApiErrorDetail[];
}

/**
 * Standard API response envelope matching backend server
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiError | null;
}

/**
 * Paginated query result structure
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Common pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
