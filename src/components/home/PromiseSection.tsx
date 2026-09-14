import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from '../../context/RouterContext';

export const PromiseSection: React.FC = () => {
  const handleScrollToQuote = () => {
    const el = document.getElementById('get-quote');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Our Promise */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C]">
                Why Infinite 7 Impex
              </span>
              <Link
                href="/about"
                className="text-xs font-semibold text-slate-600 hover:text-[#C88A2C] inline-flex items-center gap-1 transition-colors"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] font-serif leading-[1.2]">
              Our promise to every buyer we serve
            </h2>

            <p className="text-base text-slate-600 leading-relaxed pt-1">
              Infinite 7 Impex was built on a simple belief — that fresh food produce deserves a direct
              journey, from the fertile agricultural heartlands of India straight to the wholesale port of
              destination. Whether it is Nashik Red Onions, Grade-A Green Chillies, or Regional Spices, our
              produce is hand-sorted, moisture-controlled, and packed to ensure zero quality degradation
              across ocean transit.
            </p>
          </div>

          {/* Right Column: Get to know us directly card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F4EEE5] border border-[#E5DCD1] rounded-2xl p-7 sm:p-8 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
                Get To Know Us Directly
              </span>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Spend a few minutes on the phone with our export desk to discuss seasonal sizing,
                container availability, and custom packaging. No automated bots — talk directly to the
                people handling your shipment.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleScrollToQuote}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 text-slate-900 font-semibold text-sm hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                >
                  <span>Ask Now</span>
                  <MessageSquare className="w-4 h-4 text-[#C88A2C]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
