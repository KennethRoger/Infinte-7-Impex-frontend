import React from 'react';

interface ProcessStep {
  number: string;
  title: string;
}

export const ExportProcessSection: React.FC = () => {
  const steps: ProcessStep[] = [
    { number: '01', title: 'Sourcing' },
    { number: '02', title: 'Grading' },
    { number: '03', title: 'Packaging' },
    { number: '04', title: 'Documentation' },
    { number: '05', title: 'Logistics' },
    { number: '06', title: 'Delivery' },
  ];

  return (
    <section id="process" className="py-24 bg-[#153323] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header with Title and Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#72C097] block">
              The Export Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white font-serif">
              Farm to port, end to end
            </h2>
          </div>

          <a
            href="#process"
            className="inline-flex items-center justify-center border border-white/80 hover:bg-white/10 text-white px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            See Full Process
          </a>
        </div>

        {/* Stepper Timeline Container */}
        <div className="relative pt-6 pb-2">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] bg-[#2E5C43] z-0" />

          {/* Steps Grid / Horizontal Scroll for Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-4 relative z-10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center space-y-3.5 group"
              >
                {/* Number Badge */}
                <div className="w-14 h-12 bg-[#C88A2C] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md group-hover:bg-[#D4902A] group-hover:scale-105 transition-all">
                  {step.number}
                </div>

                {/* Step Title */}
                <span className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
