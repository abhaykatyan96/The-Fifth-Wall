import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="section-kicker">Data Protection</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#78746D]">
            Effective Date: January 1, 2026 · THE FIFTH WALL Studio
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 border border-[#EAE3D8] rounded-sm shadow-sm space-y-8 text-xs text-[#555] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">1. Overview & Commitment</h2>
            <p>
              THE FIFTH WALL operates as a luxury lighting and interiors atelier in India. We treat our clients&apos; privacy with the utmost discretion and do not sell, rent, or lease customer contact information to third-party commercial marketing brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">2. Information We Collect</h2>
            <p>
              When you place an order, request a bespoke lighting consultation, or subscribe to our Private Journal, we collect necessary contact information (name, delivery address, phone number, email address) and specifications related to your architectural project.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">3. Payment Security & PCI Compliance</h2>
            <p>
              All online transactions are securely encrypted via Razorpay&apos;s PCI-DSS Level 1 certified infrastructure. THE FIFTH WALL never accesses, stores, or captures your complete credit card numbers, CVV, or banking passwords on our local servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#151515]">4. Communication & Advisory Notes</h2>
            <p>
              We only send emails concerning order confirmation, tracking updates, and optional invitations to architectural collection drops if you have explicitly joined our private circle. You may unsubscribe from newsletters at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
