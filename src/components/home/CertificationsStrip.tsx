import React from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle } from 'lucide-react';

export const CertificationsStrip: React.FC = () => {
  return (
    <div className="w-full bg-[#EDE4D8] border-y border-[#DFD3C3] py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs font-bold tracking-widest text-[#5C4A32] uppercase">
        <div className="flex items-center gap-1.5 text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#C88A2C]" />
          <span>Certified &amp; Compliant</span>
        </div>

        <span className="text-[#C88A2C] hidden sm:inline">✦</span>

        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#C88A2C]" />
          <span>APEDA &amp; RCMC Registered</span>
        </div>

        <span className="text-[#C88A2C] hidden sm:inline">✦</span>

        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-[#C88A2C]" />
          <span>FSSAI Licensed</span>
        </div>

        <span className="text-[#C88A2C] hidden sm:inline">✦</span>

        <div className="flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-[#C88A2C]" />
          <span>ISO/IEC 17025 Tested</span>
        </div>
      </div>
    </div>
  );
};
