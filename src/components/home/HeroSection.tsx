import React from 'react';
import heroProduceBg from '../../assets/hero_produce_bg.jpg';
import redOnionImg from '../../assets/red_onion_product.jpg';
import greenChilliImg from '../../assets/green_chilli_product.jpg';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[640px] lg:min-h-[700px] flex items-center bg-[#0E2318] text-white overflow-hidden"
    >
      {/* Background Image with 100% to 0% Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroProduceBg}
          alt="Indian Agricultural Export Warehouse"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0E2318 0%, #0E2318 30%, rgba(14, 35, 24, 0) 100%)',
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-emerald-900/50 text-emerald-300 border border-emerald-600/40 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                APEDA & RCMC Registered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-emerald-900/50 text-emerald-300 border border-emerald-600/40 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                FSSAI Licensed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-emerald-900/50 text-emerald-300 border border-emerald-600/40 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ISO/IEC 17025 Tested
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Infinite Possibilities,{' '}
              <span className="text-[#D4902A] block sm:inline font-serif font-bold">
                Global Reach
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Serving Wholesale Buyers Across Sri Lanka, Singapore, And The Middle East With Quality-Graded, Hygienically Packed Produce.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleScrollTo('get-quote')}
                className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-md transition-all shadow-md shadow-amber-950/40 cursor-pointer active:scale-95"
              >
                Get a Quote
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo('products')}
                className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-md border border-white/80 transition-all cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          </div>

          {/* Right Column: In-Demand Produce Preview Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/25 shadow-2xl space-y-3.5 group hover:border-[#C88A2C]/60 transition-all duration-300"
              style={{
                WebkitBackdropFilter: 'blur(12px)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Dual image preview */}
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden h-44 sm:h-48 relative">
                <img
                  src={redOnionImg}
                  alt="Export Red Onions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <img
                  src={greenChilliImg}
                  alt="Fresh Green Chillies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider text-amber-300 px-2.5 py-1 rounded">
                  In-Demand Export Line
                </span>
              </div>

              {/* Card caption */}
              <div className="px-1 pt-1 pb-2">
                <p className="text-xs sm:text-sm text-white leading-snug font-medium drop-shadow-xs">
                  Export-grade red onions &amp; fresh green chillies available now for bulk container bookings.
                </p>
                <div
                  onClick={() => handleScrollTo('products')}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold hover:text-white cursor-pointer transition-colors"
                >
                  <span>Explore produce lines</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
