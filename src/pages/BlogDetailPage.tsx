import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { blogsData } from '../data/blogsData';

interface BlogDetailPageProps {
  slug?: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug }) => {
  const { currentPath, navigate } = useRouter();

  // Extract slug from URL if not provided directly
  const extractedSlug =
    slug || currentPath.replace(/^\/blog\/?/, '').split('/')[0] || blogsData[0].slug;

  const currentBlog =
    blogsData.find((b) => b.slug === extractedSlug) || blogsData[0];

  const handleScrollToQuote = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const element = document.getElementById('get-quote');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 1. Back to Blog Navigation */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-[#C88A2C] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* 2. Full-Width Featured Image Banner */}
        <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-[#E5DCD1] shadow-sm">
          <img
            src={currentBlog.image}
            alt={currentBlog.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3. Article Content Container */}
        <article className="max-w-4xl mx-auto space-y-8 sm:space-y-10 pt-4 sm:pt-6">
          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] leading-tight tracking-tight">
            {currentBlog.title}
          </h1>

          {/* Lead Intro Description */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {currentBlog.description}
          </p>

          {/* Mapped Sections (BlogSectionSchema: { sectionTitle, description }) */}
          <div className="space-y-8 sm:space-y-10 pt-2">
            {currentBlog.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                {section.sectionTitle && (
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A221E]">
                    {section.sectionTitle}
                  </h2>
                )}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {section.description}
                </p>
              </section>
            ))}
          </div>

          {/* 4. Ready to source from India Callout Box */}
          <div className="bg-[#ECE5D8]/70 border border-[#D5CBC0] rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center space-y-4 sm:space-y-5 my-10 sm:my-14">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A221E]">
              Ready to source from India?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
              Our export team is available to answer questions and provide a quote.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToQuote}
                className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
