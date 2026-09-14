import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'card';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  const isLight = variant === 'light';
  const isCard = variant === 'card';

  const logoIcon = (
    <svg
      viewBox="0 0 100 48"
      className={
        size === 'sm'
          ? 'w-10 h-6'
          : size === 'lg'
          ? 'w-16 h-10'
          : 'w-12 h-7'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized elegant golden infinity 7 emblem */}
      <path
        d="M26 12C18 12 12 17 12 24C12 31 18 36 26 36C35 36 43 27 50 24C43 21 35 12 26 12Z"
        stroke="#C88A2C"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M74 12C82 12 88 17 88 24C88 31 82 36 74 36C65 36 57 27 50 24C57 21 65 12 74 12Z"
        stroke="#C88A2C"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Central numeral 7 glyph */}
      <path
        d="M45 18H55L48 31"
        stroke="#C88A2C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center dot / leaf */}
      <circle cx="50" cy="24" r="2" fill="#214732" />
    </svg>
  );

  if (isCard) {
    return (
      <div className={`bg-white rounded-lg p-2.5 inline-flex items-center gap-2.5 shadow-sm border border-slate-100 ${className}`}>
        {logoIcon}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
            Infinite 7 <span className="text-[#C88A2C]">Impex</span>
          </span>
          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-semibold">
            Global Trade
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      {logoIcon}
      <div className="flex flex-col text-left">
        <span
          className={`font-bold tracking-tight leading-tight ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
          } ${isLight ? 'text-white' : 'text-slate-900'}`}
        >
          Infinite 7 <span className="text-[#C88A2C]">Impex</span>
        </span>
        <span
          className={`text-[9px] uppercase tracking-widest font-semibold ${
            isLight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Agri Export Specialist
        </span>
      </div>
    </div>
  );
};
