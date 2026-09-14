import React from 'react';
import {
  Tractor,
  Award,
  ThermometerSnowflake,
  Boxes,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: <Tractor className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Direct Farm Sourcing',
      description:
        'Direct procurement from verified farming clusters in Maharashtra, Gujarat, and South India, eliminating speculative middlemen markups and preserving peak harvest freshness.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Government Certified Quality',
      description:
        'Fully registered with APEDA, FSSAI certified, and every container dispatched with official Indian Government Phytosanitary health clearances.',
    },
    {
      icon: <ThermometerSnowflake className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Cold Chain Logistics',
      description:
        'Temperature-controlled reefer cargo and ventilated containers mapped from pre-cooling sheds directly to Colombo, Singapore, and Middle Eastern seaports.',
    },
    {
      icon: <Boxes className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Custom Packaging & MOQ',
      description:
        'Tailored packaging in breathable red mesh bags (10kg/25kg), export-grade corrugated boxes, or buyer-branded sacks compliant with import port regulations.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Flexible Packaging & MOQ',
      description:
        'We accommodate trial bookings of a single 20ft/40ft container as well as sustained multi-container monthly supply contracts for supermarket chains.',
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-[#C88A2C]" />,
      title: 'Reliable Documentation',
      description:
        'Flawless export paperwork: Bills of Lading, Certificate of Origin, SGS/Bureau Veritas inspection reports, and itemized manifests delivered on schedule.',
    },
  ];

  return (
    <section className="py-20 bg-[#E8DFD2] border-t border-[#D8CDBC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
            What Makes Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] font-serif">
            What makes us the right export Partner
          </h2>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#F4EEE5] border border-[#E5DCD1] rounded-2xl p-7 sm:p-8 space-y-4 hover:border-[#C88A2C]/60 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-full bg-[#EADECF] flex items-center justify-center group-hover:bg-[#E2D2BE] transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A221E] font-sans">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
