'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EditorialSection() {
  return (
    <section className="relative py-32 bg-[#060606] text-[#F5EEDB] border-t border-[#2E261B] overflow-hidden">
      {/* Background Architectural Accent */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/images/editorial-lounge.jpg"
          alt="Editorial Living Room Illumination"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold block">
          The Fifth Wall Editorial
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#F5EEDB] leading-tight tracking-tight">
          Light Is More Than <em className="text-[#C5A059]">Illumination.</em>
        </h2>

        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto" />

        <p className="font-serif text-xl sm:text-2xl text-[#E5C378] font-light italic max-w-2xl mx-auto leading-relaxed">
          &ldquo;It is the feeling of coming home, the warmth of a moment, and the character of a space.&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-[#9E9788] max-w-xl mx-auto font-light leading-relaxed">
          Inspired by the ceiling—the often-overlooked Fifth Wall—our pieces exist at the intersection of sculptural art and architectural discipline, casting warmth that settles into the soul of your residence.
        </p>

        <div className="pt-4">
          <Link
            href="/about"
            className="gold-button inline-flex py-4 px-8 text-xs tracking-[0.2em]"
          >
            <span>Read Our Full Story</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
