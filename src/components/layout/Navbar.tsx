import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-tight">
              Infinite 7 <span className="text-emerald-400 font-extrabold">Impex</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-medium">
              Global Export Partner
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#overview" className="hover:text-emerald-400 transition-colors">
            Overview
          </a>
          <a href="#commodities" className="hover:text-emerald-400 transition-colors">
            Commodities
          </a>
          <a href="#categories" className="hover:text-emerald-400 transition-colors">
            Categories
          </a>
          <a href="#blogs" className="hover:text-emerald-400 transition-colors">
            Export Insights
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Submit Enquiry
          </Button>
        </div>
      </div>
    </header>
  );
};
