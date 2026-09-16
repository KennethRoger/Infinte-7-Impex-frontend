import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { blogsData } from '../data/blogsData';

export const BlogListPage: React.FC = () => {
  const { navigate } = useRouter();

  const handleCardClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      {/* 1. Dark Emerald Hero Header */}
      <section className="bg-[#0E2318] text-white py-14 sm:py-18 lg:py-20 border-b border-[#1C422D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#22C55E] block">
            INSIGHTS &amp; UPDATES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            The Export Brief
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl leading-relaxed font-normal pt-1">
            Market intelligence, how-to guides, and operational insights for agri-importers sourcing
            from India.
          </p>
        </div>
      </section>

      {/* 2. Blog Cards List */}
      <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {blogsData.map((blog) => (
            <article
              key={blog.slug}
              onClick={() => handleCardClick(blog.slug)}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-12 group cursor-pointer"
            >
              {/* Image Container */}
              <div className="md:col-span-5 lg:col-span-4 h-56 sm:h-64 md:h-auto overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.image}
                  alt={blog.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content */}
              <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white">
                <div className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl lg:text-[24px] font-bold text-[#1A221E] group-hover:text-[#8A5A1B] transition-colors leading-snug">
                    {blog.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {blog.description}
                  </p>
                </div>

                {/* Read Link */}
                <div className="flex justify-end pt-2">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-[#C88A2C] transition-colors inline-flex items-center gap-1.5">
                    <span>Read</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
