'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';

interface BestsellerCarouselProps {
  products: Product[];
}

export default function BestsellerCarousel({ products }: BestsellerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const bestsellers = products.filter((p) => p.is_bestseller);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white border-t border-[#EAE3D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 border-b border-[#EAE3D8] pb-6">
          <div>
            <span className="section-kicker">04 / Permanent Classics</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
              Bestsellers <em>Carousel.</em>
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full border border-[#D9CFC0] hover:border-[#151515] hover:bg-[#151515] hover:text-white flex items-center justify-center transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full border border-[#D9CFC0] hover:border-[#151515] hover:bg-[#151515] hover:text-white flex items-center justify-center transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
            >
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </div>
          ))}
        </div>

        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
