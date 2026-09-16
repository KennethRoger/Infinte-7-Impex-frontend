import { api } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import type {
  Customer,
  CustomerPriority,
} from '../types/customer';
import type { PaginatedResult, PaginationParams } from '../types/api';

export interface CustomerFilters {
  fullName?: string;
  email?: string;
  country?: string;
  priority?: CustomerPriority | 'all';
  notes?: string;
  isActive?: boolean;
}

const LOCAL_STORAGE_CUSTOMERS_KEY = 'mock_customers_list';

// Initial seed data for offline / standalone client testing
const INITIAL_SEED_CUSTOMERS: Customer[] = [
  {
    _id: 'cust_001',
    fullName: 'Ahmed Al-Mansoor',
    email: 'ahmed@gulfproduce.ae',
    country: 'United Arab Emirates',
    phone: '+971 50 123 4567',
    message: 'Looking for 2x40ft FCL export-grade Red Onions (Lasalgaon origin) to Dubai Jebel Ali. Need CIF quotation and phyto certificate details.',
    priority: 'high',
    isActive: true,
    notes: 'Urgent RFQ for Ramadan season stocking. Verified commercial importer.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    _id: 'cust_002',
    fullName: 'Michael Tan',
    email: 'm.tan@singaporefresh.sg',
    country: 'Singapore',
    phone: '+65 6789 0123',
    message: 'Interested in regular air-freight consignments of fresh Green Chillies (G4 variety) - 500kg per week to Changi Airport.',
    priority: 'medium',
    isActive: true,
    notes: 'Requires cold-chain temperature logger readings on arrival.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    _id: 'cust_003',
    fullName: 'Faisal Al-Kuwari',
    email: 'faisal@dohafoods.qa',
    country: 'Qatar',
    phone: '+974 4412 3456',
    message: 'Please send complete export catalogue for Indian whole spices, condiments, and bulk packed foods for retail distribution.',
    priority: 'low',
    isActive: true,
    notes: 'Inquiry for wholesale supermarket chain.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    _id: 'cust_004',
    fullName: 'Samantha Perera',
    email: 'samantha@colombotrading.lk',
    country: 'Sri Lanka',
    phone: '+94 11 234 5678',
    message: 'Seeking 50MT 50kg bulk bag red onions ocean shipment from Tuticorin or Cochin Port. Please advise lead times.',
    priority: 'high',
    isActive: true,
    notes: 'Existing buyer with established LC payment terms.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
  },
  {
    _id: 'cust_005',
    fullName: 'Yousef Al-Sabah',
    email: 'yousef@kuwaitagri.com',
    country: 'Kuwait',
    phone: '+965 2244 5566',
    message: 'Inquiring about APEDA-certified fresh vegetable consignments and reefer ocean freight availability.',
    priority: 'unset',
    isActive: true,
    notes: 'New prospective contact from website.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
  },
];

function getLocalCustomers(): Customer[] {
  if (typeof window === 'undefined') return INITIAL_SEED_CUSTOMERS;
  const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(INITIAL_SEED_CUSTOMERS));
  return INITIAL_SEED_CUSTOMERS;
}

function saveLocalCustomers(customers: Customer[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
  }
}

export const CustomerApiService = {
  /**
   * Fetch all customers with filters, pagination, and sorting
   */
  async getAll(
    filters: CustomerFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<PaginatedResult<Customer>> {
    try {
      const queryParams: Record<string, string | number | boolean | undefined> = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      };

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
    } catch (backendError) {
      // Seamless local fallback if backend server is unreachable
      console.warn('[CustomerApiService] Backend query failed, using local store:', backendError);

      let list = getLocalCustomers();

      // Filter by Priority
      if (filters.priority && filters.priority !== 'all') {
        list = list.filter((c) => c.priority === filters.priority);
      }

      // Filter by Name / Email / Country / Notes / Query
      if (filters.fullName) {
        const q = filters.fullName.toLowerCase();
        list = list.filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            (c.notes && c.notes.toLowerCase().includes(q))
        );
      }

      if (filters.notes) {
        const q = filters.notes.toLowerCase();
        list = list.filter((c) => c.notes && c.notes.toLowerCase().includes(q));
      }

      // Sorting
      const sortField = (sort.sortBy || 'createdAt') as keyof Customer;
      const isAsc = sort.sortOrder === 'asc';
      list = [...list].sort((a, b) => {
        const aVal = a[sortField] ?? '';
        const bVal = b[sortField] ?? '';
        if (aVal < bVal) return isAsc ? -1 : 1;
        if (aVal > bVal) return isAsc ? 1 : -1;
        return 0;
      });

      // Pagination
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = list.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        total,
        page,
        limit,
        totalPages,
      };
    }
  },

  /**
   * Fetch single customer by ID
   */
  async getById(id: string): Promise<Customer> {
    try {
      const response = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch customer');
    } catch {
      const list = getLocalCustomers();
      const found = list.find((c) => c._id === id);
      if (!found) throw new Error('Customer inquiry not found');
      return found;
    }
  },

  /**
   * Update priority for a customer inquiry
   */
  async updatePriority(id: string, priority: CustomerPriority): Promise<Customer> {
    try {
      const response = await api.patch<Customer>(
        API_ENDPOINTS.CUSTOMERS.PRIORITY(id),
        { priority }
      );
      if (response.success && response.data) {
        // Also sync local
        const list = getLocalCustomers().map((c) =>
          c._id === id ? { ...c, priority, updatedAt: new Date().toISOString() } : c
        );
        saveLocalCustomers(list);
        return response.data;
      }
      throw new Error(response.message || 'Failed to update priority');
    } catch {
      const list = getLocalCustomers().map((c) =>
        c._id === id ? { ...c, priority, updatedAt: new Date().toISOString() } : c
      );
      saveLocalCustomers(list);
      const updated = list.find((c) => c._id === id);
      if (!updated) throw new Error('Customer inquiry not found');
      return updated;
    }
  },

  /**
   * Update internal admin notes for a customer inquiry
   */
  async updateNotes(id: string, notes: string): Promise<Customer> {
    try {
      const response = await api.patch<Customer>(
        API_ENDPOINTS.CUSTOMERS.NOTES(id),
        { notes }
      );
      if (response.success && response.data) {
        const list = getLocalCustomers().map((c) =>
          c._id === id ? { ...c, notes, updatedAt: new Date().toISOString() } : c
        );
        saveLocalCustomers(list);
        return response.data;
      }
      throw new Error(response.message || 'Failed to update customer notes');
    } catch {
      const list = getLocalCustomers().map((c) =>
        c._id === id ? { ...c, notes, updatedAt: new Date().toISOString() } : c
      );
      saveLocalCustomers(list);
      const updated = list.find((c) => c._id === id);
      if (!updated) throw new Error('Customer inquiry not found');
      return updated;
    }
  },

  /**
   * Delete a customer inquiry
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<null>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
      if (response.success) {
        const list = getLocalCustomers().filter((c) => c._id !== id);
        saveLocalCustomers(list);
        return true;
      }
      throw new Error(response.message || 'Failed to delete customer');
    } catch {
      const list = getLocalCustomers().filter((c) => c._id !== id);
      saveLocalCustomers(list);
      return true;
    }
  },
};
