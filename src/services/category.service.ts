import { api, ApiRequestError } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import { ENV } from '../config/env';
import type {
  ProductCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilters,
} from '../types/category';
import type { PaginatedResult, PaginationParams, ApiResponse } from '../types/api';

export const CategoryApiService = {
  /**
   * Fetch all categories with pagination, search, and sorting (Admin table)
   */
  async getAll(
    filters: CategoryFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<PaginatedResult<ProductCategory>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      paginated: 'true',
    };

    if (filters.name) queryParams['name'] = filters.name;

    const response = await api.get<PaginatedResult<ProductCategory>>(
      API_ENDPOINTS.CATEGORIES.BASE,
      { params: queryParams }
    );

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch categories');
  },

  /**
   * Fetch all active categories as a list (Public Products page)
   */
  async getAllPublic(): Promise<ProductCategory[]> {
    const response = await api.get<ProductCategory[]>(API_ENDPOINTS.CATEGORIES.BASE);

    if (response.success && response.data) {
      // Backend returns array when paginated !== 'true'
      return Array.isArray(response.data) ? response.data : (response.data as unknown as PaginatedResult<ProductCategory>).data || [];
    }
    throw new Error(response.message || 'Failed to load product categories');
  },

  /**
   * Fetch a single category by ID
   */
  async getById(id: string): Promise<ProductCategory> {
    const response = await api.get<ProductCategory>(API_ENDPOINTS.CATEGORIES.BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch category details');
  },

  /**
   * Create a new category (Admin)
   */
  async create(dto: CreateCategoryDto): Promise<ProductCategory> {
    const response = await api.post<ProductCategory>(API_ENDPOINTS.CATEGORIES.BASE, dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create category');
  },

  /**
   * Update category by ID (Admin)
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<ProductCategory> {
    const response = await api.put<ProductCategory>(API_ENDPOINTS.CATEGORIES.BY_ID(id), dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update category');
  },

  /**
   * Delete category by ID (Admin)
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete<{ _id: string; isRemoved: boolean }>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id)
    );

    if (response.success) {
      return true;
    }
    throw new Error(response.message || 'Failed to delete category');
  },

  /**
   * Upload an image to Cloudinary via backend /api/upload
   */
  async uploadImage(file: File, folder: string = 'infinite7_impex/categories'): Promise<{ url: string; publicId: string }> {
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
    } catch (networkErr: unknown) {
      if (import.meta.env.DEV) {
        console.error('[Upload Network Error]', networkErr);
      }
      throw new ApiRequestError(
        'Unable to connect to the server. Please try again later.',
        0,
        'NETWORK_ERROR'
      );
    }

    let data: ApiResponse<{ url: string; publicId: string }>;
    try {
      data = await response.json();
    } catch {
      throw new ApiRequestError(
        'Server error. Please try again later.',
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
