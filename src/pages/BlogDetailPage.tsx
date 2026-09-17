import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { BlogApiService } from '../services/blog.service';
import { blogsData } from '../data/blogsData';
import type { Blog } from '../types/blog';

// Fallback demo image
import defaultArticleImg from '../assets/process/ship-delivery.jpg';

interface BlogDetailPageProps {
  id?: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ id: propId }) => {
  const { currentPath, navigate } = useRouter();

  // Extract article ID or slug from URL if not provided directly
  // Route pattern: /blog/:id
  const extractedParam = propId || currentPath.replace(/^\/blog\/?/, '').split('/')[0] || '';

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlog = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const isHexId = /^[0-9a-fA-F]{24}$/.test(extractedParam);

    // 1. Try fetching by MongoDB ID
    if (isHexId) {
      try {
        const data = await BlogApiService.getById(extractedParam);
        setBlog(data);
        setIsLoading(false);
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Article not found';
        setError(msg);
      }
    }

    // 2. Try searching by title or slug from public API
    try {
      const publicResult = await BlogApiService.getAll({ title: extractedParam });
      if (publicResult.data.length > 0) {
        const matched = await BlogApiService.getById(publicResult.data[0]._id);
        setBlog(matched);
        setIsLoading(false);
        return;
      }
    } catch {
      // Non-blocking, continue to demo fallback
    }

    // 3. Fallback for legacy static prototype slugs
    const demoMatch = blogsData.find(
      (b) => b.slug === extractedParam || extractedParam.includes(b.slug)
    );
    if (demoMatch) {
      setBlog({
        _id: demoMatch.slug,
        title: demoMatch.title,
        description: demoMatch.description,
        image: demoMatch.image,
        sections: demoMatch.sections,
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setError('The requested article could not be found.');
  }, [extractedParam]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  const handleScrollToQuote = () => {
    navigate('/#get-quote');
    setTimeout(() => {
      const element = document.getElementById('get-quote');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A859]" />
        <p className="text-sm font-medium text-slate-600">Loading market brief...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[60vh] py-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5DCD1] p-8 text-center space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-serif text-[#1A221E]">Article Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {error || 'We could not find the market intelligence brief you requested.'}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 1. Back to Blog Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-[#C88A2C] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>

          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(blog.createdAt)}</span>
          </span>
        </div>

        {/* 2. Full-Width Featured Image Banner - Ambient backdrop and balanced height */}
        <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[440px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-[#E5DCD1] shadow-sm relative flex items-center justify-center">
          {/* Ambient blurred backdrop for portrait / non-standard images */}
          <img
            src={blog.image || defaultArticleImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-35 select-none pointer-events-none"
          />
          {/* Main Sharp Foreground Image */}
          <img
            src={blog.image || defaultArticleImg}
            alt={blog.title}
            className="w-full h-full object-cover object-center relative z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultArticleImg;
            }}
          />
        </div>

        {/* 3. Article Content Container */}
        <article className="max-w-4xl mx-auto space-y-8 sm:space-y-10 pt-4 sm:pt-6">
          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Lead Intro Description */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5DCD1] shadow-xs">
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
              {blog.description}
            </p>
          </div>

          {/* Mapped Dynamic Sections (1 to 5 sections) */}
          <div className="space-y-8 sm:space-y-10 pt-2">
            {blog.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                {section.sectionTitle && (
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A221E]">
                    {section.sectionTitle}
                  </h2>
                )}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
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
              Our export trade desk is available to answer inquiries, verify phytosanitary standards,
              and prepare custom ocean freight CIF quotes.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToQuote}
                className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
