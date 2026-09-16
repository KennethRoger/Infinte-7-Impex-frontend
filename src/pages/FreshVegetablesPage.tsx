import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';

// Product images
import onionImg from '../assets/products/onion.avif';
import greenChilliImg from '../assets/products/green-chilli.avif';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  imageAlt: string;
  description: string;
  slug: string;
}

export const FreshVegetablesPage: React.FC = () => {
  const { navigate } = useRouter();

  const products: ProductItem[] = [
    {
      id: '1',
      name: 'Red Onion',
      category: 'VEGETABLES',
      image: onionImg,
      imageAlt: 'Export quality Indian red onions packed fresh from Lasalgaon',
      description:
        'Red onions are globally recognised for their pungency, long shelf life, and consistent sizing. Sourced directly from the Lasalgaon mandi...',
      slug: 'red-onion',
    },
    {
      id: '2',
      name: 'Green Chilli',
      category: 'VEGETABLES',
      image: greenChilliImg,
      imageAlt: 'Fresh vivid green chillies sourced from Andhra Pradesh and Telangana',
      description:
        "Our green chillies are sourced from Andhra Pradesh and Telangana, India's largest chilli-growing belt. Known for vivid green colour, firm texture, and...",
      slug: 'green-chilli',
    },
  ];

  const handleScrollToQuote = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const element = document.getElementById('get-quote');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleProductClick = (slug: string) => {
    if (slug === 'red-onion' || slug === 'onion') {
      navigate('/products/fresh-vegetables/onion');
    } else {
      handleScrollToQuote();
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      {/* 1. Dark Emerald Hero Header */}
      <section className="bg-[#0E2318] text-white py-14 sm:py-18 lg:py-20 border-b border-[#1C422D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Back link */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#22C55E] hover:text-[#4ADE80] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>ALL PRODUCTS</span>
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Fresh Vegetables
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl leading-relaxed font-normal">
            Export-grade fresh vegetables sourced from India's most productive agricultural regions.
            APEDA certified, pesticide-residue tested, flexible MOQ.
          </p>
        </div>
      </section>

      {/* 2. Product Showcase Cards Grid */}
      <section className="py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="w-full h-64 sm:h-72 lg:h-80 overflow-hidden bg-slate-100 relative">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-5 bg-white">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2C] block">
                    {product.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A221E] leading-snug">
                    {product.name}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleProductClick(product.slug)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A221E] group/btn hover:text-[#C88A2C] transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
