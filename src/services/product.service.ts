import { api, ApiRequestError } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import { ENV } from '../config/env';
import type {
  PopulatedProduct,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '../types/product';
import type { PaginatedResult, PaginationParams, ApiResponse } from '../types/api';

export const ProductApiService = {
  /**
   * Fetch all products with pagination, search, category filter, and sorting (Admin table)
   */
  async getAll(
    filters: ProductFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<PaginatedResult<PopulatedProduct>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      paginated: 'true',
    };

    if (filters.name) queryParams['name'] = filters.name;
    if (filters.category) queryParams['category'] = filters.category;

    const response = await api.get<PaginatedResult<PopulatedProduct>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params: queryParams }
    );

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch products');
  },

  /**
   * Fetch all active products (optionally filtered by category ID) for public showcase
   */
  async getAllPublic(filters: ProductFilters = {}): Promise<PopulatedProduct[]> {
    const queryParams: Record<string, string | undefined> = {};
    if (filters.category) queryParams['category'] = filters.category;
    if (filters.name) queryParams['name'] = filters.name;

    const response = await api.get<PopulatedProduct[]>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params: queryParams }
    );

    if (response.success && response.data) {
      return Array.isArray(response.data)
        ? response.data
        : (response.data as unknown as PaginatedResult<PopulatedProduct>).data || [];
    }
    throw new Error(response.message || 'Failed to load products');
  },

  /**
   * Fetch a single populated product by ID
   */
  async getById(id: string): Promise<PopulatedProduct> {
    const response = await api.get<PopulatedProduct>(API_ENDPOINTS.PRODUCTS.BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch product details');
  },

  /**
   * Create a new product (Admin)
   */
  async create(dto: CreateProductDto): Promise<PopulatedProduct> {
    const response = await api.post<PopulatedProduct>(API_ENDPOINTS.PRODUCTS.BASE, dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create product');
  },

  /**
   * Update product by ID (Admin)
   */
  async update(id: string, dto: UpdateProductDto): Promise<PopulatedProduct> {
    const response = await api.put<PopulatedProduct>(API_ENDPOINTS.PRODUCTS.BY_ID(id), dto);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update product');
  },

  /**
   * Delete product by ID (Admin)
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete<{ _id: string; isRemoved: boolean }>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id)
    );

    if (response.success) {
      return true;
    }
    throw new Error(response.message || 'Failed to delete product');
  },

  /**
   * Upload product image to Cloudinary via backend /api/upload
   */
  async uploadImage(file: File, folder: string = 'infinite7_impex/products'): Promise<{ url: string; publicId: string }> {
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
