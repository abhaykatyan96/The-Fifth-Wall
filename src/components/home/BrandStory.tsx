'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-28 bg-[#0D0D0D] text-[#F5EEDB] border-t border-[#2E261B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] relative bg-[#141414] rounded-sm overflow-hidden border border-[#2E261B] shadow-2xl">
              <img
                src="/images/about-chandelier.jpg"
                alt="The Fifth Wall Flagship Architectural Interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Small floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#C5A059] text-[#0A0A0A] p-6 rounded-sm shadow-2xl hidden sm:block max-w-[200px] border border-[#E5C378]/40">
              <span className="font-serif text-3xl font-light">TFW</span>
              <p className="text-[10px] tracking-widest uppercase mt-1 font-bold">
                Lucknow · India
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="section-kicker">06 / Our Philosophy</span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#F5EEDB] font-light leading-tight">
              Lighting. <br />
              <em className="text-[#C5A059]">Interiors. Beyond.</em>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#9E9788] font-light leading-relaxed">
              <p>
                The Fifth Wall is where lighting and interiors come together to transform the way a space feels. Inspired by the ceiling—the often-overlooked Fifth Wall—our philosophy is to look beyond the ordinary and create spaces with character, warmth, and elegance.
              </p>
              <p>
                From statement lighting and architectural illumination to refined interiors and décor, every element is thoughtfully curated to bring beauty and purpose into your home. We believe great design is not just about how a space looks, but how it makes you feel.
              </p>
              <p className="font-serif text-lg text-[#F5EEDB] italic pt-2">
                The Fifth Wall — transforming spaces into experiences.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/about"
                className="gold-button py-4 px-8 text-xs tracking-[0.2em]"
              >
                <span>Discover Our Point of View</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#C5A059] hover:text-[#E5C378] transition underline underline-offset-8"
              >
                Visit Lucknow Showroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
