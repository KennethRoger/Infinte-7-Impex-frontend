import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
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
  FolderTree,
  Filter,
} from 'lucide-react';
import { DataTable, type ColumnDef } from '../../components/common/DataTable';
import { MultiImageUploadField } from '../../components/common/MultiImageUploadField';
import { ProductApiService } from '../../services/product.service';
import { CategoryApiService } from '../../services/category.service';
import { useToast } from '../../context/ToastContext';
import {
  CreateProductSchema,
  type PopulatedProduct,
  type CreateProductDto,
} from '../../types/product';
import type { ProductCategory } from '../../types/category';

export const AdminProductsPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [products, setProducts] = useState<PopulatedProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<PopulatedProduct | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState<number>(0);
  const [productToEdit, setProductToEdit] = useState<PopulatedProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<PopulatedProduct | null>(null);

  // Form states for Create / Edit
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    category: '',
    description: '',
    images: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch available categories for dropdowns
  const loadCategories = useCallback(async () => {
    try {
      const cats = await CategoryApiService.getAllPublic();
      setCategories(cats.filter((c) => !c.isRemoved));
    } catch {
      // Non-blocking, will retry on user action
    }
  }, []);

  // Fetch paginated products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ProductApiService.getAll(
        {
          name: searchTerm,
          category: selectedCategoryFilter || undefined,
        },
        { page: currentPage, limit: pageSize },
        { sortBy: sortField, sortOrder }
      );

      setProducts(result.data);
      setTotalItems(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load products';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategoryFilter, currentPage, pageSize, sortField, sortOrder, showError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      description: '',
      images: [],
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: PopulatedProduct) => {
    setProductToEdit(product);
    setFormData({
      name: product.name,
      category: product.category?._id || '',
      description: product.description || '',
      images: product.images || [],
    });
    setFormErrors({});
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsed = CreateProductSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFormErrors(errors);
      showError('Please check form fields for validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProduct = await ProductApiService.create(formData);
      showSuccess(`Product "${newProduct.name}" created successfully`);
      setIsCreateModalOpen(false);
      setFormData({ name: '', category: '', description: '', images: [] });
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;
    setFormErrors({});

    const parsed = CreateProductSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFormErrors(errors);
      showError('Please check form fields for validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await ProductApiService.update(productToEdit._id, formData);
      showSuccess(`Product "${updated.name}" updated successfully`);
      setProductToEdit(null);
      if (selectedProduct?._id === productToEdit._id) {
        setSelectedProduct(updated);
      }
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update product';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await ProductApiService.delete(productToDelete._id);
      showSuccess(`Product "${productToDelete.name}" deleted successfully`);
      setProductToDelete(null);
      if (selectedProduct?._id === productToDelete._id) {
        setSelectedProduct(null);
      }
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
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
  const columns: ColumnDef<PopulatedProduct>[] = [
    {
      key: 'images',
      header: 'Image',
      width: '12%',
      render: (row) => {
        const coverImg = row.images?.[0];
        const extraCount = (row.images?.length || 0) - 1;
        return (
          <div className="relative w-14 h-12 rounded-lg overflow-hidden border border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs">
            {coverImg ? (
              <img
                src={coverImg}
                alt={row.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
            {extraCount > 0 && (
              <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] font-bold px-1 py-0.2 rounded-tl">
                +{extraCount}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      width: '24%',
      render: (row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(row);
              setActiveModalImageIndex(0);
            }}
            className="font-bold text-slate-900 hover:text-[#C88A2C] transition-colors text-left block cursor-pointer"
          >
            {row.name}
          </button>
          <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[160px]">
            ID: {row._id}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '20%',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <FolderTree className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[130px]">{row.category?.name || 'Unassigned'}</span>
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      width: '28%',
      render: (row) => (
        <p
          className="text-xs text-slate-600 line-clamp-2 max-w-[280px]"
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
            onClick={() => {
              setSelectedProduct(row);
              setActiveModalImageIndex(0);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#C88A2C] hover:bg-[#FAF7F2] border border-transparent hover:border-[#D5CBC0] transition-colors cursor-pointer"
            title="View Product Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setProductToDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Delete Product"
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
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#2563EB] border border-[#E5DCD1]">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Products Management
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E5DCD1]">
              {totalItems} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage produce inventory, assign to categories, and configure product photo galleries (max 4 images).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadProducts()}
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
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter & Search Bar Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-[#E5DCD1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 shrink-0">
            Category:
          </span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#C88A2C] transition-colors font-medium cursor-pointer w-full sm:w-56"
          >
            <option value="">All Categories ({totalItems})</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategoryFilter && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('');
              setCurrentPage(1);
            }}
            className="text-xs text-[#C88A2C] hover:underline cursor-pointer font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* 3. Reusable DataTable */}
      <DataTable<PopulatedProduct>
        columns={columns}
        data={products}
        getRowId={(row) => row._id}
        isLoading={isLoading}
        searchPlaceholder="Search product by name..."
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
        emptyMessage="No products found"
        emptySubtext="Click 'Add Product' above to create your first export product item."
      />

      {/* 4. Create Product Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0E2318] text-[#22C55E] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E]">
                    Create New Product
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add an export produce item and assign it to a category.
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
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Red Onion, Green Chilli, Cumin Seeds"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Category Select Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium cursor-pointer"
                >
                  <option value="" disabled>
                    -- Select a category --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe produce sizing, harvesting belts, pungency, sorting facility details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Multi-Image Gallery Upload */}
              <MultiImageUploadField
                values={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={4}
                label="Product Gallery (1 to 4 Images)"
                folder="infinite7_impex/products"
                disabled={isSubmitting}
              />
              {formErrors.images && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.images}</p>
              )}

              {/* Footer Actions */}
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
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Product Modal */}
      {productToEdit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setProductToEdit(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2563EB] border border-[#E5DCD1] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E]">
                    Edit Product: {productToEdit.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update produce details, category, or photo gallery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setProductToEdit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Red Onion"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Category Select Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe produce sizing, harvesting belts, pungency..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Multi-Image Gallery Upload */}
              <MultiImageUploadField
                values={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={4}
                label="Product Gallery (1 to 4 Images)"
                folder="infinite7_impex/products"
                disabled={isSubmitting}
              />
              {formErrors.images && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.images}</p>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#E5DCD1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setProductToEdit(null)}
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

      {/* 6. View Product Details Modal */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gallery Viewer Banner */}
            <div className="relative bg-slate-900 w-full h-64 flex flex-col">
              {selectedProduct.images?.[activeModalImageIndex] ? (
                <img
                  src={selectedProduct.images[activeModalImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">No image available</span>
                </div>
              )}

              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Thumbnails Row */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2 p-1">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveModalImageIndex(i)}
                      className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        activeModalImageIndex === i
                          ? 'border-[#22C55E] scale-105 shadow-md'
                          : 'border-white/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <FolderTree className="w-3 h-3 text-emerald-600" />
                  <span>{selectedProduct.category?.name || 'Unassigned Category'}</span>
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#1A221E]">
                  {selectedProduct.name}
                </h3>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C88A2C]" />
                  <span>Produce Description</span>
                </span>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap text-sm">
                  {selectedProduct.description || (
                    <span className="text-slate-400 italic">No description provided</span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Product ID:</span>
                  <span className="font-mono text-slate-800 break-all">{selectedProduct._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Created On:</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(selectedProduct.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenEdit(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="inline-flex items-center gap-1.5 bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Dialog */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isDeleting && setProductToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5DCD1] shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#1A221E]">Delete Product?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900 font-semibold">"{productToDelete.name}"</strong>?
                This produce item will be removed from the export catalogue.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
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
