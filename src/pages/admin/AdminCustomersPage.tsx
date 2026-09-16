import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Eye,
  Trash2,
  X,
  Clock,
  AlertTriangle,
  FileText,
  Tag,
  Save,
  StickyNote,
  Loader2,
} from 'lucide-react';
import { DataTable, type ColumnDef } from '../../components/common/DataTable';
import { CustomerApiService } from '../../services/customer.service';
import { useToast } from '../../context/ToastContext';
import type { Customer, CustomerPriority } from '../../types/customer';

export const AdminCustomersPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<CustomerPriority | 'all'>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Editing
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [notesText, setNotesText] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState<string | null>(null);

  // Sync notes text when selected customer opens
  useEffect(() => {
    if (selectedCustomer) {
      setNotesText(selectedCustomer.notes || '');
    }
  }, [selectedCustomer]);

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    setIsSavingNotes(true);
    try {
      const updated = await CustomerApiService.updateNotes(selectedCustomer._id, notesText.trim());
      setCustomers((prev) => prev.map((c) => (c._id === selectedCustomer._id ? updated : c)));
      setSelectedCustomer(updated);
      showSuccess('Customer notes saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save notes';
      showError(msg);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await CustomerApiService.getAll(
        {
          fullName: searchTerm,
          priority: priorityFilter,
        },
        {
          page: currentPage,
          limit: pageSize,
        },
        {
          sortBy: sortField,
          sortOrder: sortOrder,
        }
      );

      setCustomers(result.data);
      setTotalItems(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load customers';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, priorityFilter, currentPage, pageSize, sortField, sortOrder, showError]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handlePriorityChange = async (id: string, newPriority: CustomerPriority) => {
    setIsUpdatingPriority(id);
    try {
      const updated = await CustomerApiService.updatePriority(id, newPriority);
      setCustomers((prev) => prev.map((c) => (c._id === id ? updated : c)));
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(updated);
      }
      showSuccess(`Priority updated to ${newPriority.toUpperCase()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update priority';
      showError(msg);
    } finally {
      setIsUpdatingPriority(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    setIsDeleting(true);
    try {
      await CustomerApiService.delete(customerToDelete._id);
      showSuccess(`Inquiry from "${customerToDelete.fullName}" deleted successfully`);
      setCustomerToDelete(null);
      if (selectedCustomer?._id === customerToDelete._id) {
        setSelectedCustomer(null);
      }
      // Reload table
      loadCustomers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete customer inquiry';
      showError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getPriorityBadge = (priority: CustomerPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-400/20';
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Reusable Columns Definition
  const columns: ColumnDef<Customer>[] = [
    {
      key: 'fullName',
      header: 'Customer',
      sortable: true,
      width: '24%',
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 group-hover:text-[#8A5A1B] transition-colors">
            {row.fullName}
          </p>
          <a
            href={`mailto:${row.email}`}
            className="text-xs text-slate-500 hover:text-[#C88A2C] flex items-center gap-1 transition-colors"
          >
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[200px]">{row.email}</span>
          </a>
          {row.notes && (
            <div
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50/90 border border-amber-200 px-2 py-0.5 rounded max-w-[220px] truncate"
              title={`Notes: ${row.notes}`}
            >
              <Tag className="w-2.5 h-2.5 text-amber-600 shrink-0" />
              <span className="truncate">{row.notes}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      width: '16%',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-[#C88A2C] shrink-0" />
          <span className="font-medium truncate max-w-[140px]">{row.country}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      width: '16%',
      render: (row) => (
        <a
          href={`tel:${row.phone}`}
          className="text-xs font-medium text-slate-700 hover:text-[#00A859] flex items-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{row.phone}</span>
        </a>
      ),
    },
    {
      key: 'message',
      header: 'Requirement Message',
      width: '24%',
      render: (row) => (
        <p className="text-xs text-slate-600 line-clamp-2 max-w-[280px]" title={row.message}>
          {row.message}
        </p>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      width: '14%',
      render: (row) => (
        <div className="relative inline-block">
          <select
            value={row.priority}
            disabled={isUpdatingPriority === row._id}
            onChange={(e) => handlePriorityChange(row._id, e.target.value as CustomerPriority)}
            className={`appearance-none text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 pr-6 rounded-md border ring-1 focus:outline-none cursor-pointer transition-all ${getPriorityBadge(
              row.priority
            )} ${isUpdatingPriority === row._id ? 'opacity-50' : ''}`}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unset">Unset</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current opacity-60">
            <span className="text-[9px]">▼</span>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortable: true,
      width: '14%',
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{formatDate(row.createdAt)}</span>
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '10%',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCustomer(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#C88A2C] hover:bg-[#FAF7F2] border border-transparent hover:border-[#D5CBC0] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCustomerToDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Delete Inquiry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white rounded-xl p-6 border border-[#E5DCD1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#00A859] border border-[#E5DCD1]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Customer Inquiries
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E5DCD1]">
              {totalItems} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Review quotation leads, prioritize buyers, and inspect export trade inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadCustomers()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5DCD1] hover:border-[#C88A2C] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C88A2C]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Reusable DataTable */}
      <DataTable<Customer>
        columns={columns}
        data={customers}
        getRowId={(row) => row._id}
        isLoading={isLoading}
        searchPlaceholder="Search customer, email, country, or notes keywords..."
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        filterSlot={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as CustomerPriority | 'all');
                setCurrentPage(1);
              }}
              className="bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#C88A2C] cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
              <option value="unset">Unset</option>
            </select>
          </div>
        }
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          pageSize,
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
        emptyMessage="No customer inquiries found"
        emptySubtext="When overseas buyers submit inquiries via the website quotation form, they will appear here."
      />

      {/* 3. Inquiry Details Modal */}
      {selectedCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E2318] text-white flex items-center justify-center font-serif font-bold text-sm">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1A221E]">
                    {selectedCustomer.fullName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Received {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7]">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Country
                  </span>
                  <p className="font-semibold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C88A2C]" />
                    <span>{selectedCustomer.country}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="font-medium text-[#C88A2C] hover:underline truncate block"
                  >
                    {selectedCustomer.email}
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Phone
                  </span>
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="font-medium text-emerald-700 hover:underline block"
                  >
                    {selectedCustomer.phone}
                  </a>
                </div>
              </div>

              {/* Priority Control */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Lead Priority
                </label>
                <div className="flex items-center gap-3">
                  {(['high', 'medium', 'low', 'unset'] as CustomerPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePriorityChange(selectedCustomer._id, p)}
                      className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedCustomer.priority === p
                          ? 'bg-[#0E2318] text-white border-[#0E2318] shadow-sm'
                          : 'bg-[#FAF7F2] text-slate-600 border-[#D5CBC0] hover:border-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement Message */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C88A2C]" />
                  <span>Buyer Requirement Message</span>
                </span>
                <div className="p-4 rounded-xl bg-white border border-[#E5DCD1] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {selectedCustomer.message}
                </div>
              </div>

              {/* Admin Notes & Keywords (Editable) */}
              <div className="space-y-2.5 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <StickyNote className="w-4 h-4 text-[#C88A2C]" />
                    <span>Admin Notes &amp; Memory Keywords</span>
                  </span>
                  <button
                    type="button"
                    disabled={isSavingNotes}
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C88A2C] hover:bg-[#B57A22] text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Add tags or memory keywords (e.g. <em>50MT CIF Dubai, WhatsApp preferred, urgent Ramadan order</em>). You can search customers using these notes.
                </p>
                <textarea
                  rows={3}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Enter private admin keywords or follow-up notes for this customer..."
                  className="w-full bg-white border border-[#D5CBC0] rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:ring-1 focus:ring-[#C88A2C] transition-all font-normal"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCustomerToDelete(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2.5">
                <a
                  href={`mailto:${selectedCustomer.email}?subject=Infinite 7 Impex Quote Response`}
                  className="inline-flex items-center gap-1.5 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {customerToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isDeleting && setCustomerToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5DCD1] shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#1A221E]">
                Delete Customer Inquiry?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete the inquiry from{' '}
                <strong className="text-slate-900 font-semibold">{customerToDelete.fullName}</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2.5 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
