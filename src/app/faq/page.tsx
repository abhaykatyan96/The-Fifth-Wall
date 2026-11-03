'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'What makes THE FIFTH WALL lighting pieces different from conventional lighting?',
    a: 'We design from an architectural perspective, viewing the ceiling as the "Fifth Wall". Our luminaires use solid brass castings, honed Roman travertine, aeronautical-grade aluminum, and optical-grade acrylics with high-CRI (95+) warm 3000K circadian LED engines. Each piece is engineered to become part of the architecture, not just a standalone fixture.',
  },
  {
    q: 'How does shipping and packaging work for delicate chandeliers and pendants?',
    a: 'Every piece is packaged in custom dense foam and timber-reinforced crating specifically engineered for long-distance transit across India. Orders above ₹4,999 qualify for complimentary white-glove transit with full transit insurance.',
  },
  {
    q: 'Are your lighting fixtures compatible with home automation and dimmers?',
    a: 'Yes. Most of our fixtures support standard Triac / Phase-cut dimmers as well as 0-10V / DALI home automation systems (such as Lutron, Control4, and Schneider). If your residence has specific automation protocols, contact our engineering concierge prior to placing your order.',
  },
  {
    q: 'What is the warranty coverage on THE FIFTH WALL illumination?',
    a: 'All lighting fixtures come with an all-inclusive 2-Year Manufacturer Warranty covering internal LED drivers, light engines, and structural finishes. Luxury ceiling fans carry a 5-Year BLDC Motor Warranty.',
  },
  {
    q: 'Can I request customized rod lengths, drop heights, or custom brass plating?',
    a: 'Yes. For high-ceiling foyers, staircases, or custom dining tables, we offer bespoke suspension adjustments and finishes. Submit your requirements through our Design Consultation form or speak directly with our Lucknow studio.',
  },
  {
    q: 'Do you offer installation services?',
    a: 'All products arrive with detailed architectural schematics, ceiling weight distribution guides, and installation hardware for your qualified electrician. For premier residences in Lucknow and Delhi NCR, our in-house installation team can be arranged upon request.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="section-kicker">Client Inquiries</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Frequently Asked <em>Questions.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#78746D] max-w-lg mx-auto leading-relaxed">
            Essential information regarding our materials, electrical standards, white-glove transit, and architectural consultation.
          </p>
        </div>

        <div className="bg-white border border-[#EAE3D8] rounded-sm divide-y divide-[#EAE3D8] shadow-sm">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-6">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-serif text-lg text-[#151515] font-medium">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B69A69] transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-[#555] leading-relaxed mt-3 pt-3 border-t border-[#F6F3ED] animate-fadeIn">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#242321] text-white p-8 rounded-sm text-center space-y-4">
          <h3 className="font-serif text-2xl font-light">Have a Specific Project Question?</h3>
          <p className="text-xs text-[#D9CFC0] max-w-md mx-auto">
            Our lighting architects are on hand to review floorplans, ceiling heights, and electrical drawings.
          </p>
          <Link href="/contact" className="gold-button inline-flex py-3 px-6 text-xs tracking-wider">
            <span>Connect with Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
