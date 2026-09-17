import { api, ApiRequestError } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import { ENV } from '../config/env';
import type {
  Blog,
  BlogSummary,
  CreateBlogDto,
  UpdateBlogDto,
  BlogFilters,
} from '../types/blog';
import type { PaginatedResult, PaginationParams, ApiResponse } from '../types/api';

export const BlogApiService = {
  /**
   * Fetch all blogs with pagination, search, and sorting (Admin table & Public list)
   * Defaults to latest articles first (sortBy: 'createdAt', sortOrder: 'desc')
   */
  async getAll(
    filters: BlogFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<PaginatedResult<BlogSummary>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.sortBy || 'createdAt',
      sortOrder: sort.sortOrder || 'desc',
      paginated: 'true',
    };

    if (filters.title) queryParams['title'] = filters.title;

    const response = await api.get<PaginatedResult<BlogSummary>>(
      API_ENDPOINTS.BLOGS.BASE,
      { params: queryParams }
    );

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch articles');
  },

  /**
   * Fetch public blogs with pagination, sorted latest-first
   */
  async getAllPublic(
    pagination: PaginationParams = { page: 1, limit: 6 }
  ): Promise<PaginatedResult<BlogSummary>> {
    return this.getAll({}, pagination, { sortBy: 'createdAt', sortOrder: 'desc' });
  },

  /**
   * Fetch a single blog post by ID with all embedded sections
   */
  async getById(id: string): Promise<Blog> {
    const response = await api.get<Blog>(API_ENDPOINTS.BLOGS.BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch article details');
  },

  /**
   * Create a new blog post (Admin)
   */
  async create(dto: CreateBlogDto): Promise<Blog> {
    const response = await api.post<Blog>(API_ENDPOINTS.BLOGS.BASE, dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to publish article');
  },

  /**
   * Update blog post by ID (Admin)
   */
  async update(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const response = await api.put<Blog>(API_ENDPOINTS.BLOGS.BY_ID(id), dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update article');
  },

  /**
   * Delete blog post by ID (Admin)
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete<{ title?: string }>(API_ENDPOINTS.BLOGS.BY_ID(id));

    if (response.success) {
      return true;
    }
    throw new Error(response.message || 'Failed to delete article');
  },

  /**
   * Upload blog cover image to Cloudinary via backend /api/upload
   */
  async uploadImage(
    file: File,
    folder: string = 'infinite7_impex/blogs'
  ): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${ENV.API_BASE_URL}${API_ENDPOINTS.UPLOAD}?folder=${encodeURIComponent(folder)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch {
      throw new ApiRequestError(
        `Cannot connect to backend server (${url}). Please ensure your backend is running.`,
        0,
        'NETWORK_ERROR'
      );
    }

    let data: ApiResponse<{ url: string; publicId: string }>;
    try {
      data = await response.json();
    } catch {
      throw new ApiRequestError(
        `Failed to parse server response: ${response.statusText}`,
        response.status
      );
    }

    if (!response.ok || !data.success) {
      throw new ApiRequestError(
        data.message || 'Failed to upload image',
        response.status,
        data.error?.codeMsg,
        data.error?.details || []
      );
    }

    if (data.data?.url) {
      return data.data;
    }
    throw new Error('Image upload succeeded but no URL was returned');
  },
};
