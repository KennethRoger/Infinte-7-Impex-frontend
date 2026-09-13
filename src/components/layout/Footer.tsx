import React from 'react';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Infinite 7 <span className="text-emerald-400">Impex</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Leading global supplier and exporter of export-grade agricultural commodities,
              red onions, spices, and fresh produce connecting Indian origins with global markets.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#commodities" className="hover:text-emerald-400 transition-colors">
                  Export Commodities
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-emerald-400 transition-colors">
                  Product Categories
                </a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-emerald-400 transition-colors">
                  Trade &amp; Logistics Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@infinite7impex.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>India / Sri Lanka Trade Corridors</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Infinite 7 Impex. All rights reserved.</p>
          <p>Built with React, TypeScript, Tailwind CSS v4 &amp; Zod.</p>
        </div>
      </div>
    </footer>
  );
};
