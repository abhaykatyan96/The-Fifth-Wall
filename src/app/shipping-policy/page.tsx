import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, PackageCheck, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="section-kicker">White-Glove Logistics</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Shipping & Transit Policy
          </h1>
          <p className="text-xs text-[#78746D]">
            Last updated: January 2026 · Lucknow Flagship Operations
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 border border-[#EAE3D8] rounded-sm shadow-sm space-y-8 text-xs text-[#555] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">1. Complimentary White-Glove Shipping</h2>
            <p>
              THE FIFTH WALL is pleased to provide complimentary expedited shipping across India on all orders valuing <strong>₹4,999 and above</strong>. For orders below ₹4,999, a flat nominal handling fee of ₹499 is applied at checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">2. Crated Packaging & Protection</h2>
            <p>
              Due to the sculptural and artisanal nature of our pieces (including hand-carved Roman travertine, mouth-blown opal glass, and extruded brass profiles), all chandeliers and large luminaires are packed in multi-ply shock-absorbent engineered foam and reinforced timber framework.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">3. Dispatch Timelines & Transit Speeds</h2>
            <p>
              Standard in-stock catalogue pieces are dispatched from our Lucknow central fulfillment hub within <strong>24 to 48 business hours</strong>. Custom dimensional adjustments, tailored finishes, or bespoke commissions require 10 to 14 business days.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata): 2 to 4 business days.</li>
              <li>Tier-1 & Tier-2 Regional Hubs: 4 to 6 business days.</li>
              <li>Bespoke Crated Consignments: Dispatched via dedicated surface logistics with live tracking.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">4. Full Transit Insurance</h2>
            <p>
              Every consignment from THE FIFTH WALL travels under 100% comprehensive transit insurance. In the rare event of transit disturbance or glass breakage, our studio dispatches immediate replacement modules upon photographic verification within 48 hours of delivery.
            </p>
          </section>

          <div className="pt-6 border-t border-[#EAE3D8] flex items-center justify-between">
            <span className="text-[#78746D]">Have tracking questions about your consignment?</span>
            <Link href="/track-order" className="text-[#B69A69] font-medium hover:underline">
              Track Order Consignment →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
