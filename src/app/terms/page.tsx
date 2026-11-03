import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="section-kicker">Terms of Service</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#78746D]">
            Last modified: January 2026 · THE FIFTH WALL
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 border border-[#EAE3D8] rounded-sm shadow-sm space-y-8 text-xs text-[#555] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">1. Acceptance of Terms</h2>
            <p>
              By accessing the website and purchasing architectural luminaires from THE FIFTH WALL, you agree to be bound by these Terms and Conditions in accordance with Indian commercial regulations and consumer protection frameworks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">2. Artisanal Variation & Materials</h2>
            <p>
              Our pieces incorporate genuine natural materials including hand-cut travertine stone, aged brass castings, mouth-blown art glass, and natural solid American walnut. Minor natural veining, textural pores, or subtle patination differences are hallmarks of authentic craftsmanship and are not considered manufacturing defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">3. Pricing, GST & Taxes</h2>
            <p>
              All prices shown on THE FIFTH WALL are in Indian Rupees (INR) and are stored in integer paise. Prices include applicable Goods and Services Tax (GST) as per Indian statutory requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">4. Intellectual Property</h2>
            <p>
              All luminaire designs, brand identity, photographs, typography, and website copy are proprietary assets of THE FIFTH WALL. Unauthorized commercial reproduction is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
