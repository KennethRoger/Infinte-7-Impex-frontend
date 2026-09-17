import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../../context/RouterContext';
import { ProductApiService } from '../../services/product.service';
import type { PopulatedProduct } from '../../types/product';
import defaultProduceImg from '../../assets/products/fresh-vegetables.jpg';

export const FeaturedProductsSection: React.FC = () => {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<PopulatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestProducts = async () => {
      try {
        const allProds = await ProductApiService.getAllPublic();
        const active = allProds.filter((p) => !p.isRemoved);
        if (isMounted) {
          // Take the 3 latest products
          setProducts(active.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProductClick = (product: PopulatedProduct) => {
    const catSlug = product.category?.name
      ? product.category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : 'produce';
    navigate(`/products/${catSlug}/${product._id}`);
  };

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

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#C88A2C] transition-colors shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Latest Featured Products Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-xs flex flex-col animate-pulse"
              >
                <div className="w-full h-64 sm:h-72 bg-slate-200" />
                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-28 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const coverImg = product.images?.[0] || defaultProduceImg;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#C88A2C]/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Product Image */}
                  <div className="w-full h-64 sm:h-72 overflow-hidden bg-slate-100 relative">
                    <img
                      src={coverImg}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultProduceImg;
                      }}
                    />
                    {product.images && product.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {product.images.length} photos
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5 bg-white">
                    <div className="space-y-3">
                      {/* Category Badge */}
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C88A2C]">
                        {product.category?.name || 'Produce'}
                      </span>

                      <h3 className="text-2xl font-bold font-serif text-[#1A221E] leading-snug group-hover:text-[#8A5A1B] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {product.description ||
                          'Export-grade produce rigorously inspected, graded, and packed for international shipping.'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleProductClick(product)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A221E] group/btn hover:text-[#C88A2C] transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
