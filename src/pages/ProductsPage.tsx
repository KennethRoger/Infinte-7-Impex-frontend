import React, { useState, useEffect } from 'react';
import { ArrowRight, PackageOpen, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { CategoryApiService } from '../services/category.service';
import { useToast } from '../context/ToastContext';
import type { ProductCategory } from '../types/category';

// Default fallback image for categories without custom banner
import defaultProduceImg from '../assets/products/fresh-vegetables.jpg';

export const ProductsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { showError } = useToast();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await CategoryApiService.getAllPublic();
      // Filter out any soft-deleted categories
      const active = data.filter((c) => !c.isRemoved);
      setCategories(active);
    } catch (err: unknown) {
      const readableError =
        err instanceof Error
          ? err.message
          : 'Unable to load product categories. Please verify your connection.';
      setErrorMessage(readableError);
      showError(readableError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleBrowseCategory = (category: ProductCategory) => {
    const slug = category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    navigate(`/products/${slug}`);
  };

  return (
    <div className="w-full bg-[#FAF7F2]">
      {/* 1. Hero Header */}
      <section className="bg-[#0E2318] text-white py-16 sm:py-20 lg:py-24 border-b border-[#1C422D] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2318] via-[#0E2318]/90 to-transparent z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22C55E] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Product Catalogue</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Export Grade Products
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            Direct farm-sourced agricultural consignments meeting APEDA, phytosanitary, and global
            import food safety specifications.
          </p>
        </div>
      </section>

      {/* 2. Category Showcase Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={fetchCategories}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/60 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-xs flex flex-col animate-pulse"
              >
                <div className="w-full h-64 bg-slate-200" />
                <div className="p-7 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-md w-full" />
                    <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                  </div>
                  <div className="h-10 bg-slate-200 rounded-lg w-40 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 && !errorMessage ? (
          /* Empty Fallback State */
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E5DCD1] p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DCD1] flex items-center justify-center mx-auto text-[#C88A2C]">
              <PackageOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
                Catalogue Updating
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                Our export produce catalogue is currently being populated with fresh seasonal harvest
                consignments. Please submit a buyer inquiry or contact our trade desk directly.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#get-quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-all"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={fetchCategories}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check for Updates</span>
              </button>
            </div>
          </div>
        ) : (
          /* Dynamic Categories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image Banner */}
                <div className="w-full aspect-[4/3] sm:h-64 lg:h-72 overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image || defaultProduceImg}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if URL fails to load
                      (e.target as HTMLImageElement).src = defaultProduceImg;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Container */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-2.5">
                    <h2 className="text-2xl sm:text-[26px] font-bold font-serif text-[#1A221E] leading-snug group-hover:text-[#8A5A1B] transition-colors">
                      {cat.name}
                    </h2>
                    {/* Category Description from model */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {cat.description ||
                        'Export-grade agricultural produce directly sourced and processed according to strict quality guidelines.'}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleBrowseCategory(cat)}
                      className="inline-flex items-center gap-2.5 bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm group-hover:shadow group/btn w-fit active:scale-95 cursor-pointer"
                    >
                      <span>Browse {cat.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
