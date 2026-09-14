import React from 'react';
import redOnionImg from '../../assets/red_onion_product.jpg';
import greenChilliImg from '../../assets/green_chilli_product.jpg';
import { ArrowRight } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const products = [
    {
      name: 'Red Onion',
      tag: 'MOST POPULAR',
      image: redOnionImg,
      description:
        'Grade A export red onion sourced directly from Nashik, Maharashtra. Cured, moisture-tested, and mesh-bag packed for extended ocean shelf life.',
      detailsLink: '#products',
    },
    {
      name: 'Green Chilli',
      tag: 'HIGH DEMAND',
      image: greenChilliImg,
      description:
        'Fresh, sharp Indian green chillies from certified growers. Carefully hand-picked, pre-cooled, and packed in ventilated corrugated cartons for reefer shipping.',
      detailsLink: '#products',
    },
  ];

  return (
    <section id="products" className="py-20 bg-[#FAF7F2] border-t border-[#EAE2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
              Our Products
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] font-serif">
              Export-grade produce, direct from the sources.
            </h2>
          </div>

          <a
            href="#products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#C88A2C] transition-colors shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2 Featured Products Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#C88A2C] bg-[#FAF3E8] px-2.5 py-1 rounded">
                    {product.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1A221E] font-serif">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={product.detailsLink}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#C88A2C] transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 text-[#C88A2C]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
