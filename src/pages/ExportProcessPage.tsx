import React from 'react';
import { useRouter } from '../context/RouterContext';

// Step assets
import farmImg from '../assets/process/farm.avif';
import vegetablesImg from '../assets/process/vegetables.avif';
import packagingImg from '../assets/process/packaging.avif';
import documentingImg from '../assets/process/documenting.avif';
import logisticsImg from '../assets/process/logistics.avif';
import shipImg from '../assets/process/ship-delivery.jpg';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLeftOnDesktop: boolean;
}

export const ExportProcessPage: React.FC = () => {
  const { navigate } = useRouter();

  const steps: ProcessStep[] = [
    {
      step: '01',
      title: 'Direct Farm Sourcing',
      description:
        'We maintain year-round relationships with 200+ registered farms across Maharashtra, Gujarat, and Andhra Pradesh. Each farm is vetted annually for pesticide compliance, irrigation practices, and soil-to-growth tracking. Pricing negotiated directly — no aggregators.',
      image: farmImg,
      imageAlt: 'Direct farm sourcing in Indian grower fields',
      imageLeftOnDesktop: true,
    },
    {
      step: '02',
      title: 'Quality Grading & Sorting',
      description:
        'All produce passes through our FSSAI-certified grading facility in Nashik. Grading covers: size uniformity, colour inspection, moisture content (vital to prevent rot during transit), and Brix levels for fruits. Only Grade A and above is accepted for export.',
      image: vegetablesImg,
      imageAlt: 'Produce inspection, sorting, and grading at certified facility',
      imageLeftOnDesktop: false,
    },
    {
      step: '03',
      title: 'Packaging & Pre-cooling',
      description:
        'Produce is packed to buyer specifications — 5 kg cartons to 50 kg bulk bags. Temperature-sensitive items (green chilli, pomegranate) are pre-cooled to target temperatures within 4 hours of grading. Cold chain is maintained from this point through to destination port.',
      image: packagingImg,
      imageAlt: 'Packaging on automated conveyors and cold-room pre-cooling',
      imageLeftOnDesktop: true,
    },
    {
      step: '04',
      title: 'Export Documentation',
      description:
        'Our compliance team manages the full document stack: Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin (APEDA), Phytosanitary Certificate, FSSAI NOC, Form E, and COO. First-time importers receive a complete destination-specific checklist.',
      image: documentingImg,
      imageAlt: 'Export compliance, phytosanitary clearance, and shipping documentation',
      imageLeftOnDesktop: false,
    },
    {
      step: '05',
      title: 'Freight & Logistics',
      description:
        'Regular sailings from JNPT (Mumbai), Mundra, and Chennai. FCL and LCL for sea freight; airfreight on request for perishables. Reefer containers for all cold-chain produce with real-time temperature logging. Container tracking shared with buyers.',
      image: logisticsImg,
      imageAlt: 'Container gantry cranes and sea freight logistics',
      imageLeftOnDesktop: true,
    },
    {
      step: '06',
      title: 'Destination Delivery',
      description:
        'We partner with clearing agents in major destination ports — Colombo, Singapore, Dubai, Jebel Ali, Dammam, and Port Rashid. Port-to-door coordination available. Your account manager stays on call through final delivery and follow-up for quality confirmation.',
      image: shipImg,
      imageAlt: 'Container cargo vessel navigating to international port',
      imageLeftOnDesktop: false,
    },
  ];

  const handleGetQuote = () => {
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
            HOW WE WORK
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            The Export Process
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl pt-1 leading-relaxed font-normal">
            Six steps. Zero ambiguity. Every shipment follows the same rigorous process — from farm
            selection to your port.
          </p>
        </div>
      </section>

      {/* 2. 6 Alternating Steps Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-12">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-[#F8F4EE] border border-[#E5DCD1] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Image Column */}
                <div
                  className={`order-1 ${
                    item.imageLeftOnDesktop
                      ? 'lg:order-1 lg:col-span-6'
                      : 'lg:order-2 lg:col-span-6'
                  } relative overflow-hidden bg-slate-100 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]`}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                </div>

                {/* Content Column */}
                <div
                  className={`order-2 ${
                    item.imageLeftOnDesktop
                      ? 'lg:order-2 lg:col-span-6'
                      : 'lg:order-1 lg:col-span-6'
                  } p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center space-y-4`}
                >
                  {/* Step Number Badge */}
                  <div>
                    <span className="inline-block bg-[#C88A2C] text-white font-bold text-xs sm:text-sm px-3 py-1 rounded">
                      {item.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold font-serif text-[#1A221E] leading-snug">
                    {item.title}
                  </h2>

                  {/* Step Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bottom CTA Section */}
      <section className="bg-[#E8DFD2] py-20 border-t border-[#D8CDBC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold font-serif text-[#1A221E] leading-tight">
            Ready to start your first shipment?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Our export team will walk you through documentation requirements and logistics options for
            your destination country.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGetQuote}
              className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-md transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
