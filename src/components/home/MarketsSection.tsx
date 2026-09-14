import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CountryMarket {
  name: string;
  flag: string;
  port: string;
}

export const MarketsSection: React.FC = () => {
  const markets: CountryMarket[] = [
    { name: 'Sri Lanka', flag: '🇱🇰', port: 'Port of Colombo' },
    { name: 'Singapore', flag: '🇸🇬', port: 'Jurong Port / PSA' },
    { name: 'United Arab Emirates', flag: '🇦🇪', port: 'Jebel Ali / Dubai' },
    { name: 'Malaysia', flag: '🇲🇾', port: 'Port Klang' },
    { name: 'Maldives', flag: '🇲🇻', port: 'Male Port' },
    { name: 'Qatar', flag: '🇶🇦', port: 'Hamad Port' },
  ];

  return (
    <section id="countries" className="py-20 bg-[#FAF7F2] border-t border-[#EAE2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
              Countries We Export To
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] font-serif">
              Global markets. 1 reliable supplier.
            </h2>
          </div>

          <a
            href="#countries"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#C88A2C] transition-colors shrink-0"
          >
            <span>View All Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Markets Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {markets.map((market) => (
            <div
              key={market.name}
              className="bg-white border border-[#E5DCD1] rounded-xl p-4 sm:p-5 flex flex-col items-center text-center space-y-2 shadow-sm hover:border-[#C88A2C] hover:shadow-md transition-all duration-200 group cursor-default"
            >
              <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {market.flag}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#1A221E] group-hover:text-[#C88A2C] transition-colors leading-tight">
                {market.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {market.port}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
