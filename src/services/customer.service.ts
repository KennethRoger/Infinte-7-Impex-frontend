import { api } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import type {
  Customer,
  CustomerPriority,
} from '../types/customer';
import type { PaginatedResult, PaginationParams } from '../types/api';

export interface CustomerFilters {
  search?: string;
  fullName?: string;
  email?: string;
  country?: string;
  priority?: CustomerPriority | 'all';
  notes?: string;
  isActive?: boolean;
}

export const CustomerApiService = {
  /**
   * Fetch all customers with filters, pagination, and sorting directly from backend
   */
  async getAll(
    filters: CustomerFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<PaginatedResult<Customer>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };

    if (filters.search) queryParams['search'] = filters.search;
    if (filters.fullName) queryParams['fullName'] = filters.fullName;
    if (filters.email) queryParams['email'] = filters.email;
    if (filters.country) queryParams['country'] = filters.country;
    if (filters.notes) queryParams['notes'] = filters.notes;
    if (filters.priority && filters.priority !== 'all') {
      queryParams['priority'] = filters.priority;
    }
    if (filters.isActive !== undefined) queryParams['isActive'] = filters.isActive;

    const response = await api.get<PaginatedResult<Customer>>(
      API_ENDPOINTS.CUSTOMERS.BASE,
      { params: queryParams }
    );

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch customers');
  },

  /**
   * Fetch single customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const response = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch customer');
  },

  /**
   * Update priority for a customer inquiry
   */
  async updatePriority(id: string, priority: CustomerPriority): Promise<Customer> {
    const response = await api.patch<Customer>(
      API_ENDPOINTS.CUSTOMERS.PRIORITY(id),
      { priority }
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update priority');
  },

  /**
   * Update internal admin notes for a customer inquiry
   */
  async updateNotes(id: string, notes: string): Promise<Customer> {
    const response = await api.patch<Customer>(
      API_ENDPOINTS.CUSTOMERS.NOTES(id),
      { notes }
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update customer notes');
  },

  /**
   * Delete a customer inquiry
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete<null>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    if (response.success) {
      return true;
    }
    throw new Error(response.message || 'Failed to delete customer');
  },
};
