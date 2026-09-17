import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, PackageOpen, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { ProductApiService } from '../services/product.service';
import { CategoryApiService } from '../services/category.service';
import { useToast } from '../context/ToastContext';
import type { PopulatedProduct } from '../types/product';
import type { ProductCategory } from '../types/category';

// Fallback image for products without custom imagery
import defaultProduceImg from '../assets/products/fresh-vegetables.jpg';

interface CategoryProductsPageProps {
  categorySlug?: string;
}

export const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({ categorySlug }) => {
  const { navigate, currentPath } = useRouter();
  const { showError } = useToast();

  // Extract slug from props or pathname
  const activeSlug =
    categorySlug ||
    currentPath.replace(/^\/products\/?/, '').split('/')[0] ||
    '';

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [products, setProducts] = useState<PopulatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategoryAndProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Fetch all active categories to find the matching one
      const allCategories = await CategoryApiService.getAllPublic();
      const activeCategories = allCategories.filter((c) => !c.isRemoved);

      // Match by slug or _id
      const matchedCategory = activeCategories.find((c) => {
        const slug = c.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        return slug === activeSlug || c._id === activeSlug;
      });

      if (!matchedCategory) {
        // If not found by slug/id, fallback to first category or show not found
        if (activeCategories.length > 0) {
          setCategory(activeCategories[0]);
          const prods = await ProductApiService.getAllPublic({ category: activeCategories[0]._id });
          setProducts(prods.filter((p) => !p.isRemoved));
        } else {
          setCategory(null);
          setProducts([]);
        }
        return;
      }

      setCategory(matchedCategory);

      // 2. Fetch products belonging to this category
      const prods = await ProductApiService.getAllPublic({ category: matchedCategory._id });
      setProducts(prods.filter((p) => !p.isRemoved));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load products for this category. Please verify your connection.';
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeSlug, showError]);

  useEffect(() => {
    loadCategoryAndProducts();
  }, [loadCategoryAndProducts]);

  const handleProductClick = (product: PopulatedProduct) => {
    const slug = category
      ? category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : activeSlug;
    navigate(`/products/${slug}/${product._id}`);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      {/* 1. Dark Emerald Hero Header */}
      <section className="bg-[#0E2318] text-white py-14 sm:py-18 lg:py-20 border-b border-[#1C422D] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2318] via-[#0E2318]/90 to-transparent z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Back link */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#22C55E] hover:text-[#4ADE80] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>ALL CATEGORIES</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22C55E] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Export Produce Category</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
              {category?.name || (isLoading ? 'Loading Produce...' : 'Produce Catalogue')}
            </h1>
          </div>

          {/* Subtitle / Category Description */}
          <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl leading-relaxed font-normal">
            {category?.description ||
              "Export-grade agricultural produce sourced directly from India's prime farming belts. Rigorous phytosanitary compliance, APEDA certified, and flexible export packaging."}
          </p>
        </div>
      </section>

      {/* 2. Product Showcase Cards Grid */}
      <section className="py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={loadCategoryAndProducts}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/60 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-xs flex flex-col animate-pulse"
              >
                <div className="w-full h-64 sm:h-72 lg:h-80 bg-slate-200" />
                <div className="p-7 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-32 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 && !errorMessage ? (
          /* Empty Fallback State */
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E5DCD1] p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DCD1] flex items-center justify-center mx-auto text-[#C88A2C]">
              <PackageOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
                No Products Listed Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                {category?.name
                  ? `Our export consignments for ${category.name} are currently being organized. You can submit a custom buyer enquiry below.`
                  : 'No produce items are listed in this category right now. Contact our trade desk for custom sourcing.'}
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
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#D5CBC0] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <span>Back to All Categories</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {products.map((product) => {
              const coverImg = product.images?.[0] || defaultProduceImg;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Product Image */}
                  <div className="w-full h-64 sm:h-72 lg:h-80 overflow-hidden bg-slate-100 relative">
                    <img
                      src={coverImg}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultProduceImg;
                      }}
                    />
                    {product.images && product.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {product.images.length} photos
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-5 bg-white">
                    <div className="space-y-3">
                      {/* Prominent Category Name Badge */}
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C88A2C]">
                        {product.category?.name || category?.name || 'Produce'}
                      </span>

                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A221E] leading-snug group-hover:text-[#8A5A1B] transition-colors">
                        {product.name}
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {product.description ||
                          'Export-grade produce rigorously inspected, graded, and packed for international shipping.'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleProductClick(product)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A221E] group/btn hover:text-[#C88A2C] transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
