'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    client: 'Vikram Malhotra',
    residence: 'The Magnolias, DLF Phase V, Gurgaon',
    review:
      'The Halo Drift statement ceiling light completely transformed our duplex living room. The warm champagne finish looks even more magnificent in person. Truly international quality that rivals Milan design week pieces.',
    rating: 5,
    piecePurchased: 'Halo Drift Ceiling Light',
  },
  {
    id: 2,
    client: 'Radhika Singhania',
    residence: 'Prithviraj Road Residence, New Delhi',
    review:
      'We ordered the Oro Loop for our dining area. The white-glove packaging was immaculate, and the three adjustable rings allow you to create distinct geometric moods depending on the evening.',
    rating: 5,
    piecePurchased: 'Oro Loop Three-Ring Pendant',
  },
  {
    id: 3,
    client: 'Arjun Kapoor',
    residence: 'Bandra West Penthouse, Mumbai',
    review:
      'The Botanica Glow sconces bring such a serene warmth to our master bedroom corridor. The cast brass feels substantial, textured, and timeless. The Fifth Wall team provided stellar lighting layout advice.',
    rating: 5,
    piecePurchased: 'Botanica Glow Double Sconce',
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setCurrent((prev) => (prev + 1) % REVIEWS.length);

  const item = REVIEWS[current];

  return (
    <section className="py-24 bg-[#0D0D0D] border-t border-[#2E261B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Quote className="w-8 h-8 text-[#C5A059] opacity-75" />
        </div>

        <span className="section-kicker">07 / Architectural Commendations</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
          Spaces <em className="text-[#C5A059]">Transformed.</em>
        </h2>

        {/* Testimonial Card */}
        <div className="mt-12 p-8 sm:p-12 bg-[#141414] border border-[#2E261B] rounded-sm relative shadow-2xl">
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 text-[#C5A059] mb-6">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current stroke-none" />
            ))}
          </div>

          <p className="font-serif text-xl sm:text-2xl text-[#F5EEDB] font-normal leading-relaxed max-w-3xl mx-auto italic">
            &ldquo;{item.review}&rdquo;
          </p>

          <div className="mt-8 pt-6 border-t border-[#2E261B]">
            <h4 className="font-serif text-lg font-medium text-[#F5EEDB]">{item.client}</h4>
            <p className="text-xs text-[#9E9788]">{item.residence}</p>
            <p className="text-[11px] text-[#C5A059] font-medium mt-1 uppercase tracking-wider">
              Piece: {item.piecePurchased}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#2E261B] bg-[#181818] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] flex items-center justify-center transition"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#9E9788] font-mono">
              0{current + 1} / 0{REVIEWS.length}
            </span>
            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#2E261B] bg-[#181818] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] flex items-center justify-center transition"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
