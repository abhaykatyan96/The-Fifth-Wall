'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RoomItem {
  name: string;
  categorySlug: string;
  description: string;
  imageUrl: string;
}

const ROOMS: RoomItem[] = [
  {
    name: 'Living Room',
    categorySlug: 'chandeliers',
    description: 'Statement chandeliers and ambient architectural cove illumination.',
    imageUrl: '/images/rooms/living-room.jpg',
  },
  {
    name: 'Dining Room',
    categorySlug: 'pendant-lights',
    description: 'Kinetic rings and sculpted glass luminaires suspended above dining tables.',
    imageUrl: '/images/hero/hero-rings-chandelier.jpg',
  },
  {
    name: 'Bedroom Suite',
    categorySlug: 'wall-lights',
    description: 'Soft indirect glow sconces and gentle reading pendants.',
    imageUrl: '/images/rooms/bedroom-suite.jpg',
  },
  {
    name: 'Grand Entryway',
    categorySlug: 'chandeliers',
    description: 'First impressions anchored by monumental multi-tier brass or crystal orbs.',
    imageUrl: '/images/rooms/grand-entryway.jpg',
  },
  {
    name: 'Kitchen & Island',
    categorySlug: 'pendant-lights',
    description: 'Targeted fluted crystal cylinders and high-CRI task illumination.',
    imageUrl: '/images/rooms/kitchen-island.jpg',
  },
  {
    name: 'Outdoor Spaces',
    categorySlug: 'outdoor-lighting',
    description: 'Weatherproof antiqued bronze sconces and terrace lantern pillars.',
    imageUrl: '/images/rooms/outdoor-terrace.jpg',
  },
];

export default function ShopByRoom() {
  return (
    <section className="py-24 bg-[#0A0A0A] border-t border-[#2E261B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#2E261B] pb-8">
          <div>
            <span className="section-kicker">03 / Curated Environments</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
              Shop By <em className="text-[#C5A059]">Room.</em>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9E9788] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Every architectural zone requires its own rhythm of light. Explore tailored recommendations crafted specifically for each setting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOMS.map((room) => (
            <Link
              key={room.name}
              href={`/collections/${room.categorySlug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-[#141414] border border-[#2E261B] hover:border-[#C5A059] transition-all duration-300"
            >
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 z-10 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#F5EEDB]">{room.name}</h3>
                  <p className="text-xs text-[#9E9788] mt-1 font-light line-clamp-1">
                    {room.description}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-[#0A0A0A] transition flex-shrink-0 ml-3">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
