import React from 'react';
import { Users, Filter, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-[#E5DCD1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#00A859] border border-[#E5DCD1]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
              Customer Inquiries
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            View, filter, and respond to export quotes and contact inquiries submitted by overseas buyers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5DCD1] text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Placeholder table / empty state */}
      <div className="bg-white rounded-xl border border-[#E5DCD1] p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E7DFD3] flex items-center justify-center mx-auto text-slate-400">
          <Users className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-bold text-[#1A221E]">Customers Section Ready</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This section will display live customer inquiries from the website quotation form with full contact details, requested products, and status toggles.
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#C88A2C]" /> Email Contacts
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#22C55E]" /> Direct Calling
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Inquiry Timestamps
          </span>
        </div>
      </div>
    </div>
  );
};
