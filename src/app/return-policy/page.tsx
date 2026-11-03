import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Check } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="section-kicker">Client Protection</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Return & Refund Policy
          </h1>
          <p className="text-xs text-[#78746D]">
            Authentic craftsmanship and defect-free guarantee on all architectural pieces.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 border border-[#EAE3D8] rounded-sm shadow-sm space-y-8 text-xs text-[#555] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">1. Transit Damage & Defect Replacement</h2>
            <p>
              Each illumination fixture is inspected under photometric sensors prior to departure from Lucknow. If your piece arrives with transit damage, unboxing defects, or glass imperfections, report the item within <strong>7 days of delivery</strong> with photos or video of the packaging to studio@thefifthwall.in.
            </p>
            <p>
              We will immediately arrange a complimentary reverse pickup and issue a brand-new replacement module without additional shipping charges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">2. 2-Year Comprehensive Warranty</h2>
            <p>
              All electrical fixtures purchased from THE FIFTH WALL are guaranteed for two (2) full years against internal transformer failure, LED light engine degradation, and structural plating delamination under normal residential conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">3. Custom & Made-to-Order Commissions</h2>
            <p>
              Because bespoke chandeliers, custom rod lengths, and made-to-order stone carvings are tailored to unique architectural dimensions, custom pieces are non-cancellable once fabrication has commenced. However, our warranty covers all replacement parts and technical adjustments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">4. Refund Process</h2>
            <p>
              Approved refunds are processed via the original payment method (Razorpay online return to UPI/Card or NEFT for verified bank transfers) within 5 to 7 business days from receipt and inspection at our central warehouse.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
