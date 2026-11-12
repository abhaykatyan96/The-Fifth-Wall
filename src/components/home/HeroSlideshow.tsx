'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { HeroSlide } from '@/types/database';

interface HeroSlideshowProps {
  slides: HeroSlide[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  // Auto rotate every 7 seconds
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#0A0A0A] flex items-center">
      {/* Background Slides */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={s.image_url}
            alt={s.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-linear"
          />
          {/* Subtle cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-2xl text-left space-y-6 animate-fadeIn">
          <div className="inline-flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#C5A059]" />
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E5C378] font-medium">
              {slide.eyebrow}
            </p>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#F5EEDB] leading-[1.08] tracking-tight">
            {slide.title}
          </h1>

          <p className="font-serif text-xl sm:text-2xl text-[#E5C378] italic font-light">
            {slide.subtitle}
          </p>

          <p className="text-xs sm:text-sm leading-relaxed text-[#9E9788] max-w-xl font-light">
            {slide.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href={slide.cta_link}
              className="gold-button py-4 px-8 text-xs tracking-[0.2em]"
            >
              <span>{slide.cta_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={slide.secondary_link}
              className="inline-flex items-center justify-center gap-2 py-4 px-8 text-xs tracking-[0.2em] uppercase font-medium text-[#E5C378] border border-[#C5A059]/50 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition backdrop-blur-sm"
            >
              <span>{slide.secondary_text}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-12 right-8 z-20 hidden sm:flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="w-12 h-12 rounded-full border border-[#2E261B] bg-black/50 hover:bg-[#C5A059] hover:text-[#0A0A0A] text-[#C5A059] flex items-center justify-center transition backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-mono text-[#E5C378] px-2">
          0{current + 1} / 0{slides.length}
        </span>

        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="w-12 h-12 rounded-full border border-[#2E261B] bg-black/50 hover:bg-[#C5A059] hover:text-[#0A0A0A] text-[#C5A059] flex items-center justify-center transition backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Indicators & Scroll Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <div className="flex items-center space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === current ? 'w-8 bg-[#C5A059]' : 'w-2 bg-[#2E261B] hover:bg-[#C5A059]/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <a
          href="#trust"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C5A059]/80 hover:text-[#F5EEDB] transition mt-2"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
