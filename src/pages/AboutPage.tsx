import React from 'react';
import { Award } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

// About page assets
import onionFounderImg from '../assets/about/onion-founder.jpg';
// import teamImg from '../assets/about/team.jpg';
// import farmImg from '../assets/about/farm.jpg';
// import packagingImg from '../assets/about/packaging.jpg';
// import harvestImg from '../assets/about/harvest.jpg';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  const handleGetQuote = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const el = document.getElementById('get-quote');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const certifications = [
    {
      title: 'FSSAI',
      description:
        'Food Safety & Standards Authority Of India — Our Processing And Grading Facility Is Licensed For Food-Grade Handling And Export.',
    },
    {
      title: 'APEDA',
      description:
        'Agricultural & Processed Food Products Export Development Authority — Authorises Us To Export Scheduled Agricultural Commodities.',
    },
    {
      title: 'APEDA',
      description:
        'All Shipments Are Tested For Pesticide Residue By ISO/IEC 17025 Accredited Laboratories, Ensuring Internationally Recognised Accuracy And Reliability In Every Result.',
    },
  ];

  /*
  const galleryImages = [
    { src: teamImg, alt: 'Infinite 7 Impex core operational and logistics team' },
    { src: farmImg, alt: 'Partner farmer in Maharashtra harvest fields' },
    { src: packagingImg, alt: 'Standardized export carton packaging and sealing' },
    { src: harvestImg, alt: 'Direct farm fresh produce sorted for export' },
  ];
  */

  return (
    <div className="w-full bg-[#FAF7F2]">
      {/* 1. Hero Header */}
      <section className="bg-[#0E2318] text-white py-16 sm:py-20 lg:py-24 border-b border-[#1C422D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22C55E] block">
            OUR STORY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            About Infinite 7 Impex
          </h1>
          <p className="text-[#8ED4AB] text-sm sm:text-base max-w-2xl pt-1 leading-relaxed font-normal">
            we started with one product, one buyer, and an uncompromising commitment to quality.
          </p>
        </div>
      </section>

      {/* 2. Origin & Founder Story */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
                OUR STORY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#1A221E] leading-[1.2]">
                Built on onions, grown on trust.
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <p>
                Infinite 7 Impex Was Founded In 2009 By Mr. Kishan Patil In Nashik — Then A Small
                Trader Supplying Onions To A Single Importer In Colombo, Sri Lanka. The Name Came From
                A Belief: That Infinite Possibilities Lie In The Simple Act Of Connecting A Farmer To A
                Buyer, Seven Seas Apart.
              </p>
              <p>
                Our First Shipment Was 18 MT Of Nashik Red Onions. It Arrived 3 Days Late And 2°C Warmer
                Than Specified. That Experience Drove The Investment In Cold Chain Infrastructure That
                Now Defines Our Operation. Today, We Export Six Product Categories To 13 Countries,
                With An Annual Volume Exceeding 50,000 MT. Our Facility In Lasalgaon Processes 500 MT
                Per Day During Peak Season.
              </p>
              <p>
                We Remain Privately Held, Operationally Focused, And Structurally Simple: Direct Farm
                Relationships, Rigorous Grading, And A Single Account Manager For Every Buyer.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <img
                src={onionFounderImg}
                alt="Founder measuring and inspecting onions at Nashik market"
                className="w-full h-full object-cover min-h-[320px] sm:min-h-[380px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-[#E8DFD2] py-16 sm:py-20 border-t border-[#D8CDBC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Mission */}
            <div className="border-l-4 border-[#C88A2C] pl-6 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A221E]">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                To be the most reliable supply chain partner for international buyers of Indian
                agri-produce — delivering consistent quality, transparent documentation, and
                accountable service on every shipment.
              </p>
            </div>

            {/* Vision */}
            <div className="border-l-4 border-[#C88A2C] lg:border-l lg:border-l-slate-400 lg:pl-10 pl-6 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A221E]">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                To expand India's agri-export footprint by making it easier, safer, and more
                predictable for global buyers to source directly from Indian farms, eliminating the
                uncertainty that has historically made agri-import difficult.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Certifications At Every Level */}
      <section className="py-20 bg-[#FAF7F2] border-t border-[#EAE2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-center text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#1A221E]">
            Certifications at every level.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-[#E5DCD1] shadow-sm hover:border-[#C88A2C]/60 hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3E8] flex items-center justify-center text-[#C88A2C]">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A221E] font-sans tracking-wide">
                    {cert.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team & Operations Gallery - commented out for now since we don't have the images yet*/}
      {/* <section className="py-16 sm:py-24 bg-[#E8DFD2] border-t border-[#D8CDBC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
              GALLERY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#1A221E]">
              Our Team &amp; Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square w-full rounded-2xl overflow-hidden border border-[#E5DCD1] bg-slate-100 shadow-sm group hover:shadow-md transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 6. Bottom CTA: Partner with us */}
      <section className="bg-[#0E2318] py-20 text-white border-t border-[#1C422D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-white leading-tight">
            Partner with us.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal pt-1">
            Whether you are a first-time importer or an established distributor looking for a more
            reliable Indian supplier — we are ready to start the conversation.
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
