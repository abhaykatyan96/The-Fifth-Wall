'use client';

import React from 'react';
import { Truck, ShieldCheck, Sparkles, Headphones } from 'lucide-react';

export default function TrustBar() {
  return (
    <section id="trust" className="bg-[#0D0D0D] border-b border-[#2E261B] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#2E261B] flex items-center justify-center text-[#C5A059] flex-shrink-0">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-serif text-base text-[#F5EEDB] font-normal">Pan-India Delivery</h3>
              <p className="text-xs text-[#9E9788] mt-0.5">Complimentary above ₹4,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#2E261B] flex items-center justify-center text-[#C5A059] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-serif text-base text-[#F5EEDB] font-normal">2-Year Warranty</h3>
              <p className="text-xs text-[#9E9788] mt-0.5">On all illumination fixtures</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#2E261B] flex items-center justify-center text-[#C5A059] flex-shrink-0">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-serif text-base text-[#F5EEDB] font-normal">Design Assistance</h3>
              <p className="text-xs text-[#9E9788] mt-0.5">Free custom lighting plan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#2E261B] flex items-center justify-center text-[#C5A059] flex-shrink-0">
              <Headphones className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-serif text-base text-[#F5EEDB] font-normal">Dedicated Support</h3>
              <p className="text-xs text-[#9E9788] mt-0.5">Mon–Sat, 10:30 am – 8:00 pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
