import React from 'react';
import { useRouter } from '../context/RouterContext';

// Country flag assets
import sriLankaFlag from '../assets/countries/sri-lanka-flag.png';
import singaporeFlag from '../assets/countries/singapore-flag.png';
import uaeFlag from '../assets/countries/UAE-flag.png';
import saudiFlag from '../assets/countries/saudi-arabia-flag.png';
import qatarFlag from '../assets/countries/qatar-flag.png';
import kuwaitFlag from '../assets/countries/kuwait-flag.png';

interface CountryMarket {
  name: string;
  flag: string;
  code: string;
}

export const CountriesPage: React.FC = () => {
  const { navigate } = useRouter();

  const countries: CountryMarket[] = [
    { name: 'Sri Lanka', flag: sriLankaFlag, code: 'LK' },
    { name: 'Singapore', flag: singaporeFlag, code: 'SG' },
    { name: 'UAE', flag: uaeFlag, code: 'AE' },
    { name: 'Saudi Arabia', flag: saudiFlag, code: 'SA' },
    { name: 'Qatar', flag: qatarFlag, code: 'QA' },
    { name: 'Kuwait', flag: kuwaitFlag, code: 'KW' },
  ];

  const handleEnquire = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const el = document.getElementById('get-quote');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="w-full bg-[#FAF7F2]">
      {/* 1. Page Hero Header */}
      <section className="bg-[#0E2318] text-white py-16 sm:py-20 lg:py-24 border-b border-[#1C422D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22C55E] block">
            GLOBAL REACH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Our Export Markets
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl pt-1 leading-relaxed font-normal">
            From Indian farms to international markets — we currently export to Sri Lanka, Singapore,
            and the Middle East, with more markets on the horizon
          </p>
        </div>
      </section>

      {/* 2. Countries Flag Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {countries.map((country) => (
            <div key={country.name} className="flex flex-col space-y-3 group">
              <div className="aspect-[3/2] w-full overflow-hidden rounded-xl border border-[#E5DCD1] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-md group-hover:border-[#C88A2C]/50 transition-all duration-300">
                <img
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1A221E] font-sans">
                {country.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bottom CTA Section */}
      <section className="bg-[#E8DFD2] py-20 border-t border-[#D8CDBC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold font-serif text-[#1A221E] leading-tight">
            Don't see your country listed?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            We regularly evaluate new markets. Send us an enquiry with your country and product
            requirements — we'll assess feasibility within 48 hours.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleEnquire}
              className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-md transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              Enquire For your Country
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
