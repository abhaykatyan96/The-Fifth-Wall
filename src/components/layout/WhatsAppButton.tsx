'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  const phoneNumber = '919876543210';
  const message = encodeURIComponent(
    'Hello THE FIFTH WALL, I would like to inquire about design consultation, statement lighting, and bespoke interior pieces.'
  );

  return (
    <aside aria-label="Support and Concierge" className="fixed bottom-6 right-6 z-30">
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#1ebd59] transition-all duration-300 hover:scale-105"
        aria-label="Chat on WhatsApp with THE FIFTH WALL Concierge"
      >
        <MessageCircle className="w-5 h-5 fill-white stroke-none" />
        <span className="hidden sm:inline text-xs font-medium tracking-wide uppercase">
          Design Concierge
        </span>
      </a>
    </aside>
  );
}
