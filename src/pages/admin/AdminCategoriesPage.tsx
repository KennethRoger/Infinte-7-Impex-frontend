import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderTree,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  X,
  Clock,
  AlertTriangle,
  FileText,
  Save,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { DataTable, type ColumnDef } from '../../components/common/DataTable';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { CategoryApiService } from '../../services/category.service';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import {
  CreateCategorySchema,
  type ProductCategory,
  type CreateCategoryDto,
} from '../../types/category';

export const AdminCategoriesPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Form states for Create / Edit
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await CategoryApiService.getAll(
        { name: debouncedSearchTerm },
        { page: currentPage, limit: pageSize },
        { sortBy: sortField, sortOrder }
      );

      setCategories(result.data);
      setTotalItems(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load product categories';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, pageSize, sortField, sortOrder, showError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({ name: '', description: '', image: '' });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category: ProductCategory) => {
    setCategoryToEdit(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setFormErrors({});
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Zod validation
    const parsed = CreateCategorySchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFormErrors(errors);
      showError('Please correct the validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCategory = await CategoryApiService.create(formData);
      showSuccess(`Category "${newCategory.name}" created successfully`);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', image: '' });
      loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit) return;
    setFormErrors({});

    const parsed = CreateCategorySchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFormErrors(errors);
      showError('Please correct the validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await CategoryApiService.update(categoryToEdit._id, formData);
      showSuccess(`Category "${updated.name}" updated successfully`);
      setCategoryToEdit(null);
      if (selectedCategory?._id === categoryToEdit._id) {
        setSelectedCategory(updated);
      }
      loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await CategoryApiService.delete(categoryToDelete._id);
      showSuccess(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategoryToDelete(null);
      if (selectedCategory?._id === categoryToDelete._id) {
        setSelectedCategory(null);
      }
      loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
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

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Table Columns Definition
  const columns: ColumnDef<ProductCategory>[] = [
    {
      key: 'image',
      header: 'Banner',
      width: '12%',
      render: (row) => (
        <div className="w-14 h-11 rounded-lg overflow-hidden border border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Category Name',
      sortable: true,
      width: '26%',
      render: (row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory(row)}
            className="font-bold text-slate-900 hover:text-[#C88A2C] transition-colors text-left block cursor-pointer"
          >
            {row.name}
          </button>
          <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[180px]">
            ID: {row._id}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      width: '38%',
      render: (row) => (
        <p
          className="text-xs text-slate-600 line-clamp-2 max-w-[360px]"
          title={row.description || 'No description provided'}
        >
          {row.description || <span className="text-slate-400 italic">No description</span>}
        </p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
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
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setSelectedCategory(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#C88A2C] hover:bg-[#FAF7F2] border border-transparent hover:border-[#D5CBC0] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCategoryToDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Delete Category"
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
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#C88A2C] border border-[#E5DCD1]">
              <FolderTree className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Product Categories
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E5DCD1]">
              {totalItems} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Organize produce categories (e.g. Fresh Vegetables, Condiments, Spices) displayed on the export catalogue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadCategories()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5DCD1] hover:border-[#C88A2C] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C88A2C]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Reusable DataTable */}
      <DataTable<ProductCategory>
        columns={columns}
        data={categories}
        getRowId={(row) => row._id}
        isLoading={isLoading}
        searchPlaceholder="Search category name..."
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
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
        emptyMessage="No product categories found"
        emptySubtext="Click 'Add Category' above to create your first export produce category."
      />

      {/* 3. Create Category Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0E2318] text-[#22C55E] flex items-center justify-center">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E]">
                    Create New Category
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a new category to group export products.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-5">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fresh Vegetables, Whole Spices"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the produce varieties and export highlights in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Cloudinary Image Upload or Direct URL */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Category Banner Image"
                folder="infinite7_impex/categories"
                disabled={isSubmitting}
              />
              {formErrors.image && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.image}</p>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E5DCD1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Category Modal */}
      {categoryToEdit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setCategoryToEdit(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2563EB] border border-[#E5DCD1] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E]">
                    Edit Category: {categoryToEdit.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update produce details or banner imagery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCategoryToEdit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-5">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fresh Vegetables"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the produce varieties..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Cloudinary Image Upload or Direct URL */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Category Banner Image"
                folder="infinite7_impex/categories"
                disabled={isSubmitting}
              />
              {formErrors.image && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.image}</p>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E5DCD1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCategoryToEdit(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Category Details Modal */}
      {selectedCategory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image banner preview */}
            <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
              {selectedCategory.image ? (
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">No banner image uploaded</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C88A2C]">
                  Product Category Details
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#1A221E]">
                  {selectedCategory.name}
                </h3>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C88A2C]" />
                  <span>Description</span>
                </span>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap text-sm">
                  {selectedCategory.description || (
                    <span className="text-slate-400 italic">No description provided</span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Category ID:</span>
                  <span className="font-mono text-slate-800 break-all">{selectedCategory._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Created On:</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(selectedCategory.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCategoryToDelete(selectedCategory);
                  setSelectedCategory(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedCategory);
                    setSelectedCategory(null);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Dialog */}
      {categoryToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isDeleting && setCategoryToDelete(null)}
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
                Delete Category?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900 font-semibold">"{categoryToDelete.name}"</strong>?
                This category will be removed from the export catalogue.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
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
