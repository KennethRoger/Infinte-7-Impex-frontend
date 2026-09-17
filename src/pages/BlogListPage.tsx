import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, BookOpen, Clock, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { BlogApiService } from '../services/blog.service';
import { useToast } from '../context/ToastContext';
import type { BlogSummary } from '../types/blog';

// Fallback image for articles without cover
import defaultArticleImg from '../assets/process/ship-delivery.jpg';

export const BlogListPage: React.FC = () => {
  const { navigate } = useRouter();
  const { showError } = useToast();

  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pageSize = 6;

  const loadBlogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await BlogApiService.getAll(
        {},
        { page: currentPage, limit: pageSize },
        { sortBy: 'createdAt', sortOrder: 'desc' }
      );

      setBlogs(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load articles. Please check your internet connection.';
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, showError]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleCardClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      {/* 1. Dark Emerald Hero Header */}
      <section className="bg-[#0E2318] text-white py-14 sm:py-18 lg:py-20 border-b border-[#1C422D] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2318] via-[#0E2318]/90 to-transparent z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#22C55E] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSIGHTS &amp; MARKET INTELLIGENCE</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            The Export Brief
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl leading-relaxed font-normal pt-1">
            Global market intelligence, documentation guides, APEDA compliance standards, and crop
            harvest updates for international agricultural buyers.
          </p>
        </div>
      </section>

      {/* 2. Blog Cards List */}
      <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={loadBlogs}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/60 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-6 sm:space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-xs grid grid-cols-1 md:grid-cols-12 animate-pulse"
              >
                <div className="md:col-span-5 lg:col-span-4 h-56 sm:h-64 md:h-auto bg-slate-200" />
                <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-7 bg-slate-200 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-20 pt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 && !errorMessage ? (
          /* Empty Fallback State */
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E5DCD1] p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DCD1] flex items-center justify-center mx-auto text-[#7C3AED]">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
                No Articles Published Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                Our export analysts are currently preparing fresh seasonal harvest reports and market
                intelligence briefs. Check back soon!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={loadBlogs}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check for Updates</span>
              </button>
            </div>
          </div>
        ) : (
          /* Dynamic Blogs List */
          <div className="space-y-6 sm:space-y-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => handleCardClick(blog._id)}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-12 group cursor-pointer"
              >
                {/* Image Container - Strictly uniform height across all cards regardless of aspect ratio */}
                <div className="md:col-span-5 lg:col-span-4 relative h-60 sm:h-64 md:h-full min-h-[220px] overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={blog.image || defaultArticleImg}
                    alt={blog.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultArticleImg;
                    }}
                  />
                  <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C88A2C] block">
                      Market Brief
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl lg:text-[24px] font-bold text-[#1A221E] group-hover:text-[#8A5A1B] transition-colors leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {blog.description}
                    </p>
                  </div>

                  {/* Read Link */}
                  <div className="flex justify-end pt-2">
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-[#C88A2C] transition-colors inline-flex items-center gap-1.5">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 3. Pagination Controls (Sorted Latest First) */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5DCD1]">
            <p className="text-xs text-slate-500 font-medium">
              Showing page <strong className="text-slate-900">{currentPage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages}</strong> ({totalItems} total articles)
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 rounded-lg border border-[#D5CBC0] bg-white text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#0E2318] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 rounded-lg border border-[#D5CBC0] bg-white text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
