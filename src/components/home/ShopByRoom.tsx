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
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Dining Room',
    categorySlug: 'pendant-lights',
    description: 'Kinetic rings and sculpted glass luminaires suspended above dining tables.',
    imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Bedroom Suite',
    categorySlug: 'wall-lights',
    description: 'Soft indirect glow sconces and gentle reading pendants.',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Grand Entryway',
    categorySlug: 'chandeliers',
    description: 'First impressions anchored by monumental multi-tier brass or crystal orbs.',
    imageUrl: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Kitchen & Island',
    categorySlug: 'pendant-lights',
    description: 'Targeted fluted crystal cylinders and high-CRI task illumination.',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Outdoor Spaces',
    categorySlug: 'outdoor-lighting',
    description: 'Weatherproof antiqued bronze sconces and terrace lantern pillars.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
  },
];

export default function ShopByRoom() {
  return (
    <section className="py-24 bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#EAE3D8] pb-8">
          <div>
            <span className="section-kicker">03 / Curated Environments</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
              Shop By <em>Room.</em>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#78746D] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Every architectural zone requires its own rhythm of light. Explore tailored recommendations crafted specifically for each setting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOMS.map((room) => (
            <Link
              key={room.name}
              href={`/collections/${room.categorySlug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-[#EAE3D8] border border-[#EAE3D8] hover:border-[#B69A69] transition-all duration-300"
            >
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 z-10 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal">{room.name}</h3>
                  <p className="text-xs text-[#D9CFC0] mt-1 font-light line-clamp-1">
                    {room.description}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-[#B69A69] group-hover:border-[#B69A69] group-hover:text-[#151515] transition flex-shrink-0 ml-3">
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
