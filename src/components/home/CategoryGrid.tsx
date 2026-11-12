'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/database';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#2E261B] pb-8">
          <div>
            <span className="section-kicker">01 / Curated Collections</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
              Top <em className="text-[#C5A059]">Collections.</em>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9E9788] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            From sculptural chandeliers to ambient wall luminaires and considered furniture pieces, explore atmospheres designed to elevate every angle of your home.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className={`group relative overflow-hidden bg-[#141414] border border-[#2E261B] hover:border-[#C5A059] transition-all duration-500 rounded-sm ${
                idx === 0 || idx === 6 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
              }`}
            >
              <img
                src={cat.image_url || '/images/hero/hero-grand-chandelier.jpg'}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black/95" />

              {/* Text Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between z-10 text-white">
                <div className="space-y-1.5 max-w-sm">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-medium block">
                    The Fifth Wall Collection
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F5EEDB]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#9E9788] line-clamp-2 font-light">
                    {cat.description}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-[#0A0A0A] transition flex-shrink-0 ml-4">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
