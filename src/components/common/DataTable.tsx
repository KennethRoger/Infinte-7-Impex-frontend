import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  X,
} from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtext?: string;
  // Search
  searchPlaceholder?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  // Custom Filters Slot
  filterSlot?: React.ReactNode;
  // Sorting
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  // Pagination
  pagination?: PaginationConfig;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your filters or search query.',
  searchPlaceholder = 'Search records...',
  searchTerm,
  onSearchChange,
  filterSlot,
  sortField,
  sortOrder,
  onSort,
  pagination,
}: DataTableProps<T>) {
  const handleHeaderClick = (col: ColumnDef<T>) => {
    if (!col.sortable || !onSort) return;
    onSort(col.key);
  };

  const renderSortIcon = (col: ColumnDef<T>) => {
    if (!col.sortable) return null;
    if (sortField !== col.key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#C88A2C] shrink-0 ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#C88A2C] shrink-0 ml-1" />
    );
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5DCD1] shadow-sm overflow-hidden flex flex-col">
      {/* 1. Toolbar (Search & Filter Slot) */}
      {(onSearchChange !== undefined || filterSlot !== undefined) && (
        <div className="p-4 sm:p-5 border-b border-[#E5DCD1] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          {/* Search Input */}
          {onSearchChange !== undefined && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg text-xs sm:text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Custom Filters Slot */}
          {filterSlot && (
            <div className="flex items-center gap-3 flex-wrap sm:justify-end">
              {filterSlot}
            </div>
          )}
        </div>
      )}

      {/* 2. Responsive Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#E5DCD1] text-[11px] font-bold uppercase tracking-wider text-slate-600 select-none">
              {columns.map((col) => {
                const alignClass = getAlignmentClass(col.align);
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    onClick={() => handleHeaderClick(col)}
                    className={`px-4 sm:px-6 py-3.5 ${alignClass} ${col.className || ''} ${
                      col.sortable ? 'cursor-pointer hover:bg-[#F2ECE3] transition-colors' : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${
                        col.align === 'right'
                          ? 'justify-end'
                          : col.align === 'center'
                          ? 'justify-center'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {renderSortIcon(col)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAE2D7] text-xs sm:text-sm text-[#1A221E]">
            {isLoading ? (
              // Skeleton Loading Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E7DFD3] flex items-center justify-center text-slate-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1A221E]">{emptyMessage}</h4>
                    <p className="text-xs text-slate-500">{emptySubtext}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, index) => {
                const rowId = getRowId(row);
                return (
                  <tr
                    key={rowId}
                    className="hover:bg-[#FAF7F2]/80 transition-colors duration-100 group"
                  >
                    {columns.map((col) => {
                      const alignClass = getAlignmentClass(col.align);
                      return (
                        <td
                          key={col.key}
                          className={`px-4 sm:px-6 py-4 align-middle ${alignClass} ${
                            col.className || ''
                          }`}
                        >
                          {col.render
                            ? col.render(row, index)
                            : (row as Record<string, unknown>)[col.key] !== undefined
                            ? String((row as Record<string, unknown>)[col.key])
                            : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Controls */}
      {pagination && pagination.totalPages > 0 && (
        <div className="p-4 sm:px-6 border-t border-[#E5DCD1] bg-[#FAF7F2]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span>
              Showing{' '}
              <strong className="text-slate-900">
                {(pagination.currentPage - 1) * pagination.pageSize + (data.length > 0 ? 1 : 0)}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900">
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
              </strong>{' '}
              of <strong className="text-slate-900">{pagination.totalItems}</strong> entries
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pagination.onPageSizeChange && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Per page:
                </span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                  className="bg-white border border-[#D5CBC0] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#C88A2C] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}

            {/* Previous Page Button */}
            <button
              type="button"
              disabled={pagination.currentPage <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-[#D5CBC0] bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-medium">
              Page <strong className="text-slate-900">{pagination.currentPage}</strong> of{' '}
              <strong className="text-slate-900">{pagination.totalPages}</strong>
            </span>

            {/* Next Page Button */}
            <button
              type="button"
              disabled={pagination.currentPage >= pagination.totalPages || isLoading}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-[#D5CBC0] bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
