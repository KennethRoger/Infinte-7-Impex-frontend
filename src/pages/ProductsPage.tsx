import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

// Product category assets
import freshVegImg from '../assets/products/fresh-vegetables.jpg';
import condimentsImg from '../assets/products/condiments.avif';
import packedFoodImg from '../assets/products/packed-food.avif';

interface ProductCategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
  buttonText: string;
}

export const ProductsPage: React.FC = () => {
  const { navigate } = useRouter();

  const categories: ProductCategoryItem[] = [
    {
      id: '1',
      name: 'Fresh Vegetables',
      slug: 'fresh-vegetables',
      image: freshVegImg,
      imageAlt: 'Fresh export-grade Indian vegetables: tomatoes, onions, chillies, cucumbers',
      buttonText: 'Browse Fresh Vegetables',
    },
    {
      id: '2',
      name: 'Condiments',
      slug: 'condiments',
      image: condimentsImg,
      imageAlt: 'Authentic Indian whole spices and ground condiments in traditional displays',
      buttonText: 'Browse Condiments',
    },
    {
      id: '3',
      name: 'Packed Food',
      slug: 'packed-food',
      image: packedFoodImg,
      imageAlt: 'Export-ready packaged foods in sustainable meal containers',
      buttonText: 'Browse Packed Food',
    },
  ];

  const handleBrowseCategory = (slug: string) => {
    navigate(`/products/${slug}`);
  };

  return (
    <div className="w-full bg-[#FAF7F2]">
      {/* 1. Hero Header */}
      <section className="bg-[#0E2318] text-white py-16 sm:py-20 lg:py-24 border-b border-[#1C422D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22C55E] block">
            PRODUCT CATALOGUE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Export Grade Products
          </h1>
        </div>
      </section>

      {/* 2. Category Showcase Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] sm:h-64 lg:h-72 overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Container */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6 bg-white">
                <h2 className="text-2xl sm:text-[28px] font-bold font-serif text-[#1A221E] leading-snug">
                  {cat.name}
                </h2>

                <div>
                  <button
                    type="button"
                    onClick={() => handleBrowseCategory(cat.slug)}
                    className="inline-flex items-center gap-2.5 bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all shadow-sm group-hover:shadow group/btn w-fit active:scale-95 cursor-pointer"
                  >
                    <span>{cat.buttonText}</span>
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
