import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { ProductApiService } from '../services/product.service';
import type { PopulatedProduct } from '../types/product';

// Fallback demo images for offline/legacy demo preview
import onionMainImg from '../assets/products/onion.avif';
import onion1Img from '../assets/products/onion-1.avif';
import onion2Img from '../assets/products/onion-2.avif';

interface ProductDetailPageProps {
  productId?: string;
  categorySlug?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId: propProductId,
  categorySlug: propCategorySlug,
}) => {
  const { navigate, currentPath } = useRouter();

  // Extract categorySlug and productId/slug from URL if not provided via props
  // Path patterns:
  // /products/:categorySlug/:productId
  // /product/:productId
  // /products/fresh-vegetables/onion
  const pathParts = currentPath.split('/').filter(Boolean);
  let resolvedCategorySlug = propCategorySlug || '';
  let resolvedProductId = propProductId || '';

  if (!resolvedProductId) {
    if (pathParts[0] === 'products' && pathParts.length >= 3) {
      resolvedCategorySlug = pathParts[1];
      resolvedProductId = pathParts[2];
    } else if (pathParts[0] === 'product' && pathParts.length >= 2) {
      resolvedProductId = pathParts[1];
    } else if (pathParts[0] === 'products' && pathParts.length === 2) {
      resolvedProductId = pathParts[1];
    }
  }

  const [product, setProduct] = useState<PopulatedProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Load product from backend
  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Check if it's MongoDB 24-hex ObjectId
    const isHexId = /^[0-9a-fA-F]{24}$/.test(resolvedProductId);

    if (isHexId) {
      try {
        const data = await ProductApiService.getById(resolvedProductId);
        setProduct(data);
        setActiveImageIndex(0);
        setIsLoading(false);
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Product not found';
        setError(msg);
      }
    }

    // If not a direct hex ID, or if getById failed, try searching public products by name or slug
    try {
      const allProducts = await ProductApiService.getAllPublic();
      const match = allProducts.find((p) => {
        const slug = p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        return slug === resolvedProductId.toLowerCase() || p._id === resolvedProductId;
      });

      if (match) {
        setProduct(match);
        setActiveImageIndex(0);
        setIsLoading(false);
        return;
      }
    } catch {
      // Ignore search error, fallback below
    }

    // Fallback for legacy demo routes (e.g. /products/fresh-vegetables/onion or /products/onion)
    if (
      resolvedProductId === 'onion' ||
      resolvedProductId === 'red-onion' ||
      currentPath.includes('onion')
    ) {
      setProduct({
        _id: 'demo-onion',
        name: 'Red Onion',
        description:
          "Onions are globally recognised for their pungency, long shelf life, and consistent sizing. Sourced directly from the Lasalgaon mandi — Asia's largest onion market — and graded through our FSSAI-certified facility in Nashik. Our sorting line processes 500 MT per day during peak season, enabling FCL orders with lead times as short as 72 hours.",
        images: [onionMainImg, onion1Img, onion2Img],
        category: {
          _id: 'demo-cat',
          name: 'Fresh Vegetables',
        },
        isRemoved: false,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setError('The requested product could not be found.');
  }, [resolvedProductId, currentPath]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Gallery images array
  const galleryImages = product?.images && product.images.length > 0
    ? product.images.map((src, idx) => ({
        src,
        alt: `${product.name} view ${idx + 1}`,
      }))
    : [{ src: onionMainImg, alt: 'Product Image' }];

  // Close lightbox on Escape key, Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, galleryImages.length]);

  const handleScrollToQuote = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const element = document.getElementById('get-quote');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Pre-fill product name into message textarea if present
        const textarea = document.querySelector<HTMLTextAreaElement>('#get-quote textarea');
        if (textarea && product) {
          textarea.value = `Hello Infinite 7 Impex, I am interested in importing ${product.name} (${product.category?.name || 'Produce'}). Please share CIF pricing, specifications, and availability.`;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }, 120);
  };

  const categoryPath = resolvedCategorySlug
    ? `/products/${resolvedCategorySlug}`
    : product?.category?.name
    ? `/products/${product.category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`
    : '/products';

  if (isLoading) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A859]" />
        <p className="text-sm font-medium text-slate-600">Loading product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[60vh] py-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5DCD1] p-8 text-center space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-serif text-[#1A221E]">Product Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {error || 'We could not find the export produce item you requested.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Categories</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <Link
            href="/products"
            className="text-slate-600 hover:text-[#C88A2C] transition-colors"
          >
            Products
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link
            href={categoryPath}
            className="text-slate-600 hover:text-[#C88A2C] transition-colors"
          >
            {product.category?.name || 'Category'}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#1A221E] font-bold">{product.name}</span>
        </nav>

        {/* 2. Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Main Featured Image Container */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-slate-100 border border-[#E5DCD1] shadow-sm cursor-zoom-in group select-none"
            >
              <img
                src={galleryImages[activeImageIndex]?.src}
                alt={galleryImages[activeImageIndex]?.alt || product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Enlarge Hint Badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-opacity opacity-80 group-hover:opacity-100 shadow-md">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Click to enlarge</span>
              </div>
            </div>

            {/* Thumbnails Row (Supports up to 4 images) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {galleryImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={`${img.src}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-[3px] border-[#00A859] shadow-md scale-100 ring-1 ring-[#00A859]/50'
                          : 'border border-[#D1C7BA] opacity-80 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* Header info with Category Name */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#C88A2C] block uppercase">
                {product.category?.name || 'Produce Category'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#1A221E] tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
              {product.description ||
                'Export-grade agricultural produce sourced directly from farmers, graded through certified sorting facilities, and processed according to strict phytosanitary guidelines.'}
            </p>

            {/* Packaging Options */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                PACKAGING OPTIONS
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                  Standard 25Kg Mesh Bag
                </span>
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                  50Kg Bulk Export Bag
                </span>
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                  Custom Palletized Containers
                </span>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                CERTIFICATIONS
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight uppercase">
                  APEDA CERTIFIED
                </span>
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight uppercase">
                  FSSAI APPROVED
                </span>
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight uppercase">
                  PHYTOSANITARY TESTED
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleScrollToQuote}
                className="inline-flex items-center gap-2 bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Enquire Price &amp; Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/export-process')}
                className="inline-flex items-center justify-center border-2 border-[#1A221E] bg-white hover:bg-[#1A221E] hover:text-white text-[#1A221E] font-semibold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-lg active:scale-[0.98] transition-all cursor-pointer"
              >
                How We Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lightbox Enlarge Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar Actions */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-20">
            <span className="text-white/70 text-xs sm:text-sm font-medium">
              {activeImageIndex + 1} / {galleryImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              aria-label="Close enlarged preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Previous image button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-4 sm:left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Enlarged Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImageIndex]?.src}
              alt={galleryImages[activeImageIndex]?.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Next image button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
              }}
              className="absolute right-4 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
