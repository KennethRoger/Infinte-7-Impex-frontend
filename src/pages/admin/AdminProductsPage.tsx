import React from 'react';
import { Package, Plus, RefreshCw, Image as ImageIcon } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-[#E5DCD1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#2563EB] border border-[#E5DCD1]">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Products Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage product listings, descriptions, packaging options, certifications, and up to 4 gallery images per product.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5DCD1] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-xl border border-[#E5DCD1] p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E7DFD3] flex items-center justify-center mx-auto text-slate-400">
          <Package className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-bold text-[#1A221E]">Products Section Ready</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This section will allow admins to create and edit export products, assign them to categories, configure packaging tags, and manage product photo galleries (max 4 images).
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" /> Max 4 Gallery Images
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#C88A2C]" /> Packaging &amp; Certifications
          </span>
        </div>
      </div>
    </div>
  );
};
