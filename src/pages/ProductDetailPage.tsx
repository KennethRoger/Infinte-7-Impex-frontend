import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';

// Product images
import onionMainImg from '../assets/products/onion.avif';
import onion1Img from '../assets/products/onion-1.avif';
import onion2Img from '../assets/products/onion-2.avif';

export const ProductDetailPage: React.FC = () => {
  const { navigate } = useRouter();

  // Gallery images (supports up to 4 images)
  const galleryImages = [
    { src: onionMainImg, alt: 'Export quality Indian red onions in packing crate' },
    { src: onion1Img, alt: 'Close-up fresh whole red onions with vibrant purple skin' },
    { src: onion2Img, alt: 'Red onions displayed in traditional woven wooden bowl' },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox on Escape key
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
      }
    }, 100);
  };

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
            href="/products/fresh-vegetables"
            className="text-slate-600 hover:text-[#C88A2C] transition-colors"
          >
            Fresh Vegetables
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#1A221E] font-bold">Onion</span>
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
                src={galleryImages[activeImageIndex].src}
                alt={galleryImages[activeImageIndex].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Enlarge Hint Badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-opacity opacity-80 group-hover:opacity-100 shadow-md">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Click to enlarge</span>
              </div>
            </div>

            {/* Thumbnails Row (Supports up to 4 images) */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {galleryImages.map((img, idx) => {
                const isActive = idx === activeImageIndex;
                return (
                  <button
                    key={img.src}
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
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* Header info */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#C88A2C] block">
                Fresh Vegetables
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#1A221E] tracking-tight leading-tight">
                Onion
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Onions are globally recognised for their pungency, long shelf life, and consistent sizing.
              Sourced directly from the Lasalgaon mandi — Asia's largest onion market — and graded
              through our FSSAI-certified facility in Nashik. Our sorting line processes 500 MT per
              day during peak season, enabling FCL orders with lead times as short as 72 hours.
            </p>

            {/* Packaging Options */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                PACKAGING OPTIONS
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                  25Kg Mesh Bag
                </span>
                <span className="inline-block bg-[#ECE6DC]/60 border border-[#D5CBC0] px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                  50Kg Bulk Bag
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

          {/* Enlarged Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImageIndex].src}
              alt={galleryImages[activeImageIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Next image button */}
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
        </div>
      )}
    </div>
  );
};
