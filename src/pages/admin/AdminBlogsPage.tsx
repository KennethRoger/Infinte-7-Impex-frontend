import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  X,
  Clock,
  AlertTriangle,
  Save,
  Loader2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { DataTable, type ColumnDef } from '../../components/common/DataTable';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { BlogApiService } from '../../services/blog.service';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import {
  CreateBlogSchema,
  type Blog,
  type BlogSummary,
  type CreateBlogDto,
  type BlogSection,
} from '../../types/blog';

export const AdminBlogsPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
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

  // Modals & Selected States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogSummary | null>(null);

  // Form states for Create / Edit
  const [formData, setFormData] = useState<CreateBlogDto>({
    title: '',
    description: '',
    image: '',
    sections: [{ sectionTitle: '', description: '' }],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load paginated blogs
  const loadBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await BlogApiService.getAll(
        { title: debouncedSearchTerm },
        { page: currentPage, limit: pageSize },
        { sortBy: sortField, sortOrder }
      );

      setBlogs(result.data);
      setTotalItems(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load blog articles';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, pageSize, sortField, sortOrder, showError]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      sections: [{ sectionTitle: '', description: '' }],
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Open View Details Modal
  const handleOpenViewDetails = async (blogSummary: BlogSummary) => {
    try {
      const fullBlog = await BlogApiService.getById(blogSummary._id);
      setSelectedBlog(fullBlog);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load article details';
      showError(msg);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = async (blogSummary: BlogSummary) => {
    try {
      const fullBlog = await BlogApiService.getById(blogSummary._id);
      setBlogToEdit(fullBlog);
      setFormData({
        title: fullBlog.title,
        description: fullBlog.description,
        image: fullBlog.image || '',
        sections:
          fullBlog.sections && fullBlog.sections.length > 0
            ? fullBlog.sections
            : [{ sectionTitle: '', description: '' }],
      });
      setFormErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load article for editing';
      showError(msg);
    }
  };

  // Dynamic Section Handlers (Max 5 sections)
  const handleAddSection = () => {
    if (formData.sections.length >= 5) {
      showError('A blog can have a maximum of 5 sections');
      return;
    }
    setFormData({
      ...formData,
      sections: [...formData.sections, { sectionTitle: '', description: '' }],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (formData.sections.length <= 1) {
      showError('At least one section is required');
      return;
    }
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, idx) => idx !== index),
    });
  };

  const handleSectionChange = (index: number, field: keyof BlogSection, value: string) => {
    const updated = [...formData.sections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, sections: updated });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.sections.length) return;

    const updated = [...formData.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFormData({ ...formData, sections: updated });
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsed = CreateBlogSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.join('.');
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
      const created = await BlogApiService.create(formData);
      showSuccess(`Article "${created.title}" published successfully`);
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        image: '',
        sections: [{ sectionTitle: '', description: '' }],
      });
      loadBlogs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish article';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogToEdit) return;
    setFormErrors({});

    const parsed = CreateBlogSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.join('.');
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
      const updated = await BlogApiService.update(blogToEdit._id, formData);
      showSuccess(`Article "${updated.title}" updated successfully`);
      setBlogToEdit(null);
      if (selectedBlog?._id === blogToEdit._id) {
        setSelectedBlog(updated);
      }
      loadBlogs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update article';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      await BlogApiService.delete(blogToDelete._id);
      showSuccess(`Article "${blogToDelete.title}" deleted successfully`);
      setBlogToDelete(null);
      if (selectedBlog?._id === blogToDelete._id) {
        setSelectedBlog(null);
      }
      loadBlogs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete article';
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
  const columns: ColumnDef<BlogSummary>[] = [
    {
      key: 'image',
      header: 'Cover',
      width: '12%',
      render: (row) => (
        <div className="w-16 h-11 rounded-lg overflow-hidden border border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs">
          {row.image ? (
            <img
              src={row.image}
              alt={row.title}
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
      key: 'title',
      header: 'Article Title',
      sortable: true,
      width: '32%',
      render: (row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleOpenViewDetails(row)}
            className="font-bold text-slate-900 hover:text-[#C88A2C] transition-colors text-left block cursor-pointer line-clamp-2"
          >
            {row.title}
          </button>
          <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[180px]">
            ID: {row._id}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Lead Intro',
      width: '32%',
      render: (row) => (
        <p
          className="text-xs text-slate-600 line-clamp-2 max-w-[340px]"
          title={row.description}
        >
          {row.description}
        </p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Published',
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
            onClick={() => handleOpenViewDetails(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#C88A2C] hover:bg-[#FAF7F2] border border-transparent hover:border-[#D5CBC0] transition-colors cursor-pointer"
            title="View Full Article"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
            title="Edit Article"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setBlogToDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Delete Article"
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
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#7C3AED] border border-[#E5DCD1]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Market Intelligence &amp; Blogs
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E5DCD1]">
              {totalItems} published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Publish export intelligence, buyers' guides, and agricultural trade insights with structured sections (max 5 sections).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadBlogs()}
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
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* 2. Reusable DataTable */}
      <DataTable<BlogSummary>
        columns={columns}
        data={blogs}
        getRowId={(row) => row._id}
        isLoading={isLoading}
        searchPlaceholder="Search articles by title..."
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
        emptyMessage="No blog articles found"
        emptySubtext="Click 'New Article' above to draft and publish your first export intelligence post."
      />

      {/* 3. Create Article Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0E2318] text-[#22C55E] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E]">
                    Publish New Article
                  </h3>
                  <p className="text-xs text-slate-500">
                    Draft export market intelligence with dynamic sections (max 5).
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

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-6">
              {/* Article Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Title <span className="text-rose-500">*</span>
                  <span className="text-slate-400 font-normal ml-2">
                    ({formData.title.length}/150)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder="e.g., Why Indian Red Onions Dominate Asian Import Markets"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Lead Intro Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lead Intro / Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="A concise overview or lead summary of the article..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Cover Image Upload */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Article Cover Image"
                folder="infinite7_impex/blogs"
                disabled={isSubmitting}
              />
              {formErrors.image && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.image}</p>
              )}

              {/* Dynamic Sections Manager */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5DCD1] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7C3AED]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Article Sections
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-slate-600 border border-[#E5DCD1]">
                      {formData.sections.length} / 5 max
                    </span>
                  </div>

                  {formData.sections.length < 5 ? (
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A859] hover:text-[#008f4c] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Max 5 sections reached
                    </span>
                  )}
                </div>

                {/* Section Cards */}
                <div className="space-y-4">
                  {formData.sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF7F2]/60 rounded-xl p-4 border border-[#E5DCD1] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#0E2318] text-[#22C55E] text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold uppercase text-slate-700">
                            Section {idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.sections.length - 1}
                            onClick={() => handleMoveSection(idx, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {formData.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Title */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Section Heading <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., The Lasalgaon Advantage"
                          value={section.sectionTitle || ''}
                          onChange={(e) =>
                            handleSectionChange(idx, 'sectionTitle', e.target.value)
                          }
                          className="w-full bg-white border border-[#D5CBC0] rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#C88A2C] transition-all font-medium"
                        />
                      </div>

                      {/* Section Content */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Section Content <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Detailed paragraph or analysis for this section..."
                          value={section.description}
                          onChange={(e) =>
                            handleSectionChange(idx, 'description', e.target.value)
                          }
                          className="w-full bg-white border border-[#D5CBC0] rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#C88A2C] transition-all font-normal"
                        />
                        {formErrors[`sections.${idx}.description`] && (
                          <p className="text-[11px] text-rose-600 font-medium">
                            {formErrors[`sections.${idx}.description`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Publish Article</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Article Modal */}
      {blogToEdit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setBlogToEdit(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2563EB] border border-[#E5DCD1] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A221E] truncate max-w-md">
                    Edit Article
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update content, sections (max 5), or banner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setBlogToEdit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-6">
              {/* Article Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Title <span className="text-rose-500">*</span>
                  <span className="text-slate-400 font-normal ml-2">
                    ({formData.title.length}/150)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder="e.g., Why Indian Red Onions Dominate Asian Import Markets"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Lead Intro Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lead Intro / Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="A concise overview or lead summary of the article..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-normal"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Cover Image Upload */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Article Cover Image"
                folder="infinite7_impex/blogs"
                disabled={isSubmitting}
              />
              {formErrors.image && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.image}</p>
              )}

              {/* Dynamic Sections Manager */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5DCD1] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7C3AED]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Article Sections
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-slate-600 border border-[#E5DCD1]">
                      {formData.sections.length} / 5 max
                    </span>
                  </div>

                  {formData.sections.length < 5 ? (
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A859] hover:text-[#008f4c] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Max 5 sections reached
                    </span>
                  )}
                </div>

                {/* Section Cards */}
                <div className="space-y-4">
                  {formData.sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF7F2]/60 rounded-xl p-4 border border-[#E5DCD1] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#0E2318] text-[#22C55E] text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold uppercase text-slate-700">
                            Section {idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.sections.length - 1}
                            onClick={() => handleMoveSection(idx, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {formData.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Title */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Section Heading <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., The Lasalgaon Advantage"
                          value={section.sectionTitle || ''}
                          onChange={(e) =>
                            handleSectionChange(idx, 'sectionTitle', e.target.value)
                          }
                          className="w-full bg-white border border-[#D5CBC0] rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#C88A2C] transition-all font-medium"
                        />
                      </div>

                      {/* Section Content */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Section Content <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Detailed paragraph or analysis for this section..."
                          value={section.description}
                          onChange={(e) =>
                            handleSectionChange(idx, 'description', e.target.value)
                          }
                          className="w-full bg-white border border-[#D5CBC0] rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#C88A2C] transition-all font-normal"
                        />
                        {formErrors[`sections.${idx}.description`] && (
                          <p className="text-[11px] text-rose-600 font-medium">
                            {formErrors[`sections.${idx}.description`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#E5DCD1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setBlogToEdit(null)}
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
                      <span>Saving Changes...</span>
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

      {/* 5. View Blog Details Modal */}
      {selectedBlog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5DCD1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover image banner */}
            <div className="h-48 sm:h-56 w-full bg-slate-900 relative overflow-hidden shrink-0">
              {selectedBlog.image ? (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">No cover image uploaded</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2C] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Published {formatDate(selectedBlog.createdAt)}</span>
                </span>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A221E] leading-tight">
                  {selectedBlog.title}
                </h3>
              </div>

              {/* Lead description */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7] text-slate-800 leading-relaxed font-normal text-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Lead Intro / Overview
                </span>
                <p>{selectedBlog.description}</p>
              </div>

              {/* Embedded Sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#7C3AED]" />
                  <span>Article Sections ({selectedBlog.sections?.length || 0})</span>
                </h4>

                <div className="space-y-4">
                  {selectedBlog.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border border-[#E5DCD1] space-y-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E2318] text-[#22C55E] text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="font-serif font-bold text-base text-[#1A221E]">
                          {section.sectionTitle || <span className="text-slate-400 italic">Untitled Section</span>}
                        </h5>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-7">
                        {section.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Article ID:</span>
                  <span className="font-mono text-slate-800 break-all">{selectedBlog._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Sections:</span>
                  <span className="font-medium text-slate-800">
                    {selectedBlog.sections?.length || 0} Dynamic Section(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#E5DCD1] bg-[#FAF7F2] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setBlogToDelete(selectedBlog);
                  setSelectedBlog(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenEdit(selectedBlog);
                  setSelectedBlog(null);
                }}
                className="inline-flex items-center gap-1.5 bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Dialog */}
      {blogToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isDeleting && setBlogToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5DCD1] shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#1A221E]">Delete Article?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900 font-semibold">"{blogToDelete.title}"</strong>?
                This article will be permanently removed from the public blog catalogue.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setBlogToDelete(null)}
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
